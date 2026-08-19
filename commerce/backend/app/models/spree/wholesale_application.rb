# frozen_string_literal: true

module Spree
  class WholesaleApplication < Spree.base_class
    STATUSES = %w[pending approved rejected revoked].freeze
    TIERS = %w[wholesale distro].freeze

    TIER_GROUP_NAMES = {
      'wholesale' => 'Wholesale',
      'distro' => 'Distro'
    }.freeze

    belongs_to :store, class_name: 'Spree::Store'
    belongs_to :user, class_name: 'Spree::User', optional: true
    belongs_to :reviewed_by, class_name: 'Spree::AdminUser', optional: true

    validates :company_name, :contact_name, :email, :status, presence: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :status, inclusion: { in: STATUSES }
    validates :tier, inclusion: { in: TIERS }, allow_nil: true
    validates :email, uniqueness: {
      scope: :store_id,
      conditions: -> { where(status: %w[pending approved]) },
      message: 'already has an open or approved wholesale application'
    }

    scope :pending, -> { where(status: 'pending') }
    scope :approved, -> { where(status: 'approved') }
    scope :active_accounts, -> { where(status: 'approved') }

    self.whitelisted_ransackable_attributes = %w[
      company_name contact_name email status tier phone license_number created_at
    ]
    self.whitelisted_ransackable_associations = %w[user]

    def pending?
      status == 'pending'
    end

    def approved?
      status == 'approved'
    end

    def tier_label
      TIER_GROUP_NAMES[tier]
    end

    def self.customer_group_for!(store, tier)
      name = TIER_GROUP_NAMES.fetch(tier)
      store.customer_groups.find_by!(name: name)
    end

    def self.b2b_group_ids_for(store)
      store.customer_groups.where(name: TIER_GROUP_NAMES.values).pluck(:id)
    end

    # Creates the Spree customer (if needed) and adds them to the chosen tier group.
    def approve!(tier:, admin_user: nil)
      raise ArgumentError, 'invalid tier' unless TIERS.include?(tier.to_s)
      raise 'only pending applications can be approved' unless pending?

      transaction do
        ensure_user!
        assign_tier_group!(tier.to_s)

        update!(
          status: 'approved',
          tier: tier.to_s,
          reviewed_at: Time.current,
          reviewed_by: admin_user
        )
      end
    end

    def reject!(admin_user: nil)
      raise 'only pending applications can be rejected' unless pending?

      update!(
        status: 'rejected',
        reviewed_at: Time.current,
        reviewed_by: admin_user
      )
    end

    def revoke!
      raise 'only approved applications can be removed' unless approved?

      transaction do
        remove_from_b2b_groups!
        update!(
          status: 'revoked',
          tier: nil,
          reviewed_at: Time.current
        )
      end
    end

    def change_tier!(tier:, admin_user: nil)
      raise ArgumentError, 'invalid tier' unless TIERS.include?(tier.to_s)
      raise 'only approved applications can change tier' unless approved?

      transaction do
        ensure_user!
        assign_tier_group!(tier.to_s)
        update!(
          tier: tier.to_s,
          reviewed_at: Time.current,
          reviewed_by: admin_user
        )
      end
    end

    private

    def ensure_user!
      return if user.present?

      existing = Spree.user_class.find_by(email: email.downcase)
      if existing
        update!(user: existing)
        return
      end

      raise 'application has no linked user — ask applicant to re-apply with a password'
    end

    def assign_tier_group!(tier_key)
      group = self.class.customer_group_for!(store, tier_key)
      other_ids = self.class.b2b_group_ids_for(store) - [group.id]
      user.customer_group_users.where(customer_group_id: other_ids).destroy_all
      group.add_customers([user.id]) unless group.user_ids.include?(user.id)
    end

    def remove_from_b2b_groups!
      return unless user

      ids = self.class.b2b_group_ids_for(store)
      user.customer_group_users.where(customer_group_id: ids).destroy_all
    end
  end
end

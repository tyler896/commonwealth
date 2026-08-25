# frozen_string_literal: true

module Spree
  class WholesaleTierSetting < Spree.base_class
    TIERS = Spree::WholesaleApplication::TIERS

    belongs_to :store, class_name: 'Spree::Store'

    validates :tier, presence: true, inclusion: { in: TIERS }
    validates :tier, uniqueness: { scope: :store_id }
    validates :minimum_order_amount,
              numericality: { greater_than_or_equal_to: 0 }

    def self.ensure_defaults!(store)
      TIERS.each do |tier|
        find_or_create_by!(store: store, tier: tier) do |row|
          row.minimum_order_amount = 0
        end
      end
    end

    def self.for_store(store)
      ensure_defaults!(store)
      where(store: store).order(:tier)
    end

    def self.minimum_for(store:, tier:)
      return 0 if tier.blank?

      ensure_defaults!(store)
      find_by(store: store, tier: tier)&.minimum_order_amount.to_d
    end

    def tier_label
      Spree::WholesaleApplication::TIER_GROUP_NAMES[tier]
    end
  end
end

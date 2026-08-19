# frozen_string_literal: true

module Spree
  class Event < Spree.base_class
    extend FriendlyId

    has_prefix_id :event if respond_to?(:has_prefix_id)
    friendly_id :slug_candidates, use: %i[slugged scoped], scope: :store_id

    belongs_to :store, class_name: 'Spree::Store'

    has_rich_text :description
    has_one_attached :featured_image
    has_many_attached :gallery_images

    validates :title, :starts_at, presence: true
    validates :slug, uniqueness: { scope: :store_id }, allow_blank: true

    before_validation :ensure_slug

    scope :published, -> { where(published: true) }
    scope :newest_first, -> { order(starts_at: :desc, created_at: :desc) }

    self.whitelisted_ransackable_attributes = %w[title slug location published starts_at created_at]
    self.whitelisted_ransackable_associations = %w[]

    def slug_candidates
      [:title, %i[title id]]
    end

    def should_generate_new_friendly_id?
      slug.blank? || will_save_change_to_title?
    end

    private

    def ensure_slug
      return if slug.present? || title.blank?

      base = title.to_s.parameterize.presence || 'event'
      candidate = base
      n = 2
      while self.class.where(store_id: store_id, slug: candidate).where.not(id: id).exists?
        candidate = "#{base}-#{n}"
        n += 1
      end
      self.slug = candidate
    end
  end
end

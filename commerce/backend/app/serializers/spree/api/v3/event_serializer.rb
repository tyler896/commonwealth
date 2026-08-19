# frozen_string_literal: true

module Spree
  module Api
    module V3
      class EventSerializer < BaseSerializer
        typelize title: :string,
                 slug: :string,
                 summary: [:string, nullable: true],
                 location: [:string, nullable: true],
                 starts_at: :string,
                 ends_at: [:string, nullable: true],
                 description: [:string, nullable: true],
                 featured_image_url: [:string, nullable: true],
                 gallery_image_urls: :object

        attributes :title, :slug, :summary, :location

        attribute :starts_at do |event|
          event.starts_at&.iso8601
        end

        attribute :ends_at do |event|
          event.ends_at&.iso8601
        end

        attribute :description do |event|
          event.description&.body&.to_html.presence || event.description&.to_plain_text
        end

        attribute :featured_image_url do |event|
          image_url_for(event.featured_image) if event.featured_image.attached?
        end

        attribute :gallery_image_urls do |event|
          next [] unless event.gallery_images.attached?

          event.gallery_images.map { |img| image_url_for(img) }.compact
        end
      end
    end
  end
end

# frozen_string_literal: true

module Spree
  module Api
    module V3
      module Store
        class EventsController < BaseController
          allow_guest_storefront_access! if respond_to?(:allow_guest_storefront_access!)

          def index
            events = event_scope.limit(limit_param)
            render json: { data: events.map { |event| serialize_event(event) } }
          end

          def show
            render json: serialize_event(find_event!)
          end

          private

          def event_scope
            Spree::Event.where(store: current_store).published.newest_first
          end

          def find_event!
            event_scope.find_by!(slug: params[:id])
          end

          def serialize_event(event)
            {
              id: event.try(:prefixed_id) || event.id.to_s,
              title: event.title,
              slug: event.slug,
              summary: event.summary,
              location: event.location,
              starts_at: event.starts_at&.iso8601,
              ends_at: event.ends_at&.iso8601,
              description: event.description&.body&.to_html.presence || event.description&.to_plain_text,
              featured_image_url: attachment_url(event.featured_image),
              gallery_image_urls: event.gallery_images.attached? ? event.gallery_images.filter_map { |img| attachment_url(img) } : []
            }
          end

          def attachment_url(attachment)
            return nil unless attachment&.attached?

            Rails.application.routes.url_helpers.rails_blob_url(
              attachment,
              host: request.base_url
            )
          rescue StandardError
            Rails.application.routes.url_helpers.rails_blob_path(attachment, only_path: true)
          rescue StandardError
            nil
          end

          def limit_param
            n = params[:limit].to_i
            n = 20 if n <= 0
            [n, 50].min
          end
        end
      end
    end
  end
end

# frozen_string_literal: true

module Spree
  module Admin
    class EventsController < ResourceController
      def create
        invoke_callbacks(:create, :before)
        @event.attributes = permitted_resource_params
        @event.store ||= current_store
        if @event.save
          invoke_callbacks(:create, :after)
          flash[:success] = flash_message_for(@event, :successfully_created)
          redirect_to location_after_save
        else
          invoke_callbacks(:create, :fails)
          render :new, status: :unprocessable_entity
        end
      end

      private

      def model_class
        Spree::Event
      end

      def collection
        super.where(store: current_store).newest_first
      end

      def build_resource
        super.tap { |event| event.store ||= current_store }
      end

      def location_after_save
        spree.edit_admin_event_path(@event)
      end

      def permitted_resource_params
        params.require(:event).permit(
          :title,
          :slug,
          :summary,
          :description,
          :starts_at,
          :ends_at,
          :location,
          :published,
          :position,
          :featured_image,
          gallery_images: []
        )
      end
    end
  end
end

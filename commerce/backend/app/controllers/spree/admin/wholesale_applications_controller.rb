# frozen_string_literal: true

module Spree
  module Admin
    class WholesaleApplicationsController < ResourceController
      before_action :load_resource, only: %i[approve reject revoke change_tier edit update]
      before_action :load_tier_settings, only: :index

      def approve
        tier = params[:tier].to_s
        unless Spree::WholesaleApplication::TIERS.include?(tier)
          flash[:error] = 'Select a tier (Wholesale or Distro).'
          redirect_to spree.edit_admin_wholesale_application_path(@wholesale_application)
          return
        end

        begin
          @wholesale_application.approve!(tier: tier, admin_user: try(:current_admin_user))
          flash[:success] = "Approved as #{@wholesale_application.tier_label}."
        rescue StandardError => e
          flash[:error] = e.message
        end
        redirect_to spree.admin_wholesale_applications_path
      end

      def reject
        begin
          @wholesale_application.reject!(admin_user: try(:current_admin_user))
          flash[:success] = 'Application rejected.'
        rescue StandardError => e
          flash[:error] = e.message
        end
        redirect_to spree.admin_wholesale_applications_path
      end

      def revoke
        begin
          @wholesale_application.revoke!
          flash[:success] = 'Wholesale access removed. Customer will see retail pricing.'
        rescue StandardError => e
          flash[:error] = e.message
        end
        redirect_to spree.admin_wholesale_applications_path
      end

      def change_tier
        tier = params[:tier].to_s
        unless Spree::WholesaleApplication::TIERS.include?(tier)
          flash[:error] = 'Select a tier (Wholesale or Distro).'
          redirect_to spree.edit_admin_wholesale_application_path(@wholesale_application)
          return
        end

        begin
          @wholesale_application.change_tier!(tier: tier, admin_user: try(:current_admin_user))
          flash[:success] = "Tier updated to #{@wholesale_application.tier_label}."
        rescue StandardError => e
          flash[:error] = e.message
        end
        redirect_to spree.edit_admin_wholesale_application_path(@wholesale_application)
      end

      private

      def model_class
        Spree::WholesaleApplication
      end

      def collection
        super.where(store: current_store).order(created_at: :desc)
      end

      def location_after_save
        spree.admin_wholesale_applications_path
      end

      def load_tier_settings
        @tier_settings = Spree::WholesaleTierSetting.for_store(current_store)
      end

      def permitted_resource_params
        params.require(:wholesale_application).permit(
          :company_name,
          :contact_name,
          :email,
          :phone,
          :website,
          :license_number,
          :notes,
          :status,
          :tier
        )
      end
    end
  end
end

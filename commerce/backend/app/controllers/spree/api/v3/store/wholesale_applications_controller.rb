# frozen_string_literal: true

module Spree
  module Api
    module V3
      module Store
        class WholesaleApplicationsController < BaseController
          # Public apply form — guests submit with publishable key only.
          allow_guest_storefront_access! if respond_to?(:allow_guest_storefront_access!)

          def create
            result = Spree::WholesaleApplicationService.apply!(
              store: current_store,
              params: application_params
            )

            if result.success?
              render json: {
                message: 'Application received. We will review it and notify you when approved.',
                application: {
                  id: result.application.id,
                  status: result.application.status,
                  email: result.application.email,
                  company_name: result.application.company_name
                }
              }, status: :created
            else
              render json: {
                error: {
                  code: 'validation_failed',
                  message: 'Could not submit wholesale application',
                  details: result.errors
                }
              }, status: :unprocessable_entity
            end
          end

          private

          def application_params
            params.permit(
              :company_name,
              :contact_name,
              :email,
              :phone,
              :website,
              :license_number,
              :notes,
              :password,
              :password_confirmation
            )
          end
        end
      end
    end
  end
end

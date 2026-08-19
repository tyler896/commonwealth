# frozen_string_literal: true

module Spree
  module Api
    module V3
      module Store
        class WholesaleTiersController < BaseController
          allow_guest_storefront_access! if respond_to?(:allow_guest_storefront_access!)

          def index
            settings = Spree::WholesaleTierSetting.for_store(current_store)
            render json: {
              data: settings.map do |s|
                {
                  tier: s.tier,
                  name: s.tier_label,
                  minimum_order_amount: s.minimum_order_amount.to_s('F')
                }
              end
            }
          end
        end
      end
    end
  end
end

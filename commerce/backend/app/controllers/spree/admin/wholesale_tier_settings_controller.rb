# frozen_string_literal: true

module Spree
  module Admin
    class WholesaleTierSettingsController < ResourceController
      def update_all
        Spree::WholesaleTierSetting.ensure_defaults!(current_store)
        errors = []

        rows = params[:settings]
        rows = rows.values if rows.respond_to?(:values) && !rows.is_a?(Array)

        Array(rows).each do |row|
          row = row.permit(:id, :minimum_order_amount) if row.respond_to?(:permit)
          setting = Spree::WholesaleTierSetting.find_by(store: current_store, id: row[:id])
          next unless setting

          amount = row[:minimum_order_amount].to_s.strip
          unless setting.update(minimum_order_amount: amount.presence || 0)
            errors.concat(setting.errors.full_messages)
          end
        end

        if errors.any?
          flash[:error] = errors.uniq.join(', ')
        else
          flash[:success] = 'Minimum order amounts saved.'
        end
        redirect_to spree.admin_wholesale_applications_path
      end

      private

      def model_class
        Spree::WholesaleTierSetting
      end
    end
  end
end

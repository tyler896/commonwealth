# frozen_string_literal: true

Rails.application.config.after_initialize do
  next unless defined?(Spree.admin)

  Spree.admin.navigation.sidebar.add :wholesale_customers,
    label: 'Wholesale Customers',
    url: :admin_wholesale_applications_path,
    icon: 'building',
    position: 42,
    active: -> { controller_name == 'wholesale_applications' },
    if: -> { can?(:manage, Spree::WholesaleApplication) }
rescue StandardError => e
  Rails.logger.warn("[wholesale] sidebar nav skipped: #{e.message}")
end

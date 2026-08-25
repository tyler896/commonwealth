# frozen_string_literal: true

Rails.application.config.after_initialize do
  next unless defined?(Spree.admin)

  Spree.admin.navigation.sidebar.add :events,
    label: 'Events',
    url: :admin_events_path,
    icon: 'calendar-event',
    position: 38,
    active: -> { controller_name == 'events' },
    if: -> { can?(:manage, Spree::Event) }
rescue StandardError => e
  Rails.logger.warn("[events] sidebar nav skipped: #{e.message}")
end

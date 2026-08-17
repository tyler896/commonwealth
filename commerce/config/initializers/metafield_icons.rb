# Storefront icons for product metafield definitions.
# Mounted into the stock Spree image via docker-compose.prod.yml.
#
# Adds an `icon` string on Spree::MetafieldDefinition (DB column), exposes it
# on Settings → Metafields forms, and includes it in Store API custom_fields.

Rails.application.config.to_prepare do
  begin
    conn = ActiveRecord::Base.connection
    if conn.data_source_exists?(:spree_metafield_definitions) &&
       !conn.column_exists?(:spree_metafield_definitions, :icon)
      conn.add_column :spree_metafield_definitions, :icon, :string
      Spree::MetafieldDefinition.reset_column_information
    end
  rescue StandardError => e
    Rails.logger.warn("[metafield_icons] column check skipped: #{e.class}: #{e.message}")
  end

  attrs = Spree::PermittedAttributes.metafield_definition_attributes
  attrs << :icon unless attrs.map(&:to_sym).include?(:icon)

  serializer = Spree::Api::V3::CustomFieldSerializer
  unless serializer.instance_variable_get(:@_commonwealth_icon)
    serializer.instance_variable_set(:@_commonwealth_icon, true)
    serializer.attribute :icon do |metafield|
      metafield.metafield_definition&.read_attribute(:icon).presence
    end
  end
end

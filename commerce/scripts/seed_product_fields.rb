# frozen_string_literal: true

# Ensure product custom-field (metafield) definitions exist, then copy values
# from product metadata / description into those fields.
#
# Run:
#   cd commerce && npm run seed:product-fields
# Or on production:
#   docker compose -f docker-compose.prod.yml exec web bin/rails runner /tmp/seed_product_fields.rb

defs = [
  { key: 'lineage', name: 'Lineage', type: 'Spree::Metafields::LongText' },
  { key: 'line', name: 'Line', type: 'Spree::Metafields::ShortText' },
  { key: 'pack', name: 'Pack', type: 'Spree::Metafields::ShortText' },
  { key: 'brand', name: 'Brand', type: 'Spree::Metafields::ShortText' }
]

created = 0
defs.each do |attrs|
  definition = Spree::MetafieldDefinition.find_or_initialize_by(
    namespace: 'properties',
    key: attrs[:key],
    resource_type: 'Spree::Product'
  )
  definition.assign_attributes(
    name: attrs[:name],
    metafield_type: attrs[:type],
    display_on: 'both',
    searchable: attrs[:key] != 'brand',
    sortable: false
  )
  if definition.new_record? || definition.changed?
    definition.save!
    created += 1
    puts "definition: #{definition.namespace}.#{definition.key} (#{definition.name})"
  else
    puts "definition exists: #{definition.namespace}.#{definition.key}"
  end
end

def extract_labeled(text, label)
  return nil if text.blank?

  match = text.match(/#{Regexp.escape(label)}:\s*(.+?)(?:\n|$)/i)
  match && match[1].to_s.strip.presence
end

def line_label(raw)
  case raw.to_s
  when 'wild-thornberry', 'Wild Thornberry' then 'Wild Thornberry'
  when 'grape-sunshine', 'Grape Sunshine' then 'Grape Sunshine'
  else raw.to_s.presence
  end
end

def pack_label(raw)
  value = raw.to_s.strip
  return '3-pack feminized' if value.blank? || value == '3-pack'
  return value if value.downcase.include?('feminized')

  "#{value} feminized"
end

updated = 0
Spree::Product.find_each do |product|
  meta = {}
  meta.merge!(product.public_metadata) if product.public_metadata.is_a?(Hash)
  meta.merge!(product.private_metadata) if product.private_metadata.is_a?(Hash)

  lineage = meta['lineage'].presence || extract_labeled(product.description, 'Lineage')
  line = line_label(meta['line'].presence || extract_labeled(product.description, 'Line'))
  pack = pack_label(meta['pack_size'].presence || meta['pack'].presence || extract_labeled(product.description, 'Pack'))
  brand = meta['brand'].presence || extract_labeled(product.description, 'Brand') || 'Commonwealth Seed Co'

  values = {
    'lineage' => lineage,
    'line' => line,
    'pack' => pack,
    'brand' => brand
  }

  changed = false
  values.each do |key, value|
    next if value.blank?

    full_key = "properties.#{key}"
    current = product.get_metafield(full_key)&.value
    next if current.to_s == value.to_s

    product.set_metafield(full_key, value)
    changed = true
  end

  if changed
    product.save!
    updated += 1
    puts "product: #{product.slug}"
  end
end

puts "Done. definitions_touched=#{created} products_updated=#{updated}"

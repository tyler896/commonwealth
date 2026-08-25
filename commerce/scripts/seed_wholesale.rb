# Commonwealth Seed Co — Wholesale / Distro customer groups + price lists
# Run via: npm run seed:wholesale (from commerce/)

store = Spree::Store.default
currency = store.default_currency.presence || 'USD'

tiers = {
  'Wholesale' => {
    description: 'Approved wholesale trade accounts',
    list_description: 'Standard wholesale catalog pricing'
  },
  'Distro' => {
    description: 'Approved distributor accounts',
    list_description: 'Distributor catalog pricing'
  }
}

tiers.each do |group_name, meta|
  group = store.customer_groups.find_or_initialize_by(name: group_name)
  group.description = meta[:description]
  group.save!

  price_list = store.price_lists.find_or_initialize_by(name: group_name)
  price_list.description = meta[:list_description]
  price_list.match_policy = 'all'
  price_list.save!

  rule = price_list.rules.find { |r| r.is_a?(Spree::PriceRules::CustomerGroupRule) }
  rule ||= Spree::PriceRules::CustomerGroupRule.new(price_list: price_list)
  rule.preferred_customer_group_ids = [group.id]
  rule.save!

  product_ids = store.products.ids
  if product_ids.any?
    price_list.add_products(product_ids)

    updates = []
    price_list.prices.includes(variant: :prices).find_each do |price|
      next if price.amount.present?

      base_amount =
        price.variant.prices.find { |p| p.price_list_id.nil? && p.currency.to_s.casecmp?(currency.to_s) }&.amount
      next unless base_amount

      # Start at retail; staff edit Distro/Wholesale amounts in Products → Price Lists.
      updates << { id: price.id, variant_id: price.variant_id, currency: currency, amount: base_amount }
    end
    price_list.bulk_update_prices(updates) if updates.any?
  end

  price_list.activate if price_list.can_activate?
  puts "✓ #{group_name}: group=#{group.id} price_list=#{price_list.id} status=#{price_list.status}"
end

Spree::WholesaleTierSetting.ensure_defaults!(store)
Spree::WholesaleTierSetting.for_store(store).each do |setting|
  puts "✓ Min order #{setting.tier_label}: $#{setting.minimum_order_amount}"
end

puts "Done. Edit tier prices under Admin → Products → Price Lists."
puts "Edit minimum orders under Admin → Wholesale Customers."

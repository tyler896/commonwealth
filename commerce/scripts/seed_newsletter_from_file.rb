# Import emails into Spree newsletter subscribers (production / local).
# Expects /tmp/newsletter_emails.txt — one email per line, or CSV with an email column.
#
#   docker compose -f docker-compose.prod.yml cp emails.txt web:/tmp/newsletter_emails.txt
#   docker compose -f docker-compose.prod.yml cp scripts/seed_newsletter_from_file.rb web:/tmp/seed_newsletter_from_file.rb
#   docker compose -f docker-compose.prod.yml exec -T web bin/rails runner /tmp/seed_newsletter_from_file.rb

path = ENV.fetch('NEWSLETTER_IMPORT_PATH', '/tmp/newsletter_emails.txt')
raise "Missing #{path}" unless File.exist?(path)

store = Spree::Store.default || Spree::Store.first
raise 'No Spree store found' unless store

raw = File.read(path)
lines = raw.lines.map(&:strip).reject(&:empty?)

emails = []
if lines.first&.downcase&.include?('email')
  headers = lines.first.split(',').map { |h| h.strip.downcase.gsub(/\A"|"\z/, '') }
  idx = headers.index('email') || headers.index('e-mail') || headers.index('email address')
  raise 'CSV has no email column' unless idx
  lines.drop(1).each do |line|
    cells = line.parse_csv rescue line.split(',')
    next unless cells
    val = cells[idx].to_s.strip.downcase.gsub(/\A"|"\z/, '')
    emails << val if val.include?('@')
  end
else
  lines.each do |line|
    val = line.strip.downcase.gsub(/\A"|"\z/, '')
    # take first email-looking token on the line
    match = val[/\b[^@\s,;]+@[^@\s,;]+\.[^@\s,;]+\b/]
    emails << match if match
  end
end

emails = emails.uniq
created = 0
updated = 0
skipped = 0

emails.each do |email|
  sub = Spree::NewsletterSubscriber.find_or_initialize_by(email: email, store_id: store.id)
  if sub.new_record?
    sub.verified_at = Time.current if sub.respond_to?(:verified_at=)
    sub.save!
    created += 1
  else
    if sub.respond_to?(:verified_at) && sub.verified_at.blank?
      sub.verified_at = Time.current
      sub.save!
      updated += 1
    else
      skipped += 1
    end
  end
rescue StandardError => e
  warn "skip #{email}: #{e.message}"
end

puts "newsletter_import created=#{created} updated=#{updated} skipped=#{skipped} total_input=#{emails.size}"

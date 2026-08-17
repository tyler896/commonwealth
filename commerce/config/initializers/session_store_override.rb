# Hosted behind Cloudflare + nginx TLS.
# Mounted into the stock Spree image via docker-compose.prod.yml.
suffix = ENV.fetch('COOKIE_SUFFIX', 'v5')
SESSION_KEY = "_commonwealth_spree_session_#{suffix}"

Rails.application.config.session_store :cookie_store,
  key: SESSION_KEY,
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true

# Bust admin redirect loops from stale cookies / half-authenticated sessions.
Rails.application.config.middleware.insert_before(
  ActionDispatch::Cookies,
  Class.new do
    STALE = %w[
      _spree_session
      _commonwealth_spree_session
      _commonwealth_spree_session_v2
      _commonwealth_spree_session_v3
      _commonwealth_spree_session_v4
      remember_admin_user_token
      remember_user_token
    ].freeze

    def initialize(app)
      @app = app
      @session_key = SESSION_KEY
    end

    def call(env)
      path = env['PATH_INFO'].to_s
      # Fresh session on GET login only (keep POST CSRF cookie intact).
      scrub = env['REQUEST_METHOD'] == 'GET' && path.start_with?('/admin_user/sign_in')

      if scrub && env['HTTP_COOKIE'].present?
        keep = []
        env['HTTP_COOKIE'].split(/;\s*/).each do |part|
          name = part.split('=', 2).first.to_s
          next if STALE.include?(name)
          next if name.start_with?('_commonwealth_spree_session') # always fresh on login GET
          keep << part
        end
        env['HTTP_COOKIE'] = keep.join('; ')
      end

      status, headers, body = @app.call(env)

      if scrub
        expire = (STALE + [@session_key]).uniq.map do |name|
          "#{name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; HttpOnly; SameSite=Lax"
        end
        # Keep newly issued session cookie from the login page render; only expire stale names.
        expire.reject! { |line| line.start_with?("#{@session_key}=") }
        headers['Set-Cookie'] = Array(headers['Set-Cookie']) + expire
      end

      [status, headers, body]
    end
  end
)

# Spree mounts Devise inside the engine with no admin_user_root / engine root.
# Devise's signed_in_root_path then calls root_path on the sessions controller,
# which resolves to the current path (/admin_user/sign_in) — so a successful
# login 302s right back to the login form (looks like a page reload).
Rails.application.config.to_prepare do
  Spree::Admin::UserSessionsController.class_eval do
    def after_sign_in_path_for(resource_or_scope)
      stored = stored_location_for(resource_or_scope).to_s
      if stored.blank? || stored.start_with?('/admin_user/sign_in')
        spree.admin_path
      else
        stored
      end
    end
  end
end

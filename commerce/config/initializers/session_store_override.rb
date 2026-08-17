# Hosted behind Cloudflare + nginx TLS.
# Mounted into the stock Spree image via docker-compose.prod.yml.
suffix = ENV.fetch('COOKIE_SUFFIX', 'v4')

Rails.application.config.session_store :cookie_store,
  key: "_commonwealth_spree_session_#{suffix}",
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true

# Bust admin redirect loops caused by stale session / Devise remember cookies
# (ERR_TOO_MANY_REDIRECTS on /admin_user/sign_in).
Rails.application.config.middleware.insert_before(
  ActionDispatch::Cookies,
  Class.new do
    STALE = %w[
      _spree_session
      _commonwealth_spree_session
      _commonwealth_spree_session_v2
      _commonwealth_spree_session_v3
      remember_admin_user_token
      remember_user_token
    ].freeze

    def initialize(app)
      @app = app
    end

    def call(env)
      path = env['PATH_INFO'].to_s
      clear_login = path.start_with?('/admin_user/sign_in')

      if clear_login && env['HTTP_COOKIE'].present?
        keep = []
        env['HTTP_COOKIE'].split(/;\s*/).each do |part|
          name = part.split('=', 2).first.to_s
          keep << part unless STALE.include?(name) || name.start_with?('_commonwealth_spree_session')
        end
        # Drop all session + remember cookies on the login page so Devise can't
        # treat the browser as already signed-in and 302 away into a loop.
        env['HTTP_COOKIE'] = keep.join('; ')
      end

      status, headers, body = @app.call(env)

      if path.start_with?('/admin') && status.to_i.between?(300, 399)
        warn "[redir] #{status} #{env['REQUEST_METHOD']} #{path} -> #{headers['Location']} cookie=#{env['HTTP_COOKIE'].to_s[0, 240]}"
      end

      if clear_login
        expire = STALE.map do |name|
          "#{name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; HttpOnly; SameSite=Lax"
        end
        existing = headers['Set-Cookie']
        headers['Set-Cookie'] = Array(existing) + expire
      end

      [status, headers, body]
    end
  end
)

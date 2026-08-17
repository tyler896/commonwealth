# Hosted behind Cloudflare + nginx TLS.
# Mounted into the stock Spree image via docker-compose.prod.yml.
suffix = ENV.fetch('COOKIE_SUFFIX', 'v4')
SESSION_KEY = "_commonwealth_spree_session_#{suffix}"

Rails.application.config.session_store :cookie_store,
  key: SESSION_KEY,
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
      @session_key = SESSION_KEY
    end

    def call(env)
      path = env['PATH_INFO'].to_s
      # Only scrub on GET login — never on POST or CSRF/session breaks.
      scrub = env['REQUEST_METHOD'] == 'GET' && path.start_with?('/admin_user/sign_in')

      if scrub && env['HTTP_COOKIE'].present?
        keep = []
        env['HTTP_COOKIE'].split(/;\s*/).each do |part|
          name = part.split('=', 2).first.to_s
          next if STALE.include?(name)
          # Drop older session cookie names, keep the current one.
          next if name.start_with?('_commonwealth_spree_session') && name != @session_key

          keep << part
        end
        env['HTTP_COOKIE'] = keep.join('; ')
      end

      status, headers, body = @app.call(env)

      if path.start_with?('/admin') && status.to_i.between?(300, 399)
        warn "[redir] #{status} #{env['REQUEST_METHOD']} #{path} -> #{headers['Location']} cookie=#{env['HTTP_COOKIE'].to_s[0, 240]}"
      end

      if scrub
        expire = STALE.map do |name|
          "#{name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; HttpOnly; SameSite=Lax"
        end
        headers['Set-Cookie'] = Array(headers['Set-Cookie']) + expire
      end

      [status, headers, body]
    end
  end
)

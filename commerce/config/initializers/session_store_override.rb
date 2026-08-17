# Hosted behind Cloudflare + nginx TLS.
# COOKIE_SUFFIX rotates the session cookie when browsers get stuck in
# admin redirect loops (ERR_TOO_MANY_REDIRECTS on /admin_user/sign_in).
suffix = ENV.fetch('COOKIE_SUFFIX', 'v3')

Rails.application.config.session_store :cookie_store,
  key: "_commonwealth_spree_session_#{suffix}",
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true

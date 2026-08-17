# Hosted behind Cloudflare + nginx TLS. New cookie name busts bad browser sessions
# that were stuck redirecting between /admin and /admin_user/sign_in.
Rails.application.config.session_store :cookie_store,
  key: "_commonwealth_spree_session",
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true

import { Link } from 'react-router-dom'
import { NewsletterSignup } from './NewsletterSignup'

export function Footer() {
  return (
    <footer>
      <section className="relative overflow-hidden bg-leaf-deep">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-leaf via-leaf-deep to-[#163822]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_90%_50%,rgba(0,0,0,0.22),transparent_62%)]"
          aria-hidden="true"
        />

        <div className="section-pad relative mx-auto grid max-w-7xl items-center gap-8 py-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 md:py-0 md:min-h-[22rem] lg:min-h-[26rem]">
          <div className="relative z-10 order-2 max-w-xl animate-rise md:order-1">
            <p className="mb-3 font-display text-[10px] tracking-[0.28em] uppercase text-[#cfe9ff] md:text-xs">
              Stay in the nest
            </p>
            <h2 className="font-blackletter text-3xl leading-[0.95] text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              Seeds for the <span className="text-gold">people</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/88 md:mt-5 md:text-lg">
              Drop announcements and new Commonwealth lines — straight from the source.
            </p>

            <NewsletterSignup
              id="footer-newsletter-email"
              className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch md:mt-8"
              inputClassName="flex-1 rounded-full border border-white/25 bg-white px-5 py-3.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30"
              buttonClassName="rounded-full bg-brand-red px-7 py-3.5 font-display text-xs tracking-[0.2em] uppercase text-white shadow-[0_10px_28px_rgba(217,18,18,0.28)] transition hover:bg-brand-red-deep disabled:opacity-70"
            />
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[13rem] animate-fade sm:max-w-[16rem] md:order-2 md:max-w-none md:justify-self-end">
            <div className="relative mx-auto aspect-square w-full md:max-w-[26rem] lg:max-w-[28rem]">
              <img
                src="/images/logo-circle.png"
                alt="Common Wealth Seed Co"
                className="animate-drift relative z-10 h-full w-full object-contain object-center drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-brand-blue-line bg-paper">
        <div className="section-pad mx-auto max-w-7xl py-10 md:py-16">
          <div className="grid min-w-0 gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-20">
            <Link to="/" className="inline-block w-fit max-w-full">
              <img
                src="/images/logo-gold.png"
                alt="Common Wealth Seed Co"
                className="h-16 w-auto max-w-full md:h-28"
              />
            </Link>

            <div className="grid min-w-0 grid-cols-2 gap-6 sm:gap-10">
              <div className="min-w-0">
                <h3 className="mb-4 font-display text-xs tracking-[0.22em] uppercase text-brand-blue">
                  Quick Links
                </h3>
                <ul className="space-y-3 text-sm text-ink/80">
                  <li>
                    <Link to="/" className="transition hover:text-brand-red">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="transition hover:text-brand-red">
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="transition hover:text-brand-red">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/wholesale" className="transition hover:text-brand-red">
                      Wholesale
                    </Link>
                  </li>
                  <li>
                    <Link to="/wholesale/login" className="transition hover:text-brand-red">
                      Trade login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/wild-thornberry"
                      className="transition hover:text-brand-red"
                    >
                      Wild Thornberry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/grape-sunshine"
                      className="transition hover:text-brand-red"
                    >
                      Grape Sunshine
                    </Link>
                  </li>
                  <li>
                    <Link to="/checkout" className="transition hover:text-brand-red">
                      Checkout
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0">
                <h3 className="mb-4 font-display text-xs tracking-[0.22em] uppercase text-brand-blue">
                  Contact
                </h3>
                <ul className="space-y-3 break-words text-sm text-ink/80">
                  <li>Oregon, USA</li>
                  <li>
                    <a
                      href="mailto:hello@commonwealthseed.co"
                      className="break-all transition hover:text-brand-red"
                    >
                      hello@commonwealthseed.co
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-brand-blue-line pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0">© {new Date().getFullYear()} Commonwealth Seed Co. All rights reserved.</p>
            <p className="min-w-0">21+ only. Commonwealth genetics exclusively.</p>
          </div>
        </div>
      </section>
    </footer>
  )
}

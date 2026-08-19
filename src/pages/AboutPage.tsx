import type { ReactNode } from 'react'

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_LONG =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.'

const TEAM = [
  { name: 'Founder Name', role: 'Founder & Breeder' },
  { name: 'Team Member', role: 'Selection & Phenohunting' },
  { name: 'Team Member', role: 'Operations' },
] as const

function Section({
  eyebrow,
  title,
  children,
  className = '',
}: {
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`section-pad mx-auto max-w-7xl py-14 md:py-20 ${className}`}>
      <p className="font-display text-[10px] tracking-[0.28em] uppercase text-muted md:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-blackletter text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="mt-5 max-w-2xl space-y-4 text-sm leading-relaxed text-muted md:mt-6 md:text-base">
        {children}
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-paper pb-16 md:pb-24">
      <section className="section-pad mx-auto max-w-7xl pt-24 md:pt-32">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
          About
        </p>
        <h1 className="mt-2 max-w-3xl font-blackletter text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
          Commonwealth Seed Co
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:mt-5 md:text-base">
          {LOREM}
        </p>
      </section>

      <Section eyebrow="Origin" title="Founder story">
        <p>{LOREM}</p>
        <p>{LOREM_LONG}</p>
      </Section>

      <section className="border-y border-line bg-paper-soft">
        <Section eyebrow="Method" title="Breeding philosophy">
          <p>{LOREM}</p>
          <p>{LOREM_LONG}</p>
        </Section>
      </section>

      <Section eyebrow="Roots" title="Common Wealth heritage">
        <p>{LOREM}</p>
        <p>{LOREM_LONG}</p>
      </Section>

      <section className="border-t border-line bg-paper-soft">
        <div className="section-pad mx-auto max-w-7xl py-14 md:py-20">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase text-muted md:text-xs">
            People
          </p>
          <h2 className="mt-2 font-blackletter text-3xl leading-tight text-ink md:text-4xl lg:text-5xl">
            Team
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted md:mt-6 md:text-base">
            {LOREM}
          </p>

          <ul className="mt-10 grid gap-8 sm:grid-cols-3 md:mt-12 md:gap-10">
            {TEAM.map((person) => (
              <li key={person.role} className="text-center">
                <div className="mx-auto aspect-square w-full max-w-[12rem] bg-paper" aria-hidden />
                <p className="mt-4 font-blackletter text-xl text-ink md:text-2xl">{person.name}</p>
                <p className="mt-1 font-display text-[10px] tracking-[0.2em] uppercase text-muted md:text-xs">
                  {person.role}
                </p>
                <p className="mx-auto mt-3 max-w-xs text-sm text-muted">{LOREM.slice(0, 120)}.</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

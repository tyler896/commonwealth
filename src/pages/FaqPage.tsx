const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_LONG =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.'

const SECTIONS = [
  {
    id: 'shipping',
    title: 'Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: LOREM,
      },
      {
        q: 'Do you ship internationally?',
        a: LOREM_LONG,
      },
      {
        q: 'How will my order be packaged?',
        a: LOREM,
      },
    ],
  },
  {
    id: 'legality',
    title: 'Legality',
    items: [
      {
        q: 'Are these seeds legal to purchase?',
        a: LOREM,
      },
      {
        q: 'What are my responsibilities as a buyer?',
        a: LOREM_LONG,
      },
      {
        q: 'Do you sell to all U.S. states?',
        a: LOREM,
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: LOREM,
      },
      {
        q: 'When will I be charged?',
        a: LOREM_LONG,
      },
      {
        q: 'Can I get an invoice for my order?',
        a: LOREM,
      },
    ],
  },
  {
    id: 'germination-guarantee',
    title: 'Germination guarantee',
    items: [
      {
        q: 'What does the germination guarantee cover?',
        a: LOREM,
      },
      {
        q: 'How do I make a claim?',
        a: LOREM_LONG,
      },
      {
        q: 'How long is the guarantee valid?',
        a: LOREM,
      },
    ],
  },
] as const

export function FaqPage() {
  return (
    <div className="min-w-0 overflow-x-hidden bg-paper">
      <section className="section-pad mx-auto max-w-7xl pt-24 md:pt-32">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
          Help
        </p>
        <h1 className="mt-2 max-w-3xl font-blackletter text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
          FAQ
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:mt-5 md:text-base">
          {LOREM}
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 md:mt-10">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="font-display text-[10px] tracking-[0.2em] uppercase text-ink/55 transition hover:text-leaf md:text-xs"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </section>

      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`scroll-mt-24 ${index % 2 === 1 ? 'border-y border-line bg-paper-soft' : ''}`}
        >
          <div className="section-pad mx-auto max-w-7xl py-14 md:py-20">
            <h2 className="font-blackletter text-3xl leading-tight text-ink md:text-4xl">
              {section.title}
            </h2>
            <dl className="mt-8 max-w-3xl space-y-8 md:mt-10 md:space-y-10">
              {section.items.map((item) => (
                <div key={item.q}>
                  <dt className="font-display text-sm tracking-wide text-ink md:text-base">
                    {item.q}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted md:text-base">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}
    </div>
  )
}

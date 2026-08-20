const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_LONG =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.'

type LegalSection = {
  heading: string
  body: string
}

type LegalDoc = {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}

function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <div className="section-pad mx-auto max-w-3xl pt-24 md:pt-32">
      <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
        {doc.eyebrow}
      </p>
      <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">{doc.title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{doc.intro}</p>

      <div className="mt-12 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-sm tracking-[0.12em] uppercase text-ink">
              {section.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

const TERMS: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Terms of Service',
  intro: LOREM,
  sections: [
    { heading: 'Agreement to terms', body: LOREM_LONG },
    { heading: 'Products and availability', body: LOREM },
    { heading: 'Orders and payment', body: LOREM_LONG },
    { heading: 'Limitation of liability', body: LOREM },
    { heading: 'Governing law', body: LOREM_LONG },
  ],
}

const PRIVACY: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Privacy Policy',
  intro: LOREM,
  sections: [
    { heading: 'Information we collect', body: LOREM_LONG },
    { heading: 'How we use information', body: LOREM },
    { heading: 'Cookies and analytics', body: LOREM_LONG },
    { heading: 'Sharing and disclosure', body: LOREM },
    { heading: 'Your choices', body: LOREM_LONG },
  ],
}

const SHIPPING: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Shipping Policy',
  intro: LOREM,
  sections: [
    { heading: 'Processing times', body: LOREM_LONG },
    { heading: 'Shipping methods and rates', body: LOREM },
    { heading: 'Domestic and international', body: LOREM_LONG },
    { heading: 'Delays and carrier issues', body: LOREM },
    { heading: 'Lost or damaged packages', body: LOREM_LONG },
  ],
}

const AGE: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Age Policy',
  intro: LOREM,
  sections: [
    { heading: 'Minimum age requirement', body: LOREM_LONG },
    { heading: 'Age verification', body: LOREM },
    { heading: 'Restricted jurisdictions', body: LOREM_LONG },
    { heading: 'Parental responsibility', body: LOREM },
    { heading: 'Violations', body: LOREM_LONG },
  ],
}

export function TermsPage() {
  return <LegalDocument doc={TERMS} />
}

export function PrivacyPage() {
  return <LegalDocument doc={PRIVACY} />
}

export function ShippingPolicyPage() {
  return <LegalDocument doc={SHIPPING} />
}

export function AgePolicyPage() {
  return <LegalDocument doc={AGE} />
}

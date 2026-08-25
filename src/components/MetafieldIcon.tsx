import type { ReactNode } from 'react'

const paths: Record<string, ReactNode> = {
  dna: (
    <>
      <path d="M4 4c4 4 8 4 12 0" />
      <path d="M4 20c4-4 8-4 12 0" />
      <path d="M7 8.5h6" />
      <path d="M7 15.5h6" />
      <path d="M9 12h2" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c8-1 12-7 12-14-7 0-13 4-14 12 3 0 5 1 5 2z" />
      <path d="M5 19c2-4 5-7 9-9" />
    </>
  ),
  package: (
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5v-9z" />
      <path d="M12 12v9" />
      <path d="M3 7.5 12 12l9-4.5" />
    </>
  ),
  badge: (
    <>
      <path d="M12 3 14.5 8.5 20.5 9.5 16 13.5 17.2 19.5 12 16.5 6.8 19.5 8 13.5 3.5 9.5 9.5 8.5 12 3z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.5" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c-4 0-6-3-6-6 4 0 6 3 6 6z" />
      <path d="M12 13c4 0 6-3 6-6-4 0-6 3-6 6z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="m6 6 2.5 2.5" />
      <path d="m15.5 15.5 2.5 2.5" />
      <path d="m18 6-2.5 2.5" />
      <path d="m8.5 15.5-2.5 2.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L5.5 18a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M8.5 14h7" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="m5 5 1.4 1.4" />
      <path d="m17.6 17.6 1.4 1.4" />
      <path d="m19 5-1.4 1.4" />
      <path d="m6.4 17.6-1.4 1.4" />
    </>
  ),
}

const FALLBACK_BY_KEY: Record<string, string> = {
  lineage: 'dna',
  line: 'leaf',
  pack: 'package',
  brand: 'badge',
  flowering_time: 'clock',
  yield: 'sprout',
  effects: 'sparkles',
}

type Props = {
  name?: string | null
  fieldKey?: string
  className?: string
}

export function MetafieldIcon({ name, fieldKey, className = '' }: Props) {
  const slug =
    (name && paths[name] ? name : null) ||
    (fieldKey && FALLBACK_BY_KEY[fieldKey]) ||
    'tag'
  const body = paths[slug] || paths.tag

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {body}
    </svg>
  )
}

import { Link } from 'react-router-dom'
import type { StoreEvent } from '../api/commerce'

function formatEventDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function EventCard({
  event,
  className = '',
  imageClassName = '',
}: {
  event: StoreEvent
  className?: string
  imageClassName?: string
}) {
  return (
    <Link
      to={`/events/${event.slug}`}
      className={`group relative block min-h-0 overflow-hidden bg-ink text-white ${className}`}
    >
      {event.featured_image_url ? (
        <img
          src={event.featured_image_url}
          alt=""
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
            imageClassName || 'h-full w-full'
          }`}
        />
      ) : (
        <div className={`bg-leaf ${imageClassName || 'h-full w-full'}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <p className="font-display text-[10px] tracking-[0.2em] uppercase text-white/80">
          {formatEventDate(event.starts_at)}
          {event.location ? ` · ${event.location}` : ''}
        </p>
        <h3 className="mt-2 font-blackletter text-2xl leading-tight md:text-3xl">{event.title}</h3>
        {event.summary && (
          <p className="mt-2 line-clamp-2 max-w-lg text-sm text-white/85">{event.summary}</p>
        )}
      </div>
    </Link>
  )
}

/** Home widget: 1 = full; 2 = 50/50; 3+ = newest 50% + next two stacked 50%. */
export function EventsHomeWidget({ events }: { events: StoreEvent[] }) {
  const shown = events.slice(0, 3)
  if (!shown.length) return null

  return (
    <section className="overflow-x-clip py-16 md:py-24">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-[10px] tracking-[0.28em] uppercase text-muted md:text-xs">
              Events
            </p>
            <h2 className="mt-2 font-blackletter text-3xl text-ink md:text-4xl lg:text-5xl">
              In the field
            </h2>
          </div>
          <Link
            to="/events"
            className="font-display text-[10px] tracking-[0.2em] uppercase text-ink/55 transition hover:text-leaf md:text-xs"
          >
            All events →
          </Link>
        </div>

        <div className="mt-8 md:mt-10">
          {shown.length === 1 && (
            <EventCard event={shown[0]} className="aspect-[16/9] min-h-[18rem] md:min-h-[24rem]" />
          )}

          {shown.length === 2 && (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {shown.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  className="aspect-[4/5] min-h-[16rem] md:aspect-auto md:min-h-[22rem]"
                />
              ))}
            </div>
          )}

          {shown.length >= 3 && (
            <div className="grid gap-3 md:grid-cols-2 md:grid-rows-2 md:gap-4">
              <EventCard
                event={shown[0]}
                className="min-h-[18rem] md:row-span-2 md:min-h-0"
                imageClassName="absolute inset-0"
              />
              <EventCard
                event={shown[1]}
                className="min-h-[12rem] md:min-h-0"
                imageClassName="absolute inset-0"
              />
              <EventCard
                event={shown[2]}
                className="min-h-[12rem] md:min-h-0"
                imageClassName="absolute inset-0"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function formatEventDateLong(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

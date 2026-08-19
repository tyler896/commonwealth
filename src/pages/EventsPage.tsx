import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchEvents, type StoreEvent } from '../api/commerce'
import { formatEventDateLong } from '../components/EventsHomeWidget'

export function EventsPage() {
  const [events, setEvents] = useState<StoreEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchEvents(50)
      .then((items) => {
        if (alive) setEvents(items)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="min-w-0 overflow-x-hidden bg-paper pb-16 md:pb-24">
      <section className="section-pad mx-auto max-w-7xl pt-24 md:pt-32">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
          Events
        </p>
        <h1 className="mt-2 font-blackletter text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
          In the field
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Drops, meetups, and Commonwealth gatherings — newest first.
        </p>

        {loading && (
          <p className="mt-12 font-display text-sm tracking-[0.2em] uppercase text-muted">
            Loading events…
          </p>
        )}

        {!loading && events.length === 0 && (
          <p className="mt-12 text-sm text-muted">No published events yet. Check back soon.</p>
        )}

        <ul className="mt-12 space-y-10 md:mt-16 md:space-y-14">
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                to={`/events/${event.slug}`}
                className="group grid items-stretch gap-6 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-10"
              >
                <div className="aspect-[4/3] overflow-hidden bg-paper-soft">
                  {event.featured_image_url ? (
                    <img
                      src={event.featured_image_url}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-leaf/80" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-display text-[10px] tracking-[0.2em] uppercase text-muted md:text-xs">
                    {formatEventDateLong(event.starts_at)}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                  <h2 className="mt-2 font-blackletter text-3xl text-ink transition group-hover:text-leaf md:text-4xl">
                    {event.title}
                  </h2>
                  {event.summary && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                      {event.summary}
                    </p>
                  )}
                  <span className="mt-5 font-display text-[10px] tracking-[0.2em] uppercase text-leaf">
                    Details →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

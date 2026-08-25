import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEventBySlug, type StoreEvent } from '../api/commerce'
import { formatEventDateLong } from '../components/EventsHomeWidget'

export function EventDetailPage() {
  const { slug = '' } = useParams()
  const [event, setEvent] = useState<StoreEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchEventBySlug(slug)
      .then((item) => {
        if (alive) setEvent(item)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center text-muted md:py-40">
        Loading event…
      </div>
    )
  }

  if (!event) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center md:py-40">
        <h1 className="font-blackletter text-3xl text-ink">Event not found</h1>
        <Link to="/events" className="mt-6 inline-block text-leaf">
          ← All events
        </Link>
      </div>
    )
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-paper pb-16 md:pb-24">
      <article className="section-pad mx-auto max-w-4xl pt-24 md:pt-32">
        <Link
          to="/events"
          className="font-display text-[10px] tracking-[0.22em] uppercase text-muted transition hover:text-ink md:text-xs"
        >
          ← Events
        </Link>

        <p className="mt-8 font-display text-[10px] tracking-[0.2em] uppercase text-leaf md:text-xs">
          {formatEventDateLong(event.starts_at)}
          {event.location ? ` · ${event.location}` : ''}
        </p>
        <h1 className="mt-2 font-blackletter text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
          {event.title}
        </h1>
        {event.summary && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {event.summary}
          </p>
        )}

        {event.featured_image_url && (
          <div className="mt-10 overflow-hidden">
            <img
              src={event.featured_image_url}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        {event.description && (
          <div
            className="prose prose-neutral mt-10 max-w-none text-ink prose-headings:font-blackletter prose-a:text-leaf"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}

        {event.gallery_image_urls.length > 0 && (
          <div className="mt-12 grid gap-3 sm:grid-cols-2 md:gap-4">
            {event.gallery_image_urls.map((url) => (
              <img key={url} src={url} alt="" className="aspect-[4/3] w-full object-cover" />
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

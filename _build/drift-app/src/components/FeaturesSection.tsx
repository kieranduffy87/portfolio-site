import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { FEATURES, FEATURES_BG } from '../constants'

export default function FeaturesSection() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(() => FEATURES.map(() => false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Two observers on the same nodes: a strict one to say which card the
    // reader is actually on, a loose one to fire the entrance once.
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            setActive(index)
          }
        })
      },
      { threshold: 0.6 },
    )

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number((entry.target as HTMLElement).dataset.index)
          setRevealed((prev) => {
            if (prev[index]) return prev
            const next = [...prev]
            next[index] = true
            return next
          })
        })
      },
      { threshold: 0.15 },
    )

    cardRefs.current.forEach((node) => {
      if (!node) return
      activeObserver.observe(node)
      revealObserver.observe(node)
    })

    return () => {
      activeObserver.disconnect()
      revealObserver.disconnect()
    }
  }, [])

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="relative px-5 md:px-10 lg:px-16 py-20 md:py-40 lg:py-48">
      {/* The section itself stays transparent: an opaque background on it would
          paint over this layer, which sits behind at -z-10. */}
      <div
        className="absolute inset-0 -z-10 bg-[#1A0E02] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${FEATURES_BG})` }}
        aria-hidden="true"
      />

      <div className="lg:grid lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr] lg:gap-24 xl:gap-48">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between lg:py-32">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-[46px] leading-[1.2] font-normal">
            Software that flows with your mind, not over it
          </h2>

          <div className="hidden lg:flex flex-col items-start gap-2">
            {FEATURES.map((feature, index) => (
              <button
                key={feature.title}
                type="button"
                onClick={() => scrollToCard(index)}
                className={`text-left text-sm font-medium px-4 py-2.5 rounded-xl bg-black/20 transition-colors duration-300 ${
                  active === index ? 'text-white' : 'text-white/40'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center bg-black/25 backdrop-blur-md rounded-xl pl-6 pr-1 py-1">
            <p className="text-white text-sm font-medium pr-6">
              No noise. No complicated systems. Just your day, gently sorted.
            </p>
            <button
              type="button"
              className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-xl whitespace-nowrap transition-colors hover:bg-white/90"
            >
              Start for free
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-16 mt-12 lg:mt-0">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              data-index={index}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              className={`bg-black/20 backdrop-blur-sm rounded-3xl p-6 md:p-10 flex flex-col gap-6 transition-all duration-700 ease-out ${
                revealed[index] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}
            >
              <Logo fill="rgba(255,255,255,0.8)" />
              <h3 className="text-white text-xl md:text-2xl font-medium">{feature.title}</h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black/30">
                <video
                  className="w-full h-full object-cover"
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <p className="text-white/60 font-medium text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

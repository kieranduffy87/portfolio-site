import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

/* Four films play behind a train window. Only one is ever visible: the others
   keep running underneath at zero opacity so a switch is a crossfade, not a
   load. The third scene is the bright one, so the hero copy flips to ink. */
const SCENES = [
  { src: './media/scene-1.mp4', label: 'Golden Hour' },
  { src: './media/scene-2.mp4', label: 'Still Water' },
  { src: './media/scene-3.mp4', label: 'Deep Woods' },
  { src: './media/scene-4.mp4', label: 'Quiet Dawn' },
]

const DARK_SCENE = 2
const FADE_MS = 1000

const NAV_LINKS = ['How It Works', 'Features', 'Pricing', 'Community']

const STATS = [
  '60+ Deep Sessions',
  '12,000+ Creators',
  '4.8 User Satisfaction',
  'Intentional-First Design',
]

const SANS = { fontFamily: 'system-ui, sans-serif' } as const
const EASE = 'cubic-bezier(0.4,0,0.2,1)'

export default function App() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function selectVideo(index: number) {
    if (index === activeVideo || isTransitioning) return
    setActiveVideo(index)
    setIsTransitioning(true)
    timer.current = window.setTimeout(() => setIsTransitioning(false), FADE_MS)
  }

  const isDark = activeVideo === DARK_SCENE

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background films */}
      {SCENES.map((scene, i) => (
        <video
          key={scene.src}
          src={scene.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Carriage window, sitting on the picture */}
      <img
        src="./window.webp"
        alt=""
        aria-hidden="true"
        className="train-bob absolute inset-0 w-full h-full object-cover z-[1] pointer-events-none select-none"
      />

      {/* Content */}
      <div className="relative z-[2] flex flex-col h-full">
        <header className="on-film flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <a href="#main" className="text-white italic text-xl sm:text-2xl leading-none">
            Lumora
          </a>

          <nav className="hidden md:flex items-center gap-1 liquid-glass rounded-full pl-6 pr-1.5 py-1.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#main"
                style={SANS}
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm px-3 py-2"
              >
                {link}
              </a>
            ))}
            <a
              href="#main"
              style={SANS}
              className="ml-3 rounded-full bg-white text-[#182C41] text-sm px-5 py-2.5 hover:bg-white/90 transition-colors duration-200 [text-shadow:none]"
            >
              Get Started
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden liquid-glass rounded-full w-11 h-11 grid place-items-center text-white"
          >
            <span className="relative block w-5 h-5">
              <Menu
                size={20}
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                size={20}
                className={`absolute inset-0 transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </span>
          </button>
        </header>

        <main
          id="main"
          className={`hero-ink flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 ${
            isDark ? 'is-dark' : ''
          }`}
        >
          <p
            style={SANS}
            className="ink liquid-glass rounded-full text-[11px] sm:text-xs px-4 py-2 tracking-wide"
          >
            Over 10,000 minds already finding their clarity
          </p>

          <h1 className="ink mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl">
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          <p
            style={SANS}
            className="ink mt-5 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed opacity-90"
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how
            to protect your presence and create with intention.
          </p>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="ink liquid-glass mt-7 sm:mt-8 w-full max-w-[320px] sm:max-w-sm rounded-full flex items-center gap-2 pl-5 pr-1.5 py-1.5"
          >
            <label htmlFor="email" className="sr-only">
              Your best email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Best Email"
              style={SANS}
              className="ink flex-1 min-w-0 bg-transparent border-none outline-none text-sm"
            />
            <button
              type="submit"
              style={SANS}
              className="ink-fill shrink-0 rounded-full text-xs sm:text-sm px-4 py-2.5 whitespace-nowrap"
            >
              Get Early Access
            </button>
          </form>

          <div className="mt-9 sm:mt-12 flex items-center gap-5 sm:gap-8">
            {SCENES.map((scene, i) => (
              <button
                key={scene.label}
                type="button"
                onClick={() => selectVideo(i)}
                style={SANS}
                aria-pressed={i === activeVideo}
                className={`ink text-[11px] sm:text-xs pb-1.5 border-b transition-all duration-300 ${
                  i === activeVideo
                    ? 'opacity-100 border-current'
                    : 'opacity-50 hover:opacity-80 border-transparent'
                }`}
              >
                {scene.label}
              </button>
            ))}
          </div>
        </main>

        <footer className="px-5 sm:px-8 lg:px-12 pb-7 sm:pb-9">
          <div
            style={SANS}
            className="on-film flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/70 text-xs sm:text-sm"
          >
            {STATS.map((stat, i) => (
              <span key={stat} className="flex items-center gap-3">
                {i > 0 && <span className="hidden sm:inline text-white/30">|</span>}
                {stat}
              </span>
            ))}
          </div>
        </footer>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: EASE }}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="liquid-glass absolute top-6 right-5 rounded-full w-11 h-11 grid place-items-center text-white"
        >
          <X size={20} />
        </button>

        <div className="h-full flex flex-col items-center justify-center gap-7">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#main"
              onClick={() => setMenuOpen(false)}
              className={`text-white text-3xl transition-all duration-500 ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionTimingFunction: EASE,
                transitionDelay: `${100 + i * 50}ms`,
              }}
            >
              {link}
            </a>
          ))}
          <a
            href="#main"
            onClick={() => setMenuOpen(false)}
            style={{
              ...SANS,
              transitionTimingFunction: EASE,
              transitionDelay: `${100 + NAV_LINKS.length * 50}ms`,
            }}
            className={`mt-3 rounded-full bg-white text-[#182C41] text-sm px-7 py-3 transition-all duration-500 ${
              menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  )
}

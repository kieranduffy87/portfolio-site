import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react'

/* ---------------------------------------------------------------------------
   Images. One wide photograph per section, shared across every card in it.
--------------------------------------------------------------------------- */

const HERO_IMAGE = 'img/hero.jpg'
const SECTION2_IMAGE = 'img/gallery.jpg'
const SECTION3_IMG1 = 'img/implant.jpg'
const SECTION3_IMG2 = 'img/restoration.jpg'
const SECTION3_BG = 'img/patient.jpg'

const featureBars = ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff']

const services = [
  { name: 'Dental\nVeneers', num: '01', active: true },
  { name: 'Dental\nCrowns', num: '02', active: false },
  { name: 'Teeth\nWhitening', num: '03', active: false },
  { name: 'Dental\nImplants', num: null, active: false },
]

/* ---------------------------------------------------------------------------
   Masking. Every card in a section is a window onto the same photograph: the
   card measures where it sits inside the section, then offsets the background
   by exactly that much, so the picture runs unbroken behind the whole mosaic.
--------------------------------------------------------------------------- */

type MaskPosition = { x: number; y: number; sw: number; sh: number }

function useMaskPositions(
  sectionRef: RefObject<HTMLElement>,
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>,
  count: number,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const measure = () => {
      const sr = section.getBoundingClientRect()
      const next: MaskPosition[] = []
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i]
        if (!el) {
          next.push({ x: 0, y: 0, sw: sr.width, sh: sr.height })
          continue
        }
        const r = el.getBoundingClientRect()
        next.push({ x: r.left - sr.left, y: r.top - sr.top, sw: sr.width, sh: sr.height })
      }
      setPositions(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    return () => ro.disconnect()
  }, [sectionRef, cardRefs, count])

  return positions
}

// How wide the photograph would be if scaled to fill the section height.
function useImageWidth(src: string, sectionHeight: number) {
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const img = new Image()
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = src
  }, [src])

  if (!natural.h || !sectionHeight) return 0
  return natural.w * (sectionHeight / natural.h)
}

// The picture is always scaled to the section height, so a narrow window sees a
// much smaller slice of it than a wide one. A fixed focal point that frames the
// subject on a large screen ends up buried in it on a small one, so the focal
// slides left as the visible slice narrows and the type keeps its clear ground.
function focalFor(visibleFraction: number, tight: number, wide: number) {
  const t = Math.min(1, Math.max(0, (visibleFraction - 0.45) / 0.3))
  return tight + (wide - tight) * t
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

type MaskedCardProps = {
  bgImage: string
  position?: MaskPosition
  imageWidth: number
  focalX: number
  className?: string
  children?: ReactNode
  cardRef?: (el: HTMLDivElement | null) => void
  style?: CSSProperties
}

function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className,
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  const pos = position ?? { x: 0, y: 0, sw: 0, sh: 0 }
  const overflow = imageWidth > pos.sw ? imageWidth - pos.sw : 0
  const focalOffset = overflow * focalX

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `auto ${pos.sh}px`,
        backgroundPosition: `-${pos.x + focalOffset}px -${pos.y}px`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Entrances. One observer per section, cards lift in 120ms apart, once only.
--------------------------------------------------------------------------- */

function useStaggeredReveal(count: number, threshold = 0.15, enabled = true) {
  const containerRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, enabled])

  const getAnimStyle = (index: number): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
  })

  return { containerRef, getAnimStyle, count }
}

/* ---------------------------------------------------------------------------
   Splash
--------------------------------------------------------------------------- */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let step = 0
    const id = window.setInterval(() => {
      step++
      setCount(step)
      if (step >= 100) {
        window.clearInterval(id)
        window.setTimeout(() => setExiting(true), 200)
        window.setTimeout(onComplete, 900)
      }
    }, 20)
    return () => window.clearInterval(id)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">
        {count}
      </span>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Navbar
--------------------------------------------------------------------------- */

const navLinks = ['Home', 'Services', 'About', 'Gallery', 'Contact']

function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none">
            Dental
          </span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2">
            Health
          </span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2">
            quality healthcare
          </span>
        </div>

        <div className="hidden md:block">
          <button className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200">
            Menu
          </button>
        </div>

        <div className="hidden md:block">
          <span className="text-sm font-semibold text-black">Dental Emergency</span>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              open ? 'rotate-45 translate-y-0' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
              open ? '-rotate-45 translate-y-0' : 'translate-y-2'
            }`}
          />
        </button>
      </header>

      <div className={`md:hidden fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => setOpen(false)}
                className={`text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
              >
                {link}
              </a>
            ))}

            <div
              className={`mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: open ? '450ms' : '0ms' }}
            >
              <p className="text-sm font-semibold text-black mb-4">Dental Emergency</p>
              <button className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200">
                Book Appointment
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------
   Arrow used on the two overlay cards in section 3.
--------------------------------------------------------------------------- */

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`rotate-[-45deg] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M1 7h12m0 0L8 2m5 5L8 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
   App
--------------------------------------------------------------------------- */

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const isMobile = useIsMobile()

  const section1Ref = useRef<HTMLElement | null>(null)
  const section2Ref = useRef<HTMLElement | null>(null)
  const s1Cards = useRef<(HTMLDivElement | null)[]>([])
  const s2Cards = useRef<(HTMLDivElement | null)[]>([])

  const s1Positions = useMaskPositions(section1Ref, s1Cards, 4)
  const s2Positions = useMaskPositions(section2Ref, s2Cards, 4)

  const s1Height = s1Positions[0]?.sh ?? 0
  const s2Height = s2Positions[0]?.sh ?? 0
  const s1ImageWidth = useImageWidth(HERO_IMAGE, s1Height)
  const s2ImageWidth = useImageWidth(SECTION2_IMAGE, s2Height)

  const s1Fraction = s1ImageWidth ? Math.min(1, (s1Positions[0]?.sw ?? 0) / s1ImageWidth) : 1
  const s2Fraction = s2ImageWidth ? Math.min(1, (s2Positions[0]?.sw ?? 0) / s2ImageWidth) : 1
  const s1Focal = focalFor(s1Fraction, 0.45, 0.8)
  // Mobile turns this section's type white, so its crop has to sit on the hair
  // and face rather than on the empty white sweep the desktop crop leans on.
  const s2Focal = focalFor(s2Fraction, isMobile ? 0.72 : 0.6, 0.8)

  // Only the mobile crop puts white type over skin, so the shadow rides along
  // with it and never touches the black desktop version.
  const mobileType = isMobile ? { textShadow: '0 2px 18px rgba(0,0,0,0.55)' } : undefined

  // Section 1 sits under the splash, so hold its entrance until the splash goes.
  const s1Reveal = useStaggeredReveal(4, 0.15, !showSplash)
  const s2Reveal = useStaggeredReveal(4)
  const s3Reveal = useStaggeredReveal(4)

  const setS1Ref = (el: HTMLElement | null) => {
    section1Ref.current = el
    s1Reveal.containerRef.current = el
  }
  const setS2Ref = (el: HTMLElement | null) => {
    section2Ref.current = el
    s2Reveal.containerRef.current = el
  }

  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />

      {/* SECTION 1 - HERO -------------------------------------------------- */}
      <section
        ref={setS1Ref}
        className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        {featureBars.map((bar, i) => (
          <MaskedCard
            key={bar}
            bgImage={HERO_IMAGE}
            position={s1Positions[i]}
            imageWidth={s1ImageWidth}
            focalX={s1Focal}
            cardRef={(el) => {
              s1Cards.current[i] = el
            }}
            style={s1Reveal.getAnimStyle(i)}
            className="w-full h-14 md:h-[clamp(3.5rem,9vh,5rem)] shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          >
            <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
              {bar}
            </span>
          </MaskedCard>
        ))}

        <MaskedCard
          bgImage={HERO_IMAGE}
          position={s1Positions[3]}
          imageWidth={s1ImageWidth}
          focalX={s1Focal}
          cardRef={(el) => {
            s1Cards.current[3] = el
          }}
          style={s1Reveal.getAnimStyle(3)}
          className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        >
          <p className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
            We wish to provide professional dental services
            <br />
            that match the current technologies
          </p>

          <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
            <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
              Trusted Dentist in West New York
            </span>
            <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
              Dental
              <br />
              Care
            </h1>
          </div>

          <span className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10">
            Free Consultation
          </span>
        </MaskedCard>
      </section>

      {/* SECTION 2 - SMILE GALLERY ----------------------------------------- */}
      <section
        ref={setS2Ref}
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[0]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2Cards.current[0] = el
            }}
            style={s2Reveal.getAnimStyle(0)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          >
            <h2
              style={mobileType}
              className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10"
            >
              Smile Gallery
            </h2>
            <span
              style={mobileType}
              className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10"
            >
              Our cosmetic dental work
            </span>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[1]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2Cards.current[1] = el
            }}
            style={s2Reveal.getAnimStyle(1)}
            className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          >
            {/* Whatever the crop, this line can land on hair or on a lit cheek,
                so it carries its own shadow: invisible over the dark, enough to
                hold the type together over the light. */}
            <p
              style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
              className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10"
            >
              If you want a gorgeous smile,
              <br />
              call us to ask about a smile makeover.
            </p>
            <button className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform">
              Call Us
            </button>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[2]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2Cards.current[2] = el
            }}
            style={s2Reveal.getAnimStyle(2)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          >
            <h2
              style={mobileType}
              className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10"
            >
              Smile
              <br />
              makeover
            </h2>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE}
            position={s2Positions[3]}
            imageWidth={s2ImageWidth}
            focalX={s2Focal}
            cardRef={(el) => {
              s2Cards.current[3] = el
            }}
            style={s2Reveal.getAnimStyle(3)}
            className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          >
            <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between ${
                    svc.active ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl'
                  }`}
                >
                  <h3
                    className={`text-xl md:text-[clamp(1.25rem,2.6vw,2.25rem)] font-bold leading-[1.05] whitespace-pre-line ${
                      svc.active ? 'text-black' : 'text-white'
                    }`}
                  >
                    {svc.name}
                  </h3>
                  {svc.num && (
                    <span
                      className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${
                        svc.active ? 'border-black text-black' : 'border-white text-white'
                      }`}
                    >
                      {svc.num}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      {/* SECTION 3 - IMPLANT DENTISTRY ------------------------------------- */}
      <section
        ref={s3Reveal.containerRef as RefObject<HTMLElement>}
        className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
      >
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div
              style={s3Reveal.getAnimStyle(0)}
              className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            >
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
                Implant
                <br />
                Dentistry
              </h2>
              <p className="text-xs md:text-sm font-semibold text-black">Restore Missing Teeth</p>
            </div>

            <div
              style={s3Reveal.getAnimStyle(1)}
              className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0"
            >
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={SECTION3_IMG1}
                  alt="Dental implant procedure"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img
                  src={SECTION3_IMG2}
                  alt="Dental restoration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div
              style={s3Reveal.getAnimStyle(2)}
              className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
            >
              <div>
                <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">
                  Consultation
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                  Dental
                  <br />
                  Restoration
                  <br />
                  Services
                </h3>
              </div>
              <button className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
                Book Online
              </button>
            </div>
          </div>

          <div
            style={s3Reveal.getAnimStyle(3)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0"
          >
            <img src={SECTION3_BG} alt="Smiling patient" className="w-full h-full object-cover" />

            <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
              <div className="flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-[clamp(1rem,1.75vw,1.5rem)] font-bold text-black leading-5 md:leading-7">
                  The Process
                  <br />
                  of Installing
                  <br />
                  Implants
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-black flex items-center justify-center">
                  <Arrow />
                </span>
              </div>

              <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52">
                <h4 className="text-lg md:text-[clamp(1rem,1.75vw,1.5rem)] font-bold text-white leading-5 md:leading-7">
                  Caring
                  <br />
                  for Dental
                  <br />
                  Implants
                </h4>
                <span className="self-end w-9 h-9 md:w-12 md:h-12 rounded-full border border-white flex items-center justify-center">
                  <Arrow className="text-white" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

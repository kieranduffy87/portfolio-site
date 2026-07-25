import { useEffect, useRef, useState } from 'react'
import Nav, { MobileMenu } from './components/Nav'
import JoinForm from './components/JoinForm'
import FeaturePills from './components/FeaturePills'

// A landscape film cropped into a phone becomes an extreme close-up, so the
// hero is shot twice: a 16:9 cut and a 9:16 cut, chosen at load.
const MOBILE = '(max-width: 639px)'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [portrait, setPortrait] = useState(() => window.matchMedia(MOBILE).matches)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const phone = window.matchMedia(MOBILE)
    const pick = () => setPortrait(phone.matches)
    phone.addEventListener('change', pick)
    return () => phone.removeEventListener('change', pick)
  }, [])

  // Anyone who has asked their system to reduce motion gets the poster frame
  // instead of a looping film.
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const video = videoRef.current
      if (!video) return
      if (still.matches) video.pause()
      else void video.play().catch(() => {})
    }
    apply()
    still.addEventListener('change', apply)
    return () => still.removeEventListener('change', apply)
  }, [])

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <video
        ref={videoRef}
        key={portrait ? 'portrait' : 'landscape'}
        className="film-settle absolute inset-0 h-full w-full object-cover object-center sm:object-[80%_center] md:object-right lg:object-center"
        src={portrait ? './video/aurai-hero-mobile.mp4' : './video/aurai-hero.mp4'}
        poster={portrait ? './img/aurai-hero-mobile.jpg' : './img/aurai-hero.jpg'}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* No dark scrim over the film. Contrast comes from the glass and from
          the fog the shot already carries on its left side. */}
      <div className="absolute inset-0 z-10 flex flex-col px-4 sm:px-10 lg:px-12 py-4 sm:py-8">
        <Nav open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
        {menuOpen && <MobileMenu onNavigate={() => setMenuOpen(false)} />}

        <div className="flex-1 sm:hidden" />

        <div className="flex flex-col sm:flex-1 sm:flex-row sm:items-end pb-4 sm:pb-12 lg:pb-16 sm:mt-auto">
          <div className="flex flex-col gap-4 sm:gap-6 sm:flex-1">
            <h1
              className="rise font-askan text-white text-[2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight max-w-[700px]"
              style={{ animationDelay: '0.35s' }}
            >
              Your calm is always within.
            </h1>

            <p
              className="rise text-white/70 text-xs sm:text-base md:text-lg max-w-[520px] leading-relaxed"
              style={{ animationDelay: '0.5s' }}
            >
              Aurai is your always-on wellness companion. Built by leading therapists, it
              brings you the care and clarity right when you need it.
            </p>

            <div className="rise" style={{ animationDelay: '0.65s' }}>
              <JoinForm />
            </div>

            <div className="rise" style={{ animationDelay: '0.8s' }}>
              <FeaturePills variant="mobile" />
            </div>
          </div>

          <div className="rise hidden sm:flex" style={{ animationDelay: '0.8s' }}>
            <FeaturePills variant="desktop" />
          </div>
        </div>
      </div>
    </section>
  )
}

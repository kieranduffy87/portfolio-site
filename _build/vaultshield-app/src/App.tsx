import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import MobileMenu from './components/MobileMenu'
import Hero from './components/Hero'

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
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
    >
      {/* Both cuts are directed to leave their type side empty, the left third
          on the wide one and the top half on the phone one, so the film needs
          no scrim over it and the dark type sits straight on the picture. */}
      <video
        ref={videoRef}
        key={portrait ? 'portrait' : 'landscape'}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={portrait ? './video/vaultshield-hero-mobile.mp4' : './video/vaultshield-hero.mp4'}
        poster={portrait ? './img/vaultshield-hero-mobile.jpg' : './img/vaultshield-hero.jpg'}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero />
    </main>
  )
}

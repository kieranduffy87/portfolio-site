import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

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
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* The shot is graded down hard from the original golden-hour footage:
          the page is set in white on black, and the ungraded film ran bright
          enough to lose the type. Centred at every width, since the rider is
          the middle of frame and a phone crop off to one side halves him. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="./video/securify-hero.mp4"
        poster="./img/securify-hero.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* The type lives around the edges of the frame and the rider is in the
          middle of it, so the picture is only shaded where words land: four
          gradients pulled in from the sides, none of them reaching the centre.
          The film keeps its own exposure where anyone is actually looking. */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-56 bg-gradient-to-t from-transparent to-black/80" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black/95" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-black/80 via-black/30 to-transparent" />

      <Navbar />

      <Hero />
    </section>
  )
}

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

      {/* Both gradients sit on the film rather than over the type, so they
          settle the picture without dulling the white it carries. The top one
          holds the sky back off the navigation and the first stat, the bottom
          one gives the other two stats ground to stand on. */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-64 bg-gradient-to-t from-transparent to-black/85" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

      <Navbar />

      <Hero />
    </section>
  )
}

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
      {/* The film was directed to stay dark end to end, no hotspots, so white
          type holds anywhere on the frame without a scrim over the picture. A
          phone crops the 16:9 cut to its middle, which is the one lit part of
          the shot, so narrow screens take the darker left of frame instead. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-[22%_center] md:object-center"
        src="./video/securify-hero.mp4"
        poster="./img/securify-hero.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Sits on the film rather than over the type: it settles the bottom of
          the frame to black so the two stats down there have ground to stand
          on, without dulling the white they are set in. */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

      <Navbar />

      <Hero />
    </section>
  )
}

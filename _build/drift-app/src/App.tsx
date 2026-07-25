import Navbar from './components/Navbar'
import AboutSection from './components/AboutSection'
import FeaturesSection from './components/FeaturesSection'
import { HERO_VIDEO } from './constants'

export default function App() {
  return (
    <main>
      {/* The negative bottom margin lets the cream section ride up over the
          film by the exact radius of its rounded top corners. */}
      <section className="relative h-screen overflow-hidden mb-[-25px]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/20" />

        <Navbar />

        <div className="relative z-10 h-full flex flex-col justify-end items-center gap-8 pb-12 md:pb-16 px-6">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-center text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal text-white leading-[1.1] tracking-tight">
              Own your time
              <br />
              without{' '}
              <em
                className="not-italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
              >
                the stress
              </em>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium max-w-[420px] text-center">
              Drift is a calm, ADHD-friendly planner that turns scattered ideas into a clear path
            </p>
          </div>

          <div className="flex items-center bg-black/25 backdrop-blur-md rounded-xl pl-6 pr-1 py-1">
            <p className="hidden sm:block text-white text-sm font-medium pr-6">
              No noise. No complicated systems. Just your day, gently sorted.
            </p>
            <p className="sm:hidden text-white text-sm font-medium pr-4">
              No noise. Just your day, gently sorted.
            </p>
            <button
              type="button"
              className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-xl whitespace-nowrap transition-colors hover:bg-white/90"
            >
              Start for free
            </button>
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturesSection />
    </main>
  )
}

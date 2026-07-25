import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour']

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">Lithos</span>
      </div>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        {LINKS.map((link) => (
          <button
            key={link}
            className={
              link === 'Course'
                ? 'text-white px-4 py-1.5 rounded-full text-sm font-medium'
                : 'text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors'
            }
          >
            {link}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="../../playground.html"
          className="hidden lg:block text-white/60 hover:text-white text-xs tracking-wide transition-colors"
        >
          &larr; KD Playground
        </a>
        <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
          Sign Up
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden text-white bg-white/15 backdrop-blur-md border border-white/25 rounded-full p-2.5"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-1 bg-black/70 backdrop-blur-lg border border-white/20 rounded-2xl p-3 flex flex-col">
          {LINKS.map((link) => (
            <button
              key={link}
              className="text-left text-white/85 hover:text-white text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              {link}
            </button>
          ))}
          <button className="mt-2 bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}

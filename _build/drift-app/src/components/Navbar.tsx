import { useState } from 'react'

const LINKS = ['Features', 'Drift AI', 'FAQ']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white rounded-full shadow-lg flex items-center gap-6 pl-6 pr-4 py-3">
        <span className="text-lg font-bold tracking-tight text-black">Drift.</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="relative w-6 h-4 flex flex-col justify-between"
        >
          {/* Two rules that cross into an X. The long easing is what makes the
              flip read as one motion rather than two lines moving. */}
          <span
            className={`block h-[2px] w-full bg-black origin-center transition-transform duration-300 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)' }}
          />
          <span
            className={`block h-[2px] w-full bg-black origin-center transition-transform duration-300 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)' }}
          />
        </button>
      </div>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-2xl shadow-lg p-2 transition-all duration-300 ${
          open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.77,0,0.175,1)' }}
      >
        {LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="block px-4 py-2.5 rounded-xl text-sm font-medium text-black hover:bg-black/5 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}

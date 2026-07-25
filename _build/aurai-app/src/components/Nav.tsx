import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { MENU_LINKS } from '../constants'

type Props = {
  open: boolean
  onToggle: () => void
}

export default function Nav({ open, onToggle }: Props) {
  return (
    <nav className="flex items-center justify-between">
      <div className="glass-in flex items-center bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-2.5 sm:px-6 sm:py-4">
        <a href="#" className="flex items-center gap-2.5 sm:gap-3" aria-label="Aurai home">
          <Logo className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          <span className="font-askan text-white text-base sm:text-xl tracking-wide">Aurai</span>
        </a>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="aurai-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="ml-4 sm:ml-32 md:ml-64 lg:ml-96 text-white/90 hover:text-white transition-colors"
        >
          {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>

      <a
        href="#join"
        className="glass-in hidden sm:block bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
      >
        Join the list
      </a>
    </nav>
  )
}

export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="aurai-menu"
      className="sm:hidden absolute top-[4.5rem] left-4 right-4 bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/10 z-20"
    >
      <ul className="flex flex-col gap-4">
        {MENU_LINKS.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              onClick={onNavigate}
              className="block text-white text-sm"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#join"
        onClick={onNavigate}
        className="mt-5 block w-full text-center bg-white text-gray-900 font-medium text-sm px-6 py-3 rounded-full"
      >
        Join the list
      </a>
    </div>
  )
}

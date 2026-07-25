import { Menu } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS } from '../constants'

export default function Navbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
      <a href="#" aria-label="VaultShield home" className="flex items-center">
        <Logo />
      </a>

      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="hidden items-center gap-2.5 md:flex">
        <a
          href="#start"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: 'var(--color-accent)' }}
        >
          Start For Free
        </a>
        <a
          href="#signin"
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
          style={{ background: 'var(--color-login-bg)', color: 'var(--color-text)' }}
        >
          Sign In
        </a>
      </div>

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        aria-controls="vaultshield-menu"
        className="md:hidden"
      >
        <Menu size={26} color="#192837" />
      </button>
    </nav>
  )
}

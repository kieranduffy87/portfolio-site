import Logo from './Logo'

const LINKS = ['platform', 'solutions', 'company', 'support']

export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6">
      <nav className="flex items-center justify-between gap-4">
        <a
          href="#"
          className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3"
        >
          <Logo className="h-5 w-5" />
          <span className="text-white text-sm font-normal tracking-tight">securify</span>
        </a>

        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors"
        >
          get started
        </button>
      </nav>
    </div>
  )
}

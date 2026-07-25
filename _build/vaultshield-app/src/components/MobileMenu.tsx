import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Logo from './Logo'
import { EASE, NAV_LINKS } from '../constants'

type Props = {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  // Escape closes the sheet, and the page underneath stays put while it is open.
  useEffect(() => {
    if (!open) return
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', key)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            id="vaultshield-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-0 top-0 z-50 flex flex-col"
            style={{
              width: 'min(88vw, 360px)',
              height: '100dvh',
              background: '#CFC8C5',
              boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo size={28} />
              <button type="button" onClick={onClose} aria-label="Close menu">
                <X size={24} color="#192837" />
              </button>
            </div>

            <div className="h-px w-full" style={{ background: 'rgba(25,40,55,0.15)' }} />

            <div className="flex flex-col gap-6 px-6 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={onClose}
                  className="text-lg font-medium"
                  style={{ color: 'var(--color-text)' }}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.45, ease: EASE }}
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-3 px-6 pb-10">
              <a
                href="#start"
                onClick={onClose}
                className="rounded-full px-5 py-3.5 text-center text-sm font-semibold text-white"
                style={{ background: 'var(--color-accent)' }}
              >
                Start For Free
              </a>
              <a
                href="#signin"
                onClick={onClose}
                className="rounded-full px-5 py-3.5 text-center text-sm font-semibold"
                style={{ background: 'var(--color-login-bg)', color: 'var(--color-text)' }}
              >
                Sign In
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

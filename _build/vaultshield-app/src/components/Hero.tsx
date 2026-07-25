import { motion } from 'framer-motion'
import { ArrowRightCircle, Fingerprint, LockKeyhole, Zap } from 'lucide-react'
import { fadeUp } from '../constants'

// The icons sit inside the sentence rather than beside it, so each one is a
// word in the line and wraps with the text.
export default function Hero() {
  return (
    <div
      className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8"
      style={{ paddingTop: 'clamp(40px, 8vw, 72px)' }}
    >
      <div style={{ maxWidth: 560 }}>
        <motion.h1 className="hero-heading" custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <Zap size={24} color="#192837" /> Lock Down Your Passwords{' '}
          <LockKeyhole size={24} color="#192837" /> with Ironclad Security{' '}
          <Fingerprint size={24} color="#192837" />
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            lineHeight: 1.65,
            opacity: 0.8,
            maxWidth: 560,
          }}
        >
          Zero stress, total control. VaultShield keeps you covered with unbreakable storage,
          one-tap access, and pro-grade tools for your non-stop world.
        </motion.p>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <motion.a
            href="#start"
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center justify-between"
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
              borderRadius: 50,
              padding: '17px 24px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
              minWidth: 210,
              gap: 32,
            }}
          >
            Get It Free
            <ArrowRightCircle size={20} />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

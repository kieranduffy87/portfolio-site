export const NAV_LINKS = ['Vault', 'Plans', 'Install', 'News', 'Help'] as const

// One shared entrance curve, used by every rise on the page.
export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: EASE },
  }),
}

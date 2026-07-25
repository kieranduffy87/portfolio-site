// Every asset is local to the build so the page has no third-party dependency.
// The films were generated in OpenArt (Nano Banana Pro stills, animated with
// Seedance 2.0) and compressed for the web.
export const HERO_VIDEO = './media/hero.mp4'
export const FEATURES_BG = './img/features-bg.jpg'

export type Feature = {
  title: string
  description: string
  video: string
}

export const FEATURES: Feature[] = [
  {
    title: 'Built for ease, not urgency',
    description:
      'Drift strips away the noise that makes organizing feel draining. Every surface is made to be soft, quiet, and intuitive so you can move forward, not get stuck decoding.',
    video: './media/feature-1.mp4',
  },
  {
    title: 'The gentlest way to start',
    description:
      'Beginning your day should feel natural, not daunting. Drift eases you into motion with subtle cues and a quiet view of what deserves your energy right now.',
    video: './media/feature-2.mp4',
  },
  {
    title: 'Deep, undivided focus',
    description:
      'No interruptions, no clutter. Drift holds you in the present task with a stripped-back layout that softens all else until you are truly ready to shift.',
    video: './media/feature-3.mp4',
  },
]

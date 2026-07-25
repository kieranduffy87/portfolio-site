import { FEATURES } from '../constants'

// Same three labels in both places: wrapped under the form on small screens,
// stacked against the right edge from sm up.
export default function FeaturePills({ variant }: { variant: 'mobile' | 'desktop' }) {
  if (variant === 'mobile') {
    return (
      <ul className="flex sm:hidden flex-wrap gap-2 mt-2">
        {FEATURES.map((label) => (
          <li
            key={label}
            className="bg-black/30 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10"
          >
            {label}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="hidden sm:flex flex-col items-end gap-2 self-end">
      {FEATURES.map((label) => (
        <li
          key={label}
          className="bg-black/30 backdrop-blur-md text-white text-xs sm:text-sm px-4 py-2 rounded-full border border-white/10"
        >
          {label}
        </li>
      ))}
    </ul>
  )
}

// The three words are placed rather than flowed: each one is pinned to its own
// corner of the frame so the eye travels down the page in steps, and the film
// keeps showing through the gaps between them.
const WORDS = [
  { text: 'protect', place: 'left-4 md:left-10 top-[18%]' },
  { text: 'your', place: 'right-4 md:right-10 top-[38%]' },
  { text: 'data', place: 'left-[18%] md:left-[28%] top-[58%]' },
]

export default function Hero() {
  return (
    <div className="relative h-full w-full">
      {WORDS.map((word) => (
        <h1
          key={word.text}
          className={`hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] ${word.place}`}
        >
          {word.text}
        </h1>
      ))}

      <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
        we can guarding your data with utmost care, empowering you with privacy everywhere
      </p>

      {/* Each stat sets its rule on the diagonal, leaning towards the number it
          belongs to, so the three of them frame the type rather than sit in it. */}
      <div className="absolute right-6 md:right-24 top-[14%]">
        <div className="flex items-center gap-3 justify-end">
          <span className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
          <span className="text-4xl md:text-5xl font-medium tracking-tight">+65k</span>
        </div>
        <p className="text-xs md:text-sm text-white/70 mt-1 text-right">startups use</p>
      </div>

      <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl font-medium tracking-tight">+1.5b</span>
          <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
        </div>
        <p className="text-xs md:text-sm text-white/70 mt-1">gb data was protected</p>
      </div>

      <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
        <div className="flex items-center gap-3 justify-end">
          <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          <span className="text-4xl md:text-5xl font-medium tracking-tight">+300k</span>
        </div>
        <p className="text-xs md:text-sm text-white/70 mt-1 text-right">downloads</p>
      </div>
    </div>
  )
}

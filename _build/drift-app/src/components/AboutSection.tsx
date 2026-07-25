import { Mail, Plus } from 'lucide-react'
import Logo from './Logo'

export default function AboutSection() {
  return (
    <section className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
        <p className="text-[#321C04] text-base md:text-lg text-center leading-relaxed max-w-lg">
          We craft tools that move with your rhythm, not over it. Designed for ease, presence, and
          flow.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="group flex items-center gap-3 bg-[#321C04] text-[#FFF9F2] rounded-full pl-1.5 pr-6 py-1.5 transition-colors hover:bg-[#1F1003]"
          >
            <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
              <Mail size={16} className="text-[#321C04]" />
            </span>
            <span className="text-xs uppercase tracking-wide font-medium">Say hello</span>
          </a>

          <a
            href="#"
            className="group flex items-center gap-3 bg-[#D9C4AA] text-[#321C04] rounded-full pl-1.5 pr-6 py-1.5 transition-colors hover:bg-[#CEBA9E]"
          >
            <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
              <Plus size={16} className="text-[#321C04]" />
            </span>
            <span className="text-xs uppercase tracking-wide font-medium">Stay informed</span>
          </a>
        </div>
      </div>

      <div className="flex items-center gap-[2px] my-16 md:my-24">
        <span className="w-2 h-2 rounded-full bg-[#D9C4AA] shrink-0" />
        <span className="flex-1 h-[2px] bg-[#D9C4AA]" />
        <span className="w-2 h-2 rounded-full bg-[#D9C4AA] shrink-0" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-16">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-6 shrink-0">
          <Logo fill="#321C04" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#321C04] leading-relaxed">
            Calm
            <br />
            Amplified
          </span>
        </div>

        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.3] font-normal text-[#321C04]">
          We make AI tools and assistants. But, most importantly, we help you remember what gentle
          productivity looks like when software moves with you, not over you. We create systems that
          carry the cognitive weight, so you can attend to what truly counts.
        </p>
      </div>
    </section>
  )
}

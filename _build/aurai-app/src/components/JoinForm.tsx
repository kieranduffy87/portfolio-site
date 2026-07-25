import { useState } from 'react'
import { Check } from 'lucide-react'

// Glass pill with the submit button living inside it. On submit the field is
// replaced in place by a confirmation, so the page never throws a dialog.
export default function JoinForm() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setJoined(true)
  }

  if (joined) {
    return (
      <div
        id="join"
        role="status"
        className="w-full max-w-[420px] flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-full border border-white/10 px-4 sm:px-6 py-3 sm:py-4"
      >
        <Check className="w-4 h-4 shrink-0 text-white" />
        <p className="text-white text-xs sm:text-sm truncate">
          You are on the list. We will write to {email}.
        </p>
      </div>
    )
  }

  return (
    <form
      id="join"
      onSubmit={handleSubmit}
      className="relative w-full max-w-[420px] bg-black/30 backdrop-blur-md rounded-full border border-white/10"
    >
      <label htmlFor="aurai-email" className="sr-only">
        Your email address
      </label>
      <input
        id="aurai-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        autoComplete="email"
        className="w-full bg-transparent text-white text-sm px-4 sm:px-6 py-3 sm:py-4 pr-[7.5rem] sm:pr-[9.5rem] rounded-full outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white text-gray-900 text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/90 transition-colors"
      >
        Join the list
      </button>
    </form>
  )
}

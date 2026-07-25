import { useEffect, useRef, useState } from 'react'
import { SPOTLIGHT_R } from '../constants'

interface RevealLayerProps {
  image: string
  cursorX: number
  cursorY: number
}

// The mask is a soft blob, so it can be drawn well below screen resolution and
// stretched back with mask-size. A full-size PNG data URL per frame never
// finishes decoding, and the layer stays invisible while it waits.
const MASK_SCALE = 1 / 3

/**
 * Paints a soft radial gradient into an offscreen canvas at the cursor, then
 * uses that canvas as the mask for a full-bleed copy of the second image.
 * Only what falls inside the glowing circle is visible.
 */
export default function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const last = useRef({ x: NaN, y: NaN })
  const [mask, setMask] = useState<string>('')

  useEffect(() => {
    const size = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = Math.round(window.innerWidth * MASK_SCALE)
      canvas.height = Math.round(window.innerHeight * MASK_SCALE)
      last.current = { x: NaN, y: NaN }
    }
    size()
    window.addEventListener('resize', size)
    return () => window.removeEventListener('resize', size)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // The eased cursor never stops changing by fractions of a pixel. Redrawing
    // on those is pure waste, so the mask only rebuilds on whole-pixel moves.
    const x = Math.round(cursorX)
    const y = Math.round(cursorY)
    if (x === last.current.x && y === last.current.y) return
    last.current = { x, y }

    const cx = x * MASK_SCALE
    const cy = y * MASK_SCALE
    const r = SPOTLIGHT_R * MASK_SCALE

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    setMask(canvas.toDataURL())
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: mask ? `url(${mask})` : undefined,
          WebkitMaskImage: mask ? `url(${mask})` : undefined,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />
    </>
  )
}

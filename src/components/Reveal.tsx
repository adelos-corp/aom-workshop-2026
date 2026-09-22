import { useEffect, useRef } from 'react'
import { animate, inView } from 'motion'

type RevealProps = { children: React.ReactNode; className?: string }

export function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !ref.current) return
    return inView(ref.current, () => {
      animate(ref.current!, { opacity: [0, 1], transform: ['translateY(28px)', 'translateY(0)'] }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] })
    }, { amount: 0.2 })
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
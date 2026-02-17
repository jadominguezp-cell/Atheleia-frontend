import { useRef, useCallback } from 'react'
import { Button, type ButtonProps } from '@chakra-ui/react'
import { gsap } from 'gsap'

/**
 * Botón con animación mínima al hacer click (scale + release).
 * Usar en las CTAs principales de cada fase del flujo.
 */
export function AnimatedButton({ onClick, children, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current
      if (el) {
        gsap.to(el, {
          scale: 0.96,
          duration: 0.08,
          ease: 'power2.in',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
          gsap.set(el, { clearProps: 'scale' })
        },
        })
      }
      onClick?.(e)
    },
    [onClick]
  )

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      transition="transform 0.15s ease, box-shadow 0.2s ease"
      _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
      _active={{ transform: 'translateY(0)' }}
      {...props}
    >
      {children}
    </Button>
  )
}

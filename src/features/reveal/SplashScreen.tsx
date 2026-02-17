import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { playRevealSound } from '../../utils/revealSound'

const SPLASH_DURATION_MS = 2200

interface SplashScreenProps {
  onComplete: () => void
}

const NAME = 'Aletheia'

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const letters = lettersRef.current.filter(Boolean)
    const overlay = overlayRef.current
    if (!container || !overlay) return

    playRevealSound()

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    if (letters.length > 0) {
      tl.fromTo(
        letters,
        {
          opacity: 0,
          y: 20,
          rotationX: -40,
          transformOrigin: '50% 100%',
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.045,
          duration: 0.5,
          ease: 'power2.out',
        }
      )
    } else {
      tl.fromTo(
        container,
        { opacity: 0, scale: 0.92, letterSpacing: '0.5em' },
        { opacity: 1, scale: 1, letterSpacing: '0.12em', duration: 0.7 }
      )
    }

    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.in',
        delay: 1.0,
        onComplete: () => {
          if (overlay) {
            overlay.style.visibility = 'hidden'
            overlay.style.pointerEvents = 'none'
          }
        },
      },
      '+=1.0'
    )

    const t = setTimeout(onComplete, SPLASH_DURATION_MS)
    return () => {
      clearTimeout(t)
      tl.kill()
    }
  }, [onComplete])

  return (
    <Box
      ref={overlayRef}
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="brand.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ visibility: 'visible' }}
    >
      <Box
        ref={containerRef}
        as="span"
        color="white"
        fontSize={{ base: '3xl', md: '5xl' }}
        fontWeight="600"
        letterSpacing="0.12em"
        display="inline-block"
        style={{ perspective: '400px' }}
      >
        {NAME.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            style={{ display: 'inline-block', willChange: 'transform' }}
          >
            {char}
          </span>
        ))}
      </Box>
    </Box>
  )
}

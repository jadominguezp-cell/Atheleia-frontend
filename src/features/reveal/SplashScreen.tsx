import { useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'

const SPLASH_DURATION_MS = 1800

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, SPLASH_DURATION_MS)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="brand.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ animation: 'splashFade 1.8s ease-out forwards' }}
    >
      <Text
        color="white"
        fontSize={{ base: '3xl', md: '5xl' }}
        fontWeight="600"
        letterSpacing="wider"
      >
        Aletheia
      </Text>
      <style>{`
        @keyframes splashFade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
      `}</style>
    </Box>
  )
}

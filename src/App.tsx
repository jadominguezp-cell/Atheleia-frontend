import { useState, useCallback, useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { theme } from './theme'
import { SplashScreen } from './features/reveal/SplashScreen'
import { SearchScreen } from './features/reveal/SearchScreen'
import { LoadingReveal } from './features/reveal/LoadingReveal'
import { DocumentChecklistReveal } from './features/reveal/DocumentChecklistReveal'

const LOADING_DURATION_MS = 2800

type RevealPhase = 'splash' | 'search' | 'loading' | 'checklist'

function App() {
  const [phase, setPhase] = useState<RevealPhase>('splash')
  const [, setDniOrRuc] = useState<string>('')

  const handleSplashComplete = useCallback(() => setPhase('search'), [])
  const handleSearch = useCallback((value: string) => {
    setDniOrRuc(value)
    setPhase('loading')
  }, [])

  useEffect(() => {
    if (phase !== 'loading') return
    const t = setTimeout(() => setPhase('checklist'), LOADING_DURATION_MS)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <ChakraProvider theme={theme}>
      {phase === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}

      <Box minH="100vh" bg="gray.50">
        {(phase === 'search' || phase === 'loading' || phase === 'checklist') && (
          <Box as="header" bg="brand.700" color="white" py={4} px={6}>
            <Box fontWeight="600" letterSpacing="wide">Aletheia Compliance</Box>
            <Box fontSize="sm" color="gray.300" mt={1}>Módulo de debida diligencia SPLAF</Box>
          </Box>
        )}

        <Box as="main" minH="calc(100vh - 56px)" py={4} px={4}>
          {phase === 'search' && <SearchScreen onSearch={handleSearch} />}
          {phase === 'loading' && <LoadingReveal />}
          {phase === 'checklist' && <DocumentChecklistReveal />}
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App

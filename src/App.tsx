import { useState, useCallback, useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { theme } from './theme'
import { SplashScreen } from './features/reveal/SplashScreen'
import { SelectionScreen } from './features/selection/SelectionScreen'
import { SearchScreen } from './features/reveal/SearchScreen'
import { LoadingReveal } from './features/reveal/LoadingReveal'
import { DocumentChecklistWithDescriptions } from './features/reveal/DocumentChecklistWithDescriptions'
import { PostChecklistView } from './features/PostChecklistView/PostChecklistView'
import { RiskMatrixView } from './features/risk/RiskMatrixView'
import { SummaryExportView } from './features/summary/SummaryExportView'
import { ChatbotView } from './features/chatbot/ChatbotView'
import { useDocumentSearch } from './hooks/useDocumentSearch'
import { RiskMatrixProvider } from './context/RiskMatrixContext'

const LOADING_DURATION_MS = 2800

type Branch = 'peru' | 'foreign' | null
type PeruStep = 'search' | 'loading' | 'checklist' | 'results' | 'risk' | 'summary'

function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [branch, setBranch] = useState<Branch>(null)
  const [peruStep, setPeruStep] = useState<PeruStep>('search')
  const [profileId, setProfileId] = useState('')

  const { foundAutomatically, requireLegalAnalysis, loading, searchByProfile } = useDocumentSearch()

  const handleSplashComplete = useCallback(() => setSplashDone(true), [])
  const handlePeruvian = useCallback(() => setBranch('peru'), [])
  const handleForeign = useCallback(() => setBranch('foreign'), [])

  const handleSearch = useCallback((value: string) => {
    setProfileId(value)
    setPeruStep('loading')
  }, [])

  useEffect(() => {
    if (peruStep !== 'loading') return
    const t = setTimeout(() => setPeruStep('checklist'), LOADING_DURATION_MS)
    return () => clearTimeout(t)
  }, [peruStep])

  useEffect(() => {
    if (peruStep === 'results' && profileId) searchByProfile(profileId)
  }, [peruStep, profileId, searchByProfile])

  const showHeader = splashDone && branch !== null
  const showFooter = splashDone

  return (
    <ChakraProvider theme={theme}>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <Box minH="100vh" bg="gray.50">
        {showHeader && (
          <Box as="header" bg="brand.700" color="white" py={4} px={6}>
            <Box fontWeight="600" letterSpacing="wide">Aletheia Compliance</Box>
            <Box fontSize="sm" color="gray.300" mt={1}>Módulo de debida diligencia SPLAF</Box>
          </Box>
        )}

        <Box as="main" minH="calc(100vh - 56px)" py={4} px={4}>
          {splashDone && branch === null && (
            <SelectionScreen onPeruvian={handlePeruvian} onForeign={handleForeign} />
          )}

          {branch === 'foreign' && <ChatbotView />}

          {branch === 'peru' && (
            <>
              {peruStep === 'search' && <SearchScreen onSearch={handleSearch} />}
              {peruStep === 'loading' && <LoadingReveal />}
              {peruStep === 'checklist' && (
                <DocumentChecklistWithDescriptions onContinue={() => setPeruStep('results')} />
              )}
              {peruStep === 'results' && (
                loading ? (
                  <LoadingReveal />
                ) : (
                  <RiskMatrixProvider>
                    <PostChecklistView
                      foundAutomatically={foundAutomatically}
                      requireLegalAnalysis={requireLegalAnalysis}
                      profileId={profileId}
                    />
                    <Box mt={8}>
                      <RiskMatrixView />
                    </Box>
                    <Box mt={8}>
                      <SummaryExportView profileId={profileId} />
                    </Box>
                  </RiskMatrixProvider>
                )
              )}
            </>
          )}
        </Box>

        {showFooter && (
          <Box as="footer" bg="gray.800" color="gray.400" py={4} px={6} fontSize="sm" textAlign="center">
            <Box>Información simulada para fines demostrativos.</Box>
            <Box mt={1}>La presente herramienta no sustituye asesoría legal especializada.</Box>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  )
}

export default App

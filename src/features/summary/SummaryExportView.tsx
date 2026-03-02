import { Box, Heading, Text, VStack, useToast } from '@chakra-ui/react'
import { AnimatedButton } from '../../components/AnimatedButton'
import { useRiskMatrixContext } from '../../context/RiskMatrixContext'

interface SummaryExportViewProps {
  profileId?: string
}

export function SummaryExportView({ profileId }: SummaryExportViewProps) {
  const toast = useToast()
  const { riesgoGlobal } = useRiskMatrixContext()

  const handleGenerarReporte = () => {
    toast({
      title: 'Reporte SPLAFT (Simulado)',
      description: 'Se ha generado un PDF simulado con: datos consultados, documentos verificados, pendientes, resultado matriz de riesgo y observaciones legales.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <Box maxW="800px" mx="auto" py={8} px={4}>
      <Heading size="md" mb={2} color="gray.800">
        Resumen consolidado
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Compilación de datos consultados, documentos verificados, pendientes, resultado de la matriz de riesgo y observaciones legales. Exportación simulada.
      </Text>
      <VStack align="stretch" spacing={3} bg="gray.50" p={6} borderRadius="lg" borderWidth="1px" mb={6}>
        <Text fontSize="sm"><strong>Perfil consultado:</strong> {profileId || '—'}</Text>
        <Text fontSize="sm"><strong>Riesgo global (matriz):</strong> {riesgoGlobal}</Text>
        <Text fontSize="sm">Documentos verificados y pendientes según resultados de búsqueda.</Text>
        <Text fontSize="sm">Observaciones legales: campo disponible en flujo de revisión.</Text>
      </VStack>
      <AnimatedButton colorScheme="blue" size="lg" w="full" onClick={handleGenerarReporte}>
        Generar Reporte SPLAFT (Simulado)
      </AnimatedButton>
      <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
        Información simulada para fines demostrativos. La presente herramienta no sustituye asesoría legal especializada.
      </Text>
    </Box>
  )
}

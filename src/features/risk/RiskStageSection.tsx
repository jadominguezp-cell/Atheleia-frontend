import { Box, Heading, Text, Grid } from '@chakra-ui/react'
import { useOperations } from '../../context/OperationsContext'
import { useComplianceProgress } from '../../hooks'
import { RiskMatrix } from './RiskMatrix'
import { ComplianceReport } from './ComplianceReport'

export function RiskStageSection() {
  const { operacionSeleccionada, actualizarFactoresRiesgo } = useOperations()
  const { porcentaje: porcentajeCumplimiento, documentosPendientes } = useComplianceProgress(
    operacionSeleccionada,
  )

  const handleMockPdf = () => {
    alert(
      'Exportación a PDF simulada.\n\nEn una versión completa, aquí se generaría un reporte formal de cumplimiento SPLAF en formato PDF.',
    )
  }
  const handleMockZip = () => {
    alert(
      'Descarga de carpeta ZIP simulada.\n\nEn una versión completa, aquí se consolidarían todos los documentos de la operación en una carpeta comprimida.',
    )
  }

  if (!operacionSeleccionada) return null

  return (
    <Box bg="white" p={6} borderRadius="md" borderWidth="1px" shadow="sm" mb={6}>
      <Heading size="sm" mb={1}>Etapa 2: Verificación y matriz de riesgo</Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        La verificación es un proceso compartido: la información recopilada debe ser contrastada y analizada en función de factores de riesgo específicos.
      </Text>

      <Grid templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }} gap={6}>
        <RiskMatrix
          factores={operacionSeleccionada.factoresRiesgo}
          onCambiar={(factor, valor) =>
            actualizarFactoresRiesgo(operacionSeleccionada.id, factor, valor)
          }
        />
        <ComplianceReport
          operacion={operacionSeleccionada}
          porcentajeCumplimiento={porcentajeCumplimiento}
          documentosPendientes={documentosPendientes}
          onExportPdf={handleMockPdf}
          onExportZip={handleMockZip}
        />
      </Grid>
    </Box>
  )
}

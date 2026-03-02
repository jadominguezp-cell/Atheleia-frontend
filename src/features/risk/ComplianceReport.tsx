import { Box, Heading, Text, Button, ButtonGroup, VStack, HStack } from '@chakra-ui/react'
import { RiskBadge } from '../../components/ui'
import type { Operacion } from '../../types'

interface ComplianceReportProps {
  operacion: Operacion
  porcentajeCumplimiento: number
  documentosPendientes: number
  onExportPdf: () => void
  onExportZip: () => void
}

export function ComplianceReport({
  operacion,
  porcentajeCumplimiento,
  documentosPendientes,
  onExportPdf,
  onExportZip,
}: ComplianceReportProps) {
  return (
    <Box>
      <Heading size="sm" mb={3}>Resumen de cumplimiento SPLAFT</Heading>
      <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px">
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontSize="sm">Porcentaje de cumplimiento de identificación:</Text>
            <Text fontWeight="medium">{porcentajeCumplimiento}%</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm">Documentos faltantes u observados:</Text>
            <Text fontWeight="medium">{documentosPendientes}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm">Resultado de la matriz de riesgo:</Text>
            <RiskBadge nivel={operacion.riesgo} />
          </HStack>
          <Box pt={2}>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Observaciones legales consolidadas:</Text>
            <Text fontSize="sm" color="gray.700">
              {operacion.observacionesLegales ??
                'Sin observaciones registradas. Este espacio se utiliza para resumir hallazgos críticos y recomendaciones de mitigación.'}
            </Text>
          </Box>
          <Text fontSize="xs" color="gray.500" borderTopWidth="1px" borderStyle="dashed" pt={2} mt={2}>
            Este reporte no sustituye una asesoría legal. Es una herramienta de apoyo para debida diligencia y cumplimiento SPLAFT.
          </Text>
          <ButtonGroup size="sm" mt={3}>
            <Button colorScheme="blue" onClick={onExportPdf}>Exportar reporte en PDF (mock)</Button>
            <Button variant="outline" onClick={onExportZip}>Descargar carpeta ZIP (mock)</Button>
          </ButtonGroup>
        </VStack>
      </Box>
    </Box>
  )
}

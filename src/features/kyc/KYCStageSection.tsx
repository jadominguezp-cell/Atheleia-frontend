import { useState, useCallback, useEffect } from 'react'
import { Box, Flex, Heading, Text, Progress, Grid } from '@chakra-ui/react'
import { useOperations } from '../../context/OperationsContext'
import { useComplianceProgress } from '../../hooks'
import { DocumentChecklist } from './DocumentChecklist'
import { ObservacionesLegales } from './ObservacionesLegales'
import type { DocumentoRequerido, EstadoDocumento } from '../../types'

const USUARIO_MOCK = 'usuario.demo@empresa.com'

export function KYCStageSection() {
  const { operacionSeleccionada, actualizarDocumento, guardarObservacionesLegales } = useOperations()
  const { porcentaje } = useComplianceProgress(operacionSeleccionada)
  const [observacionesTemporales, setObservacionesTemporales] = useState(
    operacionSeleccionada?.observacionesLegales ?? '',
  )

  useEffect(() => {
    setObservacionesTemporales(operacionSeleccionada?.observacionesLegales ?? '')
  }, [operacionSeleccionada?.id, operacionSeleccionada?.observacionesLegales])

  const handleCargarMock = useCallback(
    (doc: DocumentoRequerido) => {
      if (!operacionSeleccionada) return
      const ahora = new Date().toISOString()
      actualizarDocumento(operacionSeleccionada.id, doc.id, {
        estado: 'CARGADO',
        archivoNombre: `${doc.id}-${operacionSeleccionada.id}.pdf`,
        ultimaActualizacion: ahora,
        usuario: USUARIO_MOCK,
      })
    },
    [operacionSeleccionada, actualizarDocumento],
  )

  const handleCambiarEstado = useCallback(
    (doc: DocumentoRequerido, estado: EstadoDocumento) => {
      if (!operacionSeleccionada) return
      const ahora = new Date().toISOString()
      actualizarDocumento(operacionSeleccionada.id, doc.id, {
        estado,
        ultimaActualizacion: ahora,
        usuario: USUARIO_MOCK,
      })
    },
    [operacionSeleccionada, actualizarDocumento],
  )

  const handleGuardarObservaciones = useCallback(() => {
    if (!operacionSeleccionada) return
    guardarObservacionesLegales(operacionSeleccionada.id, observacionesTemporales)
  }, [operacionSeleccionada, observacionesTemporales, guardarObservacionesLegales])

  if (!operacionSeleccionada) return null

  const clienteLabel = operacionSeleccionada.clienteTipo === 'EXTRANJERO' ? 'extranjero' : 'nacional'

  return (
    <Box bg="white" p={6} borderRadius="md" borderWidth="1px" shadow="sm" mb={6}>
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={4}>
        <Box>
          <Heading size="sm" mb={1}>Etapa 1: Identificación del cliente (KYC)</Heading>
          <Text fontSize="sm" color="gray.600">
            La operación no puede cerrarse sin contar con información previa y documentada del cliente, conforme a la normativa SPLAF.
          </Text>
        </Box>
        <Box minW="220px">
          <Text fontSize="xs" color="gray.600" mb={1}>Avance de cumplimiento</Text>
          <Progress value={porcentaje} size="sm" colorScheme="blue" borderRadius="full" />
          <Text fontSize="sm" fontWeight="medium" mt={1}>{porcentaje}%</Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1.8fr) minmax(280px, 1fr)' }} gap={6}>
        <Box minW={0} overflow="hidden">
            <DocumentChecklist
            documentos={operacionSeleccionada.documentos}
            clienteTipo={clienteLabel}
            onCargarMock={handleCargarMock}
            onCambiarEstado={handleCambiarEstado}
          />
        </Box>
        <ObservacionesLegales
          value={observacionesTemporales || operacionSeleccionada.observacionesLegales || ''}
          onChange={setObservacionesTemporales}
          onSave={handleGuardarObservaciones}
        />
      </Grid>
    </Box>
  )
}

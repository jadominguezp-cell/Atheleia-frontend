import { Box, Heading, Text, Flex, Button, ButtonGroup, SimpleGrid } from '@chakra-ui/react'
import { riesgoALabel } from '../../services/riskService'
import type { FactoresRiesgo, RiesgoNivel } from '../../types'

const FACTORES: { key: keyof FactoresRiesgo; label: string }[] = [
  { key: 'actividadEconomica', label: 'Tipo de actividad económica' },
  { key: 'paisOrigen', label: 'País de origen del cliente / contraparte' },
  { key: 'tipoActivo', label: 'Tipo de activo' },
  { key: 'montoOperacion', label: 'Monto de la operación' },
  { key: 'estructuraSocietaria', label: 'Complejidad de la estructura societaria' },
]

const NIVELES: RiesgoNivel[] = ['BAJO', 'MEDIO', 'ALTO']
const COLOR: Record<RiesgoNivel, string> = { BAJO: 'green', MEDIO: 'yellow', ALTO: 'red' }

interface RiskMatrixProps {
  factores: FactoresRiesgo
  onCambiar: (factor: keyof FactoresRiesgo, valor: RiesgoNivel) => void
}

export function RiskMatrix({ factores, onCambiar }: RiskMatrixProps) {
  return (
    <Box>
      <Heading size="sm" mb={1}>Matriz de riesgo (mock)</Heading>
      <Text fontSize="xs" color="gray.600" mb={3}>
        Ajuste los factores para simular distintos escenarios de riesgo.
      </Text>
      <SimpleGrid columns={1} spacing={3}>
        {FACTORES.map(({ key, label }) => (
          <Flex key={key} align="center" justify="space-between" gap={3} wrap="wrap">
            <Text fontSize="sm" flex="1" minW="180px">{label}</Text>
            <ButtonGroup size="sm" isAttached variant="outline">
              {NIVELES.map((nivel) => (
                <Button
                  key={nivel}
                  colorScheme={COLOR[nivel]}
                  variant={factores[key] === nivel ? 'solid' : 'outline'}
                  onClick={() => onCambiar(key, nivel)}
                >
                  {riesgoALabel(nivel)}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  )
}

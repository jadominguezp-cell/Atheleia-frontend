import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Select,
  Input,
  Button,
  VStack,
  HStack,
  Grid,
  Divider,
} from '@chakra-ui/react'
import { useRiskMatrixContext } from '../../context/RiskMatrixContext'
import type { RiesgoAsociado, ProbabilidadNivel, ImpactoNivel } from '../../domain/risk/risk.types'

interface RiskMatrixViewProps {
  onContinue: () => void
}

export function RiskMatrixView({ onContinue }: RiskMatrixViewProps) {
  const { events, riesgoGlobal, updateEvent, addEvent, deleteEvent } = useRiskMatrixContext()

  const getColorByResult = (result: number) => {
    if (result <= 2) return 'green'
    if (result <= 4) return 'yellow'
    return 'red'
  }

  const getLabelByResult = (result: number) => {
    if (result <= 2) return 'Bajo'
    if (result <= 4) return 'Medio'
    return 'Alto'
  }

  return (
    <Box maxW="1200px" mx="auto" py={8} px={6} bg="white" borderRadius="xl" shadow="sm">
      <VStack align="stretch" spacing={10}>
        {/* 1. FACTORES DE RIESGO */}
        <Box>
          <Heading size="md" mb={4} color="brand.700" textTransform="uppercase" letterSpacing="wider">
            1. Factores de Riesgo SPLAFTT
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <Box p={4} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderLeftColor="brand.500">
              <Text fontWeight="bold" fontSize="sm" mb={1}>1.1. CONTRAPARTES</Text>
              <Text fontSize="xs" color="gray.600">Clientes, proveedores, socios y trabajadores.</Text>
            </Box>
            <Box p={4} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderLeftColor="brand.500">
              <Text fontWeight="bold" fontSize="sm" mb={1}>1.2. CANALES</Text>
              <Text fontSize="xs" color="gray.600">Canales de comercialización: internet, vía presencial, intranet, etc.</Text>
            </Box>
            <Box p={4} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderLeftColor="brand.500">
              <Text fontWeight="bold" fontSize="sm" mb={1}>1.3. PRODUCTOS/SERVICIOS</Text>
              <Text fontSize="xs" color="gray.600">Productos con mayor riesgo de Lavado de Activos y FT.</Text>
            </Box>
            <Box p={4} borderRadius="md" bg="gray.50" borderLeft="4px solid" borderLeftColor="brand.500">
              <Text fontWeight="bold" fontSize="sm" mb={1}>1.4. ZONA GEOGRÁFICA</Text>
              <Text fontSize="xs" color="gray.600">Zonas que por sus características puedan generar mayor riesgo.</Text>
            </Box>
          </Grid>
        </Box>

        <Divider />

        {/* 2. CRITERIOS DE EVALUACIÓN */}
        <Box>
          <Heading size="md" mb={4} color="brand.700" textTransform="uppercase" letterSpacing="wider">
            2. Criterios de Evaluación
          </Heading>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            <Box>
              <Text fontWeight="bold" mb={3} fontSize="sm" color="gray.700">2.1. Medidas Cualitativas de Probabilidad</Text>
              <VStack align="stretch" spacing={2}>
                <Box p={2} bg="green.50" borderRadius="sm"><Text fontSize="xs"><strong>Bajo (1):</strong> Es raro que ocurra el evento de riesgo.</Text></Box>
                <Box p={2} bg="yellow.50" borderRadius="sm"><Text fontSize="xs"><strong>Medio (2):</strong> Es posible que ocurra el evento de riesgo.</Text></Box>
                <Box p={2} bg="red.50" borderRadius="sm"><Text fontSize="xs"><strong>Alto (3):</strong> Es muy probable que ocurra el evento de riesgo.</Text></Box>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={3} fontSize="sm" color="gray.700">2.2. Medidas Cualitativas de Impacto</Text>
              <VStack align="stretch" spacing={2}>
                <Box p={2} bg="green.50" borderRadius="sm">
                  <Text fontSize="xs"><strong>Bajo (1):</strong> Baja pérdida. Amonestación moderada. No causa pérdida de clientes.</Text>
                </Box>
                <Box p={2} bg="yellow.50" borderRadius="sm">
                  <Text fontSize="xs"><strong>Medio (2):</strong> Pérdida media. Sanción monetaria estricta. Posible pérdida de clientes.</Text>
                </Box>
                <Box p={2} bg="red.50" borderRadius="sm">
                  <Text fontSize="xs"><strong>Alto (3):</strong> Alta pérdida. Cuantiosas multas. Peligro de solvencia. Procesos penales.</Text>
                </Box>
              </VStack>
            </Box>
          </Grid>
        </Box>

        {/* MATRIZ 3x3 */}
        <Box>
          <Text fontWeight="bold" mb={4} fontSize="sm" color="gray.700">Matriz de Riesgo (Probabilidad x Impacto)</Text>
          <Box overflowX="auto">
            <Table variant="unstyled" size="sm" sx={{ borderCollapse: 'separate', borderSpacing: '8px' }}>
              <Thead>
                <Tr>
                  <Th border="none"></Th>
                  <Th textAlign="center" color="gray.500" fontWeight="bold">I: Bajo (1)</Th>
                  <Th textAlign="center" color="gray.500" fontWeight="bold">I: Medio (2)</Th>
                  <Th textAlign="center" color="gray.500" fontWeight="bold">I: Alto (3)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[3, 2, 1].map((p) => (
                  <Tr key={p}>
                    <Td fontWeight="bold" color="gray.500" textAlign="right" pr={4}>P: {p === 3 ? 'Alto' : p === 2 ? 'Medio' : 'Bajo'} ({p})</Td>
                    {[1, 2, 3].map((i) => {
                      const res = p * i
                      return (
                        <Td key={i} textAlign="center" p={0}>
                          <Box
                            bg={`${getColorByResult(res)}.500`}
                            color="white"
                            p={4}
                            borderRadius="lg"
                            fontWeight="bold"
                            fontSize="lg"
                            boxShadow="sm"
                          >
                            {res}
                          </Box>
                        </Td>
                      )
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <HStack mt={4} justify="center" spacing={8}>
            <HStack><Box w={3} h={3} bg="green.500" borderRadius="full" /><Text fontSize="xs">Riesgo Bajo (1-2)</Text></HStack>
            <HStack><Box w={3} h={3} bg="yellow.500" borderRadius="full" /><Text fontSize="xs">Riesgo Medio (3-4)</Text></HStack>
            <HStack><Box w={3} h={3} bg="red.500" borderRadius="full" /><Text fontSize="xs">Riesgo Alto (6-9)</Text></HStack>
          </HStack>
        </Box>

        <Divider />

        {/* 3. RIESGOS INHERENTES - TABLA DINÁMICA */}
        <Box>
          <Heading size="md" mb={4} color="brand.700" textTransform="uppercase" letterSpacing="wider">
            3. Riesgos Inherentes de la Empresa
          </Heading>
          <TableContainer borderWidth="1px" borderRadius="lg" bg="white">
            <Table size="sm" variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={4}>Cód</Th>
                  <Th py={4}>Evento de Riesgo</Th>
                  <Th py={4}>Causa</Th>
                  <Th py={4}>Riesgo Asociado</Th>
                  <Th py={4} textAlign="center">Prob (1-3)</Th>
                  <Th py={4} textAlign="center">Imp (1-3)</Th>
                  <Th py={4} textAlign="center">Riesgo Inherente</Th>
                  <Th py={4}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {events.map((ev) => (
                  <Tr key={ev.id}>
                    <Td>
                      <Input
                        size="xs"
                        variant="ghost"
                        value={ev.codigo}
                        onChange={(e) => updateEvent(ev.id, { codigo: e.target.value })}
                        fontWeight="bold"
                        textAlign="center"
                      />
                    </Td>
                    <Td maxW="200px">
                      <Input
                        size="xs"
                        variant="unstyled"
                        value={ev.evento}
                        placeholder="Describa el evento..."
                        onChange={(e) => updateEvent(ev.id, { evento: e.target.value })}
                      />
                    </Td>
                    <Td maxW="200px">
                      <Input
                        size="xs"
                        variant="unstyled"
                        value={ev.causa}
                        placeholder="Describa la causa..."
                        onChange={(e) => updateEvent(ev.id, { causa: e.target.value })}
                      />
                    </Td>
                    <Td>
                      <Select
                        size="xs"
                        variant="ghost"
                        value={ev.riesgoAsociado}
                        onChange={(e) => updateEvent(ev.id, { riesgoAsociado: e.target.value as RiesgoAsociado })}
                      >
                        <option value="Cliente">Cliente</option>
                        <option value="Proveedor">Proveedor</option>
                        <option value="Trabajadores">Trabajadores</option>
                        <option value="Producto">Producto</option>
                        <option value="Canal">Canal</option>
                        <option value="Zona Geográfica">Zona Geográfica</option>
                      </Select>
                    </Td>
                    <Td textAlign="center">
                      <Select
                        size="xs"
                        w="60px"
                        mx="auto"
                        value={ev.probabilidad}
                        onChange={(e) => updateEvent(ev.id, { probabilidad: parseInt(e.target.value) as ProbabilidadNivel })}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </Select>
                    </Td>
                    <Td textAlign="center">
                      <Select
                        size="xs"
                        w="60px"
                        mx="auto"
                        value={ev.impacto}
                        onChange={(e) => updateEvent(ev.id, { impacto: parseInt(e.target.value) as ImpactoNivel })}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </Select>
                    </Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={getColorByResult(ev.riesgoInherente)}
                        variant="solid"
                        px={4}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                      >
                        {ev.riesgoInherente} - {getLabelByResult(ev.riesgoInherente)}
                      </Badge>
                    </Td>
                    <Td>
                      <Button size="xs" colorScheme="red" variant="ghost" onClick={() => deleteEvent(ev.id)}>
                        ✕
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <HStack mt={4} justify="space-between">
            <Button size="sm" variant="outline" colorScheme="brand" onClick={addEvent}>
              + Agregar Riesgo
            </Button>
            <HStack>
              <Text fontSize="sm" fontWeight="bold">Riesgo Global Calculado:</Text>
              <Badge colorScheme={riesgoGlobal === 'Bajo' ? 'green' : riesgoGlobal === 'Medio' ? 'yellow' : 'red'} fontSize="md" px={4} py={1}>
                {riesgoGlobal}
              </Badge>
            </HStack>
          </HStack>
        </Box>

        <Divider />

        <Box alignSelf="flex-end" pt={4}>
          <Button colorScheme="brand" size="lg" onClick={onContinue} px={10}>
            Finalizar y Ver Resumen
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

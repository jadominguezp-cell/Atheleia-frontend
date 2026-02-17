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
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useRiskMatrixContext } from '../../context/RiskMatrixContext'
import type { Probabilidad, Impacto } from '../../domain/risk/risk.types'
import { useState } from 'react'

const PROB: Probabilidad[] = ['Baja', 'Media', 'Alta']
const IMP: Impacto[] = ['Bajo', 'Medio', 'Alto']
const COLOR: Record<string, string> = { Bajo: 'green', Medio: 'yellow', Alto: 'red' }

export function RiskMatrixView() {
  const { indicadores, riesgoGlobal, updateIndicador, addPersonalizado } = useRiskMatrixContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [probabilidad, setProbabilidad] = useState<Probabilidad>('Media')
  const [impacto, setImpacto] = useState<Impacto>('Medio')
  const toast = useToast()

  const handleAdd = () => {
    if (!nombre.trim()) {
      toast({ title: 'Ingrese el nombre del indicador', status: 'warning', duration: 2000 })
      return
    }
    addPersonalizado(nombre.trim(), descripcion.trim(), probabilidad, impacto)
    setNombre('')
    setDescripcion('')
    onClose()
  }

  return (
    <Box maxW="1200px" mx="auto" py={6} px={4}>
      <Heading size="md" mb={1} color="gray.800">
        Matriz de Riesgo SPLAF
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Evaluación basada en probabilidad e impacto conforme criterios de prevención de lavado de activos y financiamiento del terrorismo.
      </Text>
      <Text fontSize="xs" color="gray.500" mb={4}>
        Riesgo = Probabilidad x Impacto. Escala: 1-2 Bajo, 3-4 Medio, 6-9 Alto.
      </Text>

      <TableContainer borderWidth="1px" borderRadius="md" bg="white" overflowX="auto">
        <Table size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Indicador</Th>
              <Th>Tipo</Th>
              <Th>Probabilidad</Th>
              <Th>Impacto</Th>
              <Th>Nivel de Riesgo</Th>
              <Th>Observaciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {indicadores.map((ind) => (
              <Tr key={ind.id}>
                <Td fontWeight="500">{ind.nombre}</Td>
                <Td>{ind.tipo}</Td>
                <Td>
                  <Select
                    size="sm"
                    value={ind.probabilidad}
                    onChange={(e) => updateIndicador(ind.id, { probabilidad: e.target.value as Probabilidad })}
                  >
                    {PROB.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  <Select
                    size="sm"
                    value={ind.impacto}
                    onChange={(e) => updateIndicador(ind.id, { impacto: e.target.value as Impacto })}
                  >
                    {IMP.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  <Badge colorScheme={COLOR[ind.nivelRiesgo]} variant="subtle">
                    {ind.nivelRiesgo}
                  </Badge>
                </Td>
                <Td>
                  <Input
                    size="sm"
                    placeholder="Observaciones"
                    value={ind.observaciones}
                    onChange={(e) => updateIndicador(ind.id, { observaciones: e.target.value })}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <HStack mt={4} spacing={4} align="center">
        <Button size="sm" variant="outline" colorScheme="blue" onClick={onOpen}>
          Agregar indicador
        </Button>
        <Text fontSize="sm" fontWeight="600">Riesgo Global:</Text>
        <Badge colorScheme={COLOR[riesgoGlobal]} fontSize="md" px={3} py={1}>
          {riesgoGlobal}
        </Badge>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar indicador personalizado</ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Nombre del indicador</FormLabel>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Factor X" />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Opcional" />
              </FormControl>
              <FormControl>
                <FormLabel>Probabilidad</FormLabel>
                <Select value={probabilidad} onChange={(e) => setProbabilidad(e.target.value as Probabilidad)}>
                  {PROB.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Impacto</FormLabel>
                <Select value={impacto} onChange={(e) => setImpacto(e.target.value as Impacto)}>
                  {IMP.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="blue" onClick={handleAdd}>Agregar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

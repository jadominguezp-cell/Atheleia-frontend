import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Text,
  Box,
} from '@chakra-ui/react'
import { StatusBadge, RiskBadge } from '../../components/ui'
import type { Operacion, TipoOperacion } from '../../types'

interface OperationsTableProps {
  operaciones: Operacion[]
  operacionSeleccionadaId: string
  onSelectOperacion: (id: string) => void
}

function tipoLabel(tipo: TipoOperacion): string {
  return tipo === 'COMPRA' ? 'Compra de activos' : 'Venta de activos'
}

export function OperationsTable({
  operaciones,
  operacionSeleccionadaId,
  onSelectOperacion,
}: OperationsTableProps) {
  return (
    <Box>
      <Heading size="sm" mb={1}>Operaciones activas</Heading>
      <Text fontSize="sm" color="gray.600" mb={3}>
        Vista general de operaciones en curso y su estado de cumplimiento SPLAFT.
      </Text>
      <TableContainer borderWidth="1px" borderRadius="md" bg="white" overflowX="auto" maxW="100%">
        <Table size="sm" variant="simple" width="100%" sx={{ tableLayout: 'fixed' }}>
          <Thead bg="gray.50">
            <Tr>
              <Th w="80px">Operación</Th>
              <Th w="120px">Tipo</Th>
              <Th minW="100px">Comprador (Perú)</Th>
              <Th minW="100px">Vendedor (extranjero)</Th>
              <Th w="90px">País</Th>
              <Th w="110px">Monto</Th>
              <Th w="100px">Estado SPLAFT</Th>
              <Th w="80px">Riesgo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {operaciones.map((op) => (
              <Tr
                key={op.id}
                cursor="pointer"
                bg={op.id === operacionSeleccionadaId ? 'blue.50' : undefined}
                _hover={{ bg: op.id === operacionSeleccionadaId ? 'blue.50' : 'gray.50' }}
                onClick={() => onSelectOperacion(op.id)}
              >
                <Td whiteSpace="normal" wordBreak="break-word">{op.id}</Td>
                <Td whiteSpace="normal" wordBreak="break-word">{tipoLabel(op.tipoOperacion)}</Td>
                <Td whiteSpace="normal" wordBreak="break-word">{op.empresaCompradora}</Td>
                <Td whiteSpace="normal" wordBreak="break-word">{op.empresaVendedora}</Td>
                <Td whiteSpace="normal" wordBreak="break-word">{op.paisContraparte}</Td>
                <Td whiteSpace="nowrap">USD {op.monto.toLocaleString('en-US')}</Td>
                <Td><StatusBadge estado={op.estadoCumplimiento} /></Td>
                <Td><RiskBadge nivel={op.riesgo} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

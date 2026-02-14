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
  Button,
  ButtonGroup,
  Badge,
  VStack,
} from '@chakra-ui/react'
import { DocumentStatusBadge } from '../../components/ui'
import type { DocumentoRequerido, EstadoDocumento } from '../../types'

interface DocumentChecklistProps {
  documentos: DocumentoRequerido[]
  clienteTipo: string
  onCargarMock: (doc: DocumentoRequerido) => void
  onCambiarEstado: (doc: DocumentoRequerido, estado: EstadoDocumento) => void
}

export function DocumentChecklist({
  documentos,
  clienteTipo,
  onCargarMock,
  onCambiarEstado,
}: DocumentChecklistProps) {
  return (
    <Box>
      <Heading size="sm" mb={1}>
        Checklist automático de documentos – Cliente {clienteTipo}
      </Heading>
      <Text fontSize="xs" color="gray.600" mb={3}>
        El sistema genera un checklist en función del tipo de cliente y la naturaleza de la operación.
      </Text>
      <TableContainer borderWidth="1px" borderRadius="md" overflowX="auto" maxW="100%">
        <Table size="sm" variant="simple" width="100%" sx={{ tableLayout: 'fixed' }}>
          <Thead bg="gray.50">
            <Tr>
              <Th minW="200px" w="35%">Documento</Th>
              <Th w="100px">Estado</Th>
              <Th minW="140px" w="22%">Archivo / trazabilidad</Th>
              <Th w="140px">Acciones (mock)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {documentos.map((doc) => (
              <Tr key={doc.id}>
                <Td whiteSpace="normal" wordBreak="break-word" overflow="hidden" py={2}>
                  <VStack align="start" spacing={0} maxW="100%">
                    <Text fontWeight="medium" noOfLines={2}>{doc.nombre}</Text>
                    <Text fontSize="xs" color="gray.600" wordBreak="break-word" overflowWrap="break-word">
                      {doc.descripcionLegal}
                    </Text>
                    {doc.obligatorio && (
                      <Badge colorScheme="blue" variant="subtle" size="sm" mt={1}>Obligatorio</Badge>
                    )}
                  </VStack>
                </Td>
                <Td whiteSpace="normal"><DocumentStatusBadge estado={doc.estado} /></Td>
                <Td whiteSpace="normal" wordBreak="break-word" fontSize="xs">
                  {doc.archivoNombre ? (
                    <Box>
                      <Text fontWeight="medium" noOfLines={1}>{doc.archivoNombre}</Text>
                      <Text color="gray.600" noOfLines={1}>
                        {doc.usuario} · {doc.ultimaActualizacion
                          ? new Date(doc.ultimaActualizacion).toLocaleString('es-PE')
                          : ''}
                      </Text>
                    </Box>
                  ) : (
                    <Text color="gray.500">Sin archivo cargado</Text>
                  )}
                </Td>
                <Td whiteSpace="normal">
                  <ButtonGroup size="xs" variant="outline" orientation="vertical" spacing={1} alignItems="stretch">
                    <Button onClick={() => onCargarMock(doc)}>Simular carga PDF</Button>
                    <Button variant="ghost" onClick={() => onCambiarEstado(doc, 'OBSERVADO')}>
                      Marcar como observado
                    </Button>
                    <Button variant="ghost" onClick={() => onCambiarEstado(doc, 'APROBADO')}>
                      Marcar como aprobado
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}

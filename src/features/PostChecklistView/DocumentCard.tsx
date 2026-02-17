import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Button,
  ButtonGroup,
  Wrap,
} from '@chakra-ui/react'
import type { Document, DocumentState } from '../../domain/documents/types'
import { DOCUMENT_TYPE_LABEL } from '../../domain/documents/models'

const STATE_LABEL: Record<DocumentState, string> = {
  encontrado: 'Encontrado',
  no_encontrado: 'No encontrado',
  coinicidencia_parcial: 'Coincidencia parcial',
  requiere_aclaracion: 'Requiere aclaración',
}

const STATE_COLOR: Record<DocumentState, string> = {
  encontrado: 'green',
  no_encontrado: 'gray',
  coinicidencia_parcial: 'yellow',
  requiere_aclaracion: 'orange',
}

interface DocumentCardProps {
  document: Document
  onVerEvidencia: (doc: Document) => void
  onMarcarRevisado: (doc: Document) => void
  onSolicitarInfo: (doc: Document) => void
  onComentar: (doc: Document) => void
  onEscalar: (doc: Document) => void
}

export function DocumentCard({
  document: doc,
  onVerEvidencia,
  onMarcarRevisado,
  onSolicitarInfo,
  onComentar,
  onEscalar,
}: DocumentCardProps) {
  const title = DOCUMENT_TYPE_LABEL[doc.type] ?? doc.type

  return (
    <Box
      bg="white"
      borderRadius="md"
      borderWidth="1px"
      shadow="sm"
      p={4}
      position="relative"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="flex-start" mb={2}>
        <HStack flex={1} minW={0}>
          <Box
            as="span"
            fontSize="lg"
            aria-hidden
            title={doc.automatizable ? 'Búsqueda automática' : 'Búsqueda manual'}
          >
            {doc.automatizable ? '☁' : '✎'}
          </Box>
          <Heading size="sm" noOfLines={2}>{title}</Heading>
        </HStack>
        <Badge colorScheme={STATE_COLOR[doc.state]} variant="subtle" flexShrink={0}>
          {STATE_LABEL[doc.state]}
        </Badge>
      </HStack>
      <Text fontSize="xs" color="gray.500" mb={2}>
        {new Date(doc.timestamp).toLocaleString('es-PE')}
      </Text>
      <Text fontSize="sm" color="gray.700" mb={2} noOfLines={2}>
        {doc.shortReason}
      </Text>
      {doc.requiredBy.length > 0 && (
        <Text fontSize="xs" color="gray.500" mb={2}>
          {doc.requiredBy.join(' · ')}
        </Text>
      )}
      {doc.confidenceScore > 0 && (
        <Text fontSize="xs" mb={2}>Confianza: {doc.confidenceScore}%</Text>
      )}
      {doc.evidenceUrls.length > 0 && (
        <Text fontSize="xs" color="blue.600" mb={2}>
          {doc.evidenceUrls.length} evidencia(s)
        </Text>
      )}
      <Wrap spacing={2} mt={3}>
        <ButtonGroup size="xs" variant="outline" spacing={1} flexWrap="wrap">
          <Button onClick={() => onVerEvidencia(doc)}>Ver evidencia</Button>
          <Button onClick={() => onMarcarRevisado(doc)}>Marcar revisado</Button>
          <Button onClick={() => onSolicitarInfo(doc)}>Solicitar info</Button>
          <Button onClick={() => onComentar(doc)}>Comentar</Button>
          <Button onClick={() => onEscalar(doc)}>Escalar</Button>
        </ButtonGroup>
      </Wrap>
    </Box>
  )
}

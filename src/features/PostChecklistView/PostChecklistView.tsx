import { useState, useCallback } from 'react'
import {
  Box,
  Heading,
  Text,
  Grid,
  VStack,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import type { Document } from '../../domain/documents/types'
import type { LegalReviewTicket } from '../../domain/tickets/types'
import { DocumentCard } from './DocumentCard'
import { EvidenceDrawer } from './EvidenceDrawer'
import { TicketsDrawer } from './TicketsDrawer'

interface PostChecklistViewProps {
  foundAutomatically: Document[]
  requireLegalAnalysis: Document[]
  profileId: string
  onContinue: () => void
}

function createMockTicket(doc: Document): LegalReviewTicket {
  return {
    ticketId: `TKT-${Date.now()}-${doc.id.slice(0, 8)}`,
    documentId: doc.id,
    reason: doc.shortReason || 'Revisión requerida por coincidencia parcial o evidencia insuficiente.',
    priority: doc.state === 'requiere_aclaracion' ? 'alta' : 'media',
    assignedTeam: 'Cumplimiento',
    createdAt: new Date().toISOString(),
    status: 'abierto',
    suggestedResponse: 'Respuesta sugerida por ComplianceAssistant (editable). Res. SBS N° 789-2018.',
  }
}

export function PostChecklistView({
  foundAutomatically,
  requireLegalAnalysis,
  profileId: _profileId,
  onContinue,
}: PostChecklistViewProps) {
  void _profileId
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<LegalReviewTicket | null>(null)
  const evidenceDrawer = useDisclosure()
  const ticketsDrawer = useDisclosure()
  const toast = useToast()

  const handleVerEvidencia = useCallback((doc: Document) => {
    setSelectedDoc(doc)
    evidenceDrawer.onOpen()
  }, [evidenceDrawer])

  const handleMarcarRevisado = useCallback((_doc: Document) => {
    toast({ title: 'Marcado como revisado (mock)', status: 'success', duration: 2000 })
  }, [toast])

  const handleSolicitarInfo = useCallback((_doc: Document) => {
    toast({ title: 'Solicitud de información registrada (mock)', status: 'info', duration: 2000 })
  }, [toast])

  const handleComentar = useCallback((_doc: Document) => {
    toast({ title: 'Comentario (mock)', status: 'info', duration: 2000 })
  }, [toast])

  const handleEscalar = useCallback((doc: Document) => {
    const ticket = createMockTicket(doc)
    setSelectedTicket(ticket)
    ticketsDrawer.onOpen()
  }, [ticketsDrawer])

  const handleGenerarTicket = useCallback((doc: Document) => {
    const ticket = createMockTicket(doc)
    setSelectedTicket(ticket)
    evidenceDrawer.onClose()
    ticketsDrawer.onOpen()
  }, [ticketsDrawer, evidenceDrawer])

  const handleSaveTicket = useCallback(
    (updated: LegalReviewTicket) => {
      setSelectedTicket(updated)
      ticketsDrawer.onClose()
      toast({ title: 'Ticket guardado (simulado)', status: 'success', duration: 2000 })
    },
    [ticketsDrawer, toast],
  )

  return (
    <Box maxW="1400px" mx="auto" py={4} px={4}>
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={6}
        alignSelf="stretch"
      >
        <Box>
          <Heading size="sm" mb={2} color="gray.800">
            Documentos encontrados automáticamente
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Evidencia recuperada por fuentes automatizadas.
          </Text>
          <VStack align="stretch" spacing={4}>
            {foundAutomatically.length === 0 ? (
              <Text fontSize="sm" color="gray.500">Ningún documento encontrado automáticamente en esta búsqueda (mock).</Text>
            ) : (
              foundAutomatically.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onVerEvidencia={handleVerEvidencia}
                  onMarcarRevisado={handleMarcarRevisado}
                  onSolicitarInfo={handleSolicitarInfo}
                  onComentar={handleComentar}
                  onEscalar={handleEscalar}
                />
              ))
            )}
          </VStack>
        </Box>

        <Box>
          <Heading size="sm" mb={2} color="gray.800">
            Documentos que requieren análisis legal
          </Heading>
          <Text fontSize="sm" color="gray.600" mb={4}>
            No encontrados, coincidencias parciales o evidencia insuficiente.
          </Text>
          <VStack align="stretch" spacing={4}>
            {requireLegalAnalysis.length === 0 ? (
              <Text fontSize="sm" color="gray.500">Ningún documento pendiente de análisis (mock).</Text>
            ) : (
              requireLegalAnalysis.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onVerEvidencia={handleVerEvidencia}
                  onMarcarRevisado={handleMarcarRevisado}
                  onSolicitarInfo={handleSolicitarInfo}
                  onComentar={handleComentar}
                  onEscalar={handleEscalar}
                />
              ))
            )}
          </VStack>
        </Box>
      </Grid>

      <Box mt={8} display="flex" justifyContent="space-between" alignItems="center">
        <Button size="sm" variant="outline" colorScheme="blue">
          Exportar evidencia (ZIP/PDF mock)
        </Button>
        <Button size="lg" colorScheme="brand" onClick={onContinue}>
          Continuar a Matriz de Riesgo
        </Button>
      </Box>

      <EvidenceDrawer
        isOpen={evidenceDrawer.isOpen}
        onClose={evidenceDrawer.onClose}
        document={selectedDoc}
        onGenerarTicket={handleGenerarTicket}
      />
      <TicketsDrawer
        isOpen={ticketsDrawer.isOpen}
        onClose={ticketsDrawer.onClose}
        ticket={selectedTicket}
        onSave={handleSaveTicket}
      />
    </Box>
  )
}

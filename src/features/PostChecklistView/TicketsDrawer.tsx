import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react'
import type { LegalReviewTicket, TicketPriority } from '../../domain/tickets/types'

interface TicketsDrawerProps {
  isOpen: boolean
  onClose: () => void
  ticket: LegalReviewTicket | null
  onSave?: (ticket: LegalReviewTicket) => void
}

export function TicketsDrawer({ isOpen, onClose, ticket, onSave }: TicketsDrawerProps) {
  const [priority, setPriority] = useState<TicketPriority>('media')
  const [assignedTeam, setAssignedTeam] = useState('')
  const [suggestedResponse, setSuggestedResponse] = useState('')

  useEffect(() => {
    if (ticket) {
      setPriority(ticket.priority)
      setAssignedTeam(ticket.assignedTeam ?? '')
      setSuggestedResponse(ticket.suggestedResponse ?? '')
    }
  }, [ticket, isOpen])

  if (!ticket) return null

  const handleSave = () => {
    const updated: LegalReviewTicket = {
      ...ticket,
      priority,
      assignedTeam,
      suggestedResponse: suggestedResponse || undefined,
    }
    onSave?.(updated)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ticket de revisión legal</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">ID Ticket</FormLabel>
              <Input size="sm" value={ticket.ticketId} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Documento</FormLabel>
              <Input size="sm" value={ticket.documentId} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Motivo</FormLabel>
              <Textarea size="sm" value={ticket.reason} isReadOnly rows={3} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Prioridad</FormLabel>
              <Select size="sm" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Equipo asignado</FormLabel>
              <Input size="sm" value={assignedTeam} onChange={(e) => setAssignedTeam(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Respuesta sugerida (ComplianceAssistant)</FormLabel>
              <Textarea
                size="sm"
                value={suggestedResponse}
                onChange={(e) => setSuggestedResponse(e.target.value)}
                rows={4}
                placeholder="Editar plantilla..."
              />
            </FormControl>
            <Text fontSize="xs" color="gray.500">Información simulada — No sustituye asesoría legal.</Text>
            <Button size="sm" colorScheme="blue" onClick={handleSave}>
              Guardar y cerrar
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

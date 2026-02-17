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
import type { LegalReviewTicket } from '../../domain/tickets/types'

interface TicketsDrawerProps {
  isOpen: boolean
  onClose: () => void
  ticket: LegalReviewTicket | null
  onSave?: (ticket: LegalReviewTicket) => void
}

export function TicketsDrawer({ isOpen, onClose, ticket, onSave }: TicketsDrawerProps) {
  if (!ticket) return null
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
              <Select size="sm" defaultValue={ticket.priority}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Equipo asignado</FormLabel>
              <Input size="sm" defaultValue={ticket.assignedTeam} />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Respuesta sugerida (ComplianceAssistant)</FormLabel>
              <Textarea size="sm" defaultValue={ticket.suggestedResponse} rows={4} placeholder="Editar plantilla..." />
            </FormControl>
            <Text fontSize="xs" color="gray.500">Información simulada — No sustituye asesoría legal.</Text>
            {onSave && (
              <Button size="sm" colorScheme="blue" onClick={() => onSave(ticket)}>
                Guardar y cerrar
              </Button>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

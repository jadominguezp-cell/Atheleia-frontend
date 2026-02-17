import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Text, VStack, Button } from '@chakra-ui/react'
import type { Document } from '../../domain/documents/types'

interface EvidenceDrawerProps {
  isOpen: boolean
  onClose: () => void
  document: Document | null
  onGenerarTicket?: (doc: Document) => void
}

export function EvidenceDrawer({ isOpen, onClose, document: doc, onGenerarTicket }: EvidenceDrawerProps) {
  if (!doc) return null
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Evidencia</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color="gray.600">{doc.shortReason}</Text>
            {doc.evidenceUrls.length > 0 ? (
              doc.evidenceUrls.map((url, i) => (
                <Text key={i} as="a" href={url} color="blue.600" fontSize="sm" target="_blank" rel="noopener">{url}</Text>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">Sin evidencia (mock).</Text>
            )}
            {onGenerarTicket && (
              <Button size="sm" colorScheme="blue" onClick={() => { onGenerarTicket(doc); onClose(); }}>Generar ticket</Button>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  List,
  ListItem,
  Button,
} from '@chakra-ui/react'
import { DOCUMENTOS_REVEAL } from '../../types/documentoReveal'

interface DocumentChecklistRevealProps {
  onContinue?: () => void
}

export function DocumentChecklistReveal({ onContinue }: DocumentChecklistRevealProps) {
  return (
    <Box maxW="720px" mx="auto" mt={{ base: 6, md: 10 }} mb={10}>
      <Heading size="md" mb={2} color="gray.800">
        Checklist de documentos
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Documentos que Aletheia puede revelar. Se indica cuáles admiten búsqueda automática en web y cuáles requieren búsqueda manual.
      </Text>
      <Box bg="white" borderRadius="lg" borderWidth="1px" shadow="sm" overflow="hidden">
        <List spacing={0}>
          {DOCUMENTOS_REVEAL.map((doc) => (
            <ListItem
              key={doc.id}
              borderBottomWidth="1px"
              borderColor="gray.100"
              _last={{ borderBottom: 'none' }}
              py={4}
              px={5}
            >
              <HStack justify="space-between" align="center" wrap="wrap" gap={3}>
                <HStack flex={1} minW={0}>
                  <Box as="span" color="green.500" fontSize="lg" flexShrink={0} aria-hidden>✓</Box>
                  <Text fontWeight="medium" wordBreak="break-word">
                    {doc.nombre}
                  </Text>
                </HStack>
                <Badge
                  colorScheme={doc.automatizable ? 'green' : 'orange'}
                  variant="subtle"
                  flexShrink={0}
                >
                  {doc.automatizable ? 'Búsqueda automática' : 'Búsqueda manual'}
                </Badge>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Box>
      {onContinue && (
        <Button mt={6} colorScheme="blue" size="lg" w="full" onClick={onContinue}>
          Ver resultados de búsqueda
        </Button>
      )}
    </Box>
  )
}

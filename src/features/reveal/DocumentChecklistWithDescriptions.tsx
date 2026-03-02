import {
  Box,
  Heading,
  Text,
  List,
  ListItem,
  HStack,
  Badge,
  Checkbox,
  VStack,
} from '@chakra-ui/react'
import { AnimatedButton } from '../../components/AnimatedButton'
import { DOCUMENTOS_REVEAL } from '../../types/documentoReveal'

interface DocumentChecklistWithDescriptionsProps {
  onContinue?: () => void
}

const automaticos = DOCUMENTOS_REVEAL.filter((d) => d.automatizable)
const manuales = DOCUMENTOS_REVEAL.filter((d) => !d.automatizable)

function DocItem({
  doc,
  bg,
  iconLabel,
}: {
  doc: (typeof DOCUMENTOS_REVEAL)[0]
  bg: string
  iconLabel: string
}) {
  return (
    <ListItem
      borderBottomWidth="1px"
      borderColor="gray.100"
      _last={{ borderBottom: 'none' }}
      py={4}
      px={5}
      bg={bg}
    >
      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between" align="flex-start">
          <HStack flex={1} minW={0}>
            <Checkbox size="md" colorScheme="blue" />
            <Text fontWeight="600" textTransform="uppercase" fontSize="sm" wordBreak="break-word">
              {doc.nombre}
            </Text>
          </HStack>
          <Badge colorScheme={doc.automatizable ? 'green' : 'orange'} variant="subtle" flexShrink={0}>
            {iconLabel}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="gray.600" pl={8}>
          {doc.descripcion}
        </Text>
      </VStack>
    </ListItem>
  )
}

export function DocumentChecklistWithDescriptions({ onContinue }: DocumentChecklistWithDescriptionsProps) {
  return (
    <Box maxW="800px" mx="auto" mt={{ base: 6, md: 10 }} mb={10}>
      <Heading size="md" mb={2} color="gray.800">
        Checklist documental
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Documentos requeridos conforme normativa SPLAFT. Descripción obligatoria por ítem.
      </Text>

      <Heading size="sm" mb={2} color="gray.700">
        A) Búsqueda automática (web)
      </Heading>
      <Box bg="gray.50" borderRadius="lg" borderWidth="1px" overflow="hidden" mb={6}>
        <List spacing={0}>
          {automaticos.map((doc) => (
            <DocItem key={doc.id} doc={doc} bg="gray.50" iconLabel="Resultado automático" />
          ))}
        </List>
      </Box>

      <Heading size="sm" mb={2} color="gray.700">
        B) Búsqueda que requiere verificación manual
      </Heading>
      <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" overflow="hidden" mb={6}>
        <List spacing={0}>
          {manuales.map((doc) => (
            <DocItem key={doc.id} doc={doc} bg="white" iconLabel="Requiere análisis legal" />
          ))}
        </List>
      </Box>

      {onContinue && (
        <AnimatedButton colorScheme="blue" size="lg" w="full" onClick={onContinue}>
          Ver resultados de búsqueda
        </AnimatedButton>
      )}
    </Box>
  )
}

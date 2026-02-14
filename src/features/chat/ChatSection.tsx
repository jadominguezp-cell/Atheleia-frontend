import { Box, Heading, Text, Textarea, Button, VStack, HStack, Grid } from '@chakra-ui/react'
import { useChat } from '../../hooks'
import type { MensajeChat } from '../../types'

const SUGERENCIAS = [
  '¿Cuáles son las principales diferencias de requisitos SPLAF entre clientes nacionales y extranjeros?',
  '¿Por qué es obligatoria la declaración de beneficiario final en el marco de la Resolución SBS N.° 789-2018?',
  '¿Cuál es el objetivo de la certificación de origen lícito de fondos en la debida diligencia?',
]

function ChatMessage({ msg }: { msg: MensajeChat }) {
  const isUser = msg.remitente === 'USUARIO'
  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      maxW="90%"
      bg={isUser ? 'blue.500' : 'gray.200'}
      color={isUser ? 'white' : 'gray.800'}
      px={3} py={2}
      borderRadius="md"
    >
      <HStack fontSize="xs" color={isUser ? 'blue.100' : 'gray.500'} mb={1}>
        <span>{isUser ? 'Usted' : 'Asistente SPLAF'}</span>
        <span>
          {new Date(msg.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </HStack>
      <Text fontSize="sm">{msg.texto}</Text>
    </Box>
  )
}

export function ChatSection() {
  const { mensajes, pregunta, setPregunta, enviar } = useChat()

  return (
    <Box bg="white" p={6} borderRadius="md" borderWidth="1px" shadow="sm">
      <Heading size="sm" mb={1}>Chatbot legal interno</Heading>
      <Text fontSize="sm" color="gray.600" mb={2}>
        Asistente interno para orientación general sobre requisitos SPLAF, diferencias entre clientes nacionales y extranjeros y justificación legal de los documentos solicitados.
      </Text>
      <Text fontSize="xs" color="gray.500" mb={4}>
        La información proporcionada es referencial y no sustituye una asesoría legal personalizada.
      </Text>

      <Grid templateColumns={{ base: '1fr', lg: '1.8fr 1.1fr' }} gap={4}>
        <Box>
          <VStack
            align="stretch"
            spacing={3}
            bg="gray.50"
            p={3}
            borderRadius="md"
            maxH="280px"
            overflowY="auto"
          >
            {mensajes.map((m) => (
              <ChatMessage key={m.id} msg={m} />
            ))}
          </VStack>
          <Textarea
            size="sm"
            mt={3}
            rows={3}
            placeholder="Formule aquí su consulta general sobre requisitos SPLAF..."
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
          />
          <Button size="sm" colorScheme="blue" mt={2} onClick={enviar}>
            Enviar consulta
          </Button>
        </Box>
        <Box borderWidth="1px" borderStyle="dashed" borderRadius="md" p={3} bg="gray.50">
          <Heading size="xs" mb={2}>Preguntas sugeridas</Heading>
          <VStack align="stretch" spacing={2}>
            {SUGERENCIAS.map((s, i) => (
              <Button
                key={i}
                size="sm"
                variant="ghost"
                textAlign="left"
                whiteSpace="normal"
                height="auto"
                py={2}
                onClick={() => setPregunta(s)}
              >
                {s.length > 50 ? s.slice(0, 50) + '…' : s}
              </Button>
            ))}
          </VStack>
        </Box>
      </Grid>
    </Box>
  )
}

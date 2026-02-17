import { useRef } from 'react'
import { Box, Heading, Text, Textarea, Button } from '@chakra-ui/react'

interface AssistantPanelProps {
  context?: string
  suggestedResponse?: string
  onConfirm?: (text: string) => void
}

export function AssistantPanel({ context, suggestedResponse, onConfirm }: AssistantPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleConfirm = () => {
    if (!onConfirm) return
    const value = textareaRef.current?.value ?? suggestedResponse ?? ''
    onConfirm(value)
  }

  return (
    <Box bg="white" borderRadius="md" borderWidth="1px" p={4} shadow="sm">
      <Heading size="xs" mb={2}>ComplianceAssistant</Heading>
      <Text fontSize="sm" color="gray.600" mb={3}>
        Respuesta regulatoria sugerida (p. ej. preguntas 8–13). Res. SBS N° 789-2018. Editable para adjuntar al ticket o exportar al cuestionario.
      </Text>
      {context && (
        <Text fontSize="xs" color="gray.500" mb={2}>Contexto: {context}</Text>
      )}
      <Textarea
        ref={textareaRef}
        size="sm"
        rows={4}
        placeholder="Plantilla de respuesta con evidencia..."
        defaultValue={suggestedResponse}
      />
      {onConfirm && (
        <Button size="xs" mt={2} colorScheme="blue" onClick={handleConfirm}>
          Confirmar y adjuntar
        </Button>
      )}
      <Text fontSize="xs" color="gray.400" mt={2}>Información simulada — No sustituye asesoría legal.</Text>
    </Box>
  )
}

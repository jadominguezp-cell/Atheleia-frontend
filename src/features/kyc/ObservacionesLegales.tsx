import { Box, Heading, Text, Textarea, Button } from '@chakra-ui/react'

interface ObservacionesLegalesProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export function ObservacionesLegales({ value, onChange, onSave }: ObservacionesLegalesProps) {
  return (
    <Box minW="280px" maxW="100%" overflow="hidden">
      <Heading size="sm" mb={1}>Observaciones legales</Heading>
      <Text fontSize="xs" color="gray.600" mb={3} wordBreak="break-word">
        Espacio para consignar observaciones del área legal o de cumplimiento.
      </Text>
      <Textarea
        size="sm"
        rows={10}
        minH="200px"
        w="100%"
        maxW="100%"
        resize="vertical"
        placeholder="Ejemplo: Solicitar documentación adicional sobre origen de fondos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
      />
      <Button size="sm" colorScheme="blue" mt={2} onClick={onSave}>
        Guardar observaciones
      </Button>
    </Box>
  )
}

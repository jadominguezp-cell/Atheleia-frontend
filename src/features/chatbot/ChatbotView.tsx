import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Input,
  HStack,
  List,
  ListItem,
  Badge,
} from '@chakra-ui/react'
import { AnimatedButton } from '../../components/AnimatedButton'
import { processCountryResponse, type ChatbotResponse } from './chatbotService'

const MENSAJE_INICIAL = 'Indique el país de la empresa extranjera con la que planea operar.'

export function ChatbotView() {
  const [mensajes, setMensajes] = useState<Array<{ tipo: 'sistema' | 'usuario'; texto: string }>>([
    { tipo: 'sistema', texto: MENSAJE_INICIAL },
  ])
  const [input, setInput] = useState('')
  const [respuesta, setRespuesta] = useState<ChatbotResponse | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviar = () => {
    const texto = input.trim()
    if (!texto) return
    setMensajes((prev) => [...prev, { tipo: 'usuario', texto }])
    setInput('')
    const res = processCountryResponse(texto)
    setRespuesta(res)
    setMensajes((prev) => [
      ...prev,
      { tipo: 'sistema', texto: res.confirmacionPais },
      { tipo: 'sistema', texto: `Documentos mínimos sugeridos: ${res.documentosSugeridos.join('; ')}.` },
      {
        tipo: 'sistema',
        texto: res.paisAltoRiesgo
          ? 'El país indicado es considerado de alto riesgo (simulado). Se recomienda debida diligencia reforzada.'
          : 'El país no figura actualmente como de alto riesgo en esta simulación.',
      },
      { tipo: 'sistema', texto: res.recomendacionDebidaDiligencia },
    ])
  }

  return (
    <Box maxW="720px" mx="auto" py={8} px={4}>
      <Heading size="md" mb={2} color="gray.800">
        Aletheia International Compliance Assistant
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Orientación documental preliminar para operaciones con contrapartes extranjeras.
      </Text>

      <Box bg="white" borderRadius="lg" borderWidth="1px" shadow="sm" overflow="hidden">
        <Box p={4} maxH="400px" overflowY="auto">
          {mensajes.map((m, i) => (
            <Box
              key={i}
              alignSelf={m.tipo === 'usuario' ? 'flex-end' : 'flex-start'}
              bg={m.tipo === 'usuario' ? 'blue.50' : 'gray.50'}
              p={3}
              borderRadius="md"
              mb={2}
              ml={m.tipo === 'sistema' ? 0 : 'auto'}
              mr={m.tipo === 'usuario' ? 0 : 'auto'}
              maxW="90%"
            >
              <Text fontSize="sm">{m.texto}</Text>
            </Box>
          ))}
          <div ref={bottomRef} />
        </Box>
        <Box p={4} borderTopWidth="1px">
          <HStack>
            <Input
              placeholder="Escriba el país..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
            />
            <AnimatedButton colorScheme="blue" onClick={enviar}>
              Enviar
            </AnimatedButton>
          </HStack>
        </Box>
      </Box>

      {respuesta && (
        <Box mt={6} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
          <Heading size="xs" mb={2}>Resumen de orientación</Heading>
          {respuesta.paisAltoRiesgo && (
            <Badge colorScheme="red" mb={2}>País de alto riesgo (simulado)</Badge>
          )}
          <Text fontSize="sm" fontWeight="600" mb={1}>Documentos mínimos a solicitar:</Text>
          <List listStyleType="disc" pl={5} spacing={1} fontSize="sm">
            {respuesta.documentosSugeridos.map((d, i) => (
              <ListItem key={i}>{d}</ListItem>
            ))}
          </List>
          <Text fontSize="xs" color="gray.500" mt={3}>
            La presente herramienta no sustituye asesoría legal especializada.
          </Text>
        </Box>
      )}
    </Box>
  )
}

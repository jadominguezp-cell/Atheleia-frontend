import { useCallback, useState } from 'react'
import { responderPreguntaSplaf } from '../services/chatService'
import type { MensajeChat } from '../types'

const MENSAJE_INICIAL: MensajeChat = {
  id: 'intro',
  remitente: 'SISTEMA',
  texto:
    'Bienvenido al asistente legal interno para SPLAFT. Puede hacer preguntas sobre requisitos de identificación, diferencias entre clientes nacionales y extranjeros, y motivos legales de cada documento.',
  timestamp: new Date().toISOString(),
}

export function useChat() {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([MENSAJE_INICIAL])
  const [pregunta, setPregunta] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const enviar = useCallback(() => {
    if (isLoading) return
    const texto = pregunta.trim()
    if (!texto) return

    setIsLoading(true)
    const ahora = new Date().toISOString()
    const msgUsuario: MensajeChat = { id: `u-${ahora}`, remitente: 'USUARIO', texto, timestamp: ahora }
    setMensajes((prev) => [...prev, msgUsuario])
    setPregunta('')

    // Simulate network delay for AI response
    setTimeout(() => {
      const respuesta = responderPreguntaSplaf(texto)
      const msgSistema: MensajeChat = {
        id: `s-${new Date().toISOString()}`,
        remitente: 'SISTEMA',
        texto: respuesta,
        timestamp: new Date().toISOString(),
      }
      setMensajes((prev) => [...prev, msgSistema])
      setIsLoading(false)
    }, 800)

  }, [pregunta, isLoading])

  return { mensajes, pregunta, setPregunta, enviar, isLoading }
}

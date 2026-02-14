import { useCallback, useState } from 'react'
import { responderPreguntaSplaf } from '../services/chatService'
import type { MensajeChat } from '../types'

const MENSAJE_INICIAL: MensajeChat = {
  id: 'intro',
  remitente: 'SISTEMA',
  texto:
    'Bienvenido al asistente legal interno para SPLAF. Puede hacer preguntas sobre requisitos de identificación, diferencias entre clientes nacionales y extranjeros, y motivos legales de cada documento.',
  timestamp: new Date().toISOString(),
}

export function useChat() {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([MENSAJE_INICIAL])
  const [pregunta, setPregunta] = useState('')

  const enviar = useCallback(() => {
    const texto = pregunta.trim()
    if (!texto) return
    const ahora = new Date().toISOString()
    const msgUsuario: MensajeChat = { id: `u-${ahora}`, remitente: 'USUARIO', texto, timestamp: ahora }
    const respuesta = responderPreguntaSplaf(texto)
    const msgSistema: MensajeChat = {
      id: `s-${ahora}`,
      remitente: 'SISTEMA',
      texto: respuesta,
      timestamp: new Date().toISOString(),
    }
    setMensajes((prev) => [...prev, msgUsuario, msgSistema])
    setPregunta('')
  }, [pregunta])

  return { mensajes, pregunta, setPregunta, enviar }
}

/** Mensaje del chatbot legal (Single Responsibility) */
export interface MensajeChat {
  id: string
  remitente: 'USUARIO' | 'SISTEMA'
  texto: string
  timestamp: string
}

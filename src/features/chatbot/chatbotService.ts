/** Respuestas estructuradas del chatbot para empresa extranjera (mock). */
const PAISES_ALTO_RIESGO_MOCK = ['Venezuela', 'Myanmar', 'Corea del Norte', 'Irán']

const DOCUMENTOS_SUGERIDOS = [
  'Certificado de constitución',
  'Certificado de vigencia',
  'Identificación de beneficiarios finales',
  'Estados financieros recientes',
  'Certificación de cumplimiento AML local',
  'Documento equivalente a registro tributario',
]

export interface ChatbotResponse {
  confirmacionPais: string
  documentosSugeridos: string[]
  paisAltoRiesgo: boolean
  recomendacionDebidaDiligencia: string
}

export function processCountryResponse(pais: string): ChatbotResponse {
  const paisNorm = pais.trim()
  const altoRiesgo = PAISES_ALTO_RIESGO_MOCK.some((p) => paisNorm.toLowerCase().includes(p.toLowerCase()))
  return {
    confirmacionPais: `Se ha registrado la operación con contraparte en: ${paisNorm}.`,
    documentosSugeridos: DOCUMENTOS_SUGERIDOS,
    paisAltoRiesgo: altoRiesgo,
    recomendacionDebidaDiligencia: altoRiesgo
      ? 'Se recomienda aplicar debida diligencia reforzada conforme normativa SPLAFT (Res. SBS N° 789-2018) y documentar las medidas adicionales adoptadas.'
      : 'Conforme al perfil de la contraparte, se sugiere solicitar los documentos mínimos indicados y validar vigencia en origen.',
  }
}

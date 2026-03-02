/** Respuestas del asistente SPLAFT (Single Responsibility, extensible) */
export function responderPreguntaSplaf(pregunta: string): string {
  const p = pregunta.toLowerCase()

  if (p.includes('nacional') || p.includes('extranjero')) {
    return (
      'En el marco de la Resolución SBS N.° 789-2018, los clientes extranjeros suelen requerir un nivel ' +
      'de diligencia reforzada, incluyendo certificados de incorporación, good standing y, en su caso, ' +
      'traducciones oficiales. Los clientes nacionales se rigen por los documentos corporativos locales ' +
      'y registros públicos peruanos.'
    )
  }
  if (p.includes('beneficiario') || p.includes('final')) {
    return (
      'La declaración de beneficiario final es obligatoria para identificar a la persona natural que ' +
      'ejerce el control efectivo o la propiedad real de la empresa. Es un elemento central de las políticas ' +
      'de conocimiento del cliente (KYC) exigidas por la normativa SPLAFT.'
    )
  }
  if (p.includes('origen') && p.includes('fond')) {
    return (
      'La certificación de origen lícito de fondos documenta que los recursos involucrados provienen de ' +
      'actividades legales. Permite mitigar el riesgo de que la operación sea utilizada para encubrir ' +
      'operaciones de lavado de activos o financiamiento del terrorismo.'
    )
  }
  if (p.includes('listas') || p.includes('restrictiv') || p.includes('sancion')) {
    return (
      'La constancia de no estar en listas restrictivas respalda que el cliente, sus representantes y ' +
      'beneficiarios finales no se encuentran incluidos en listas de sanciones nacionales o internacionales, ' +
      'lo cual reduce el riesgo legal y reputacional.'
    )
  }
  if (p.includes('requisito') || p.includes('document') || p.includes('checklist')) {
    return (
      'El checklist de documentos de identificación se construye en función del tipo de cliente, tipo de ' +
      'operación, monto y nivel de riesgo. Incluye, como mínimo, escritura de constitución, vigencia de ' +
      'poderes, estados financieros, beneficiario final, origen de fondos y verificación en listas restrictivas.'
    )
  }
  return (
    'Esta herramienta brinda información referencial sobre requisitos de identificación, verificación y ' +
    'gestión de riesgo bajo la normativa SPLAFT. Para un análisis concreto de un caso específico, se recomienda ' +
    'contar siempre con asesoría legal personalizada.'
  )
}

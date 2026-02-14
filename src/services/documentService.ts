import type { EstadoDocumento } from '../types/documento'

/** Etiquetas de estado de documento (Single Responsibility) */
export function estadoDocumentoALabel(estado: EstadoDocumento): string {
  switch (estado) {
    case 'NO_CARGADO':
      return 'No cargado'
    case 'CARGADO':
      return 'Cargado'
    case 'OBSERVADO':
      return 'Observado'
    case 'APROBADO':
      return 'Aprobado'
    default:
      return estado
  }
}

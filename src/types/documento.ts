/** Estados de un documento en el checklist (Single Responsibility) */
export type EstadoDocumento = 'NO_CARGADO' | 'CARGADO' | 'OBSERVADO' | 'APROBADO'

export interface DocumentoRequerido {
  id: string
  nombre: string
  descripcionLegal: string
  obligatorio: boolean
  estado: EstadoDocumento
  archivoNombre?: string
  ultimaActualizacion?: string
  usuario?: string
  observaciones?: string
}

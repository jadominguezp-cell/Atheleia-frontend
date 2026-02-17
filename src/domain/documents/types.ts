/** Fuentes externas / sourceId en metadatos (spec) */
export const SOURCE_IDS = [
  'RENIEC',
  'SUNAT',
  'Migraciones',
  'InfoGov',
  'EsSalud',
  'SUNARP',
  'UIF',
  'ONU',
] as const
export type SourceId = (typeof SOURCE_IDS)[number]

export type DocumentType =
  | 'consulta_reniec'
  | 'consulta_sunat'
  | 'consulta_migraciones'
  | 'consulta_infogob'
  | 'consulta_essalud'
  | 'consulta_centrales_riesgo'
  | 'consulta_sunarp'
  | 'solicitud_ficha_ruc'

export type DocumentState =
  | 'encontrado'
  | 'no_encontrado'
  | 'coinicidencia_parcial'
  | 'requiere_aclaracion'

export type ReviewStatus = 'pendiente' | 'en_revision' | 'revisado'

export interface Document {
  id: string
  type: DocumentType
  sourceId: SourceId
  found: boolean
  state: DocumentState
  confidenceScore: number
  requiredBy: string[]
  shortReason: string
  evidenceUrls: string[]
  timestamp: string
  reviewStatus: ReviewStatus
  assignedTo?: string
  relatedScreeningId?: string
  /** true = recuperado automáticamente; false = requiere búsqueda/manual */
  automatizable: boolean
}

import type { DocumentType } from '../../domain/documents/types'
import { createDocumentStub } from '../../domain/documents/models'
import { generateReason } from '../../application/services/DocumentReasonService'
import type { DocumentResult } from '../../application/services/DocumentFetchService'
import type { OperationContext } from '../../application/services/DocumentReasonService'

const TYPES: DocumentType[] = [
  'consulta_reniec',
  'consulta_sunat',
  'consulta_migraciones',
  'consulta_infogob',
  'consulta_essalud',
  'consulta_centrales_riesgo',
  'consulta_sunarp',
  'solicitud_ficha_ruc',
]

const AUTOMATIZABLE: Record<DocumentType, boolean> = {
  consulta_reniec: true,
  consulta_sunat: true,
  consulta_migraciones: false,
  consulta_infogob: false,
  consulta_essalud: false,
  consulta_centrales_riesgo: false,
  consulta_sunarp: true,
  solicitud_ficha_ruc: true,
}

/** Mock: devuelve documentos con estados y shortReason generados. */
export async function fetchDocumentsByProfile(profileId: string): Promise<DocumentResult[]> {
  const results: DocumentResult[] = []
  const now = new Date().toISOString()
  const context: OperationContext = {
    profileId,
    tipo: profileId.length === 8 ? 'natural' : 'juridica',
  }

  TYPES.forEach((type, i) => {
    const automatizable = AUTOMATIZABLE[type]
    const found = automatizable && i % 3 !== 2
    const state = found ? 'encontrado' : i % 4 === 1 ? 'coinicidencia_parcial' : 'no_encontrado'
    const confidenceScore = found ? 85 + (i % 10) : state === 'coinicidencia_parcial' ? 55 : 0
    const doc = createDocumentStub(`${profileId}-${type}`, type, automatizable, {
      found,
      state,
      confidenceScore,
      shortReason: generateReason(type, context),
      timestamp: now,
      evidenceUrls: found ? [`https://mock.evidence.local/${type}/${profileId}.pdf`] : [],
    })
    results.push({ document: doc, success: true })
  })

  return results
}

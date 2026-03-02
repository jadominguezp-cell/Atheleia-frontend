import type { Document, DocumentType, SourceId } from './types'

export const DOCUMENT_TYPE_TO_SOURCE: Record<DocumentType, SourceId> = {
  consulta_reniec: 'RENIEC',
  consulta_sunat: 'SUNAT',
  consulta_migraciones: 'Migraciones',
  consulta_infogob: 'InfoGov',
  consulta_essalud: 'EsSalud',
  consulta_centrales_riesgo: 'UIF',
  consulta_sunarp: 'SUNARP',
  solicitud_ficha_ruc: 'SUNAT',
}

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  consulta_reniec: 'CONSULTA RENIEC',
  consulta_sunat: 'CONSULTA SUNAT',
  consulta_migraciones: 'CONSULTA EN LA PAGINA WEB DE MIGRACIONES',
  consulta_infogob: 'CONSULTA EN LA PAGINA WEB DE INFOGOB',
  consulta_essalud: 'CONSULTA EN LA PAGINA WEB DE ESSALUD',
  consulta_centrales_riesgo: 'CONSULTA EN CENTRALES DE RIESGOS',
  consulta_sunarp: 'CONSULTA EN SUNARP',
  solicitud_ficha_ruc: 'SOLICITUD DE FICHA RUC',
}

export function createDocumentStub(
  id: string,
  type: DocumentType,
  automatizable: boolean,
  overrides: Partial<Document> = {},
): Document {
  return {
    id,
    type,
    sourceId: DOCUMENT_TYPE_TO_SOURCE[type],
    found: false,
    state: 'no_encontrado',
    confidenceScore: 0,
    requiredBy: ['Res. SBS N° 789-2018 / SPLAFTT'],
    shortReason: '',
    evidenceUrls: [],
    timestamp: new Date().toISOString(),
    reviewStatus: 'pendiente',
    automatizable,
    ...overrides,
  }
}

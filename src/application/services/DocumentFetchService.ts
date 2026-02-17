import type { Document, DocumentType } from '../../domain/documents/types'

export interface DocumentResult {
  document: Document
  success: boolean
}

/** Contrato: obtener documento por perfil y tipo (implementación mock en infrastructure). */
export interface DocumentFetchService {
  fetchById(profileId: string, type: DocumentType): Promise<DocumentResult>
}

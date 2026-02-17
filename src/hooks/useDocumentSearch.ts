import { useState, useCallback } from 'react'
import type { Document } from '../domain/documents/types'
import { fetchDocumentsByProfile } from '../infrastructure/adapters/documentFetch.mock'

export function useDocumentSearch() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchByProfile = useCallback(async (profileId: string) => {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchDocumentsByProfile(profileId)
      setDocuments(results.map((r) => r.document))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar documentos')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [])

  const foundAutomatically = documents.filter((d) => d.found && d.automatizable)
  const requireLegalAnalysis = documents.filter(
    (d) => !d.found || !d.automatizable || d.state === 'coinicidencia_parcial' || d.state === 'requiere_aclaracion',
  )

  return {
    documents,
    foundAutomatically,
    requireLegalAnalysis,
    loading,
    error,
    searchByProfile,
  }
}

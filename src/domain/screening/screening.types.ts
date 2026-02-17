export interface Profile {
  profileId: string
  tipo: 'natural' | 'juridica'
  dni?: string
  ruc?: string
  nombre?: string
}

export interface ScreeningResult {
  profileId: string
  match: boolean
  confidenceScore: number
  listVersionId: string
  listTimestamp: string
  source: string
  details?: string
}

export interface PEPClassification {
  isPEP: boolean
  tipo?: 'nacional' | 'extranjero' | 'familiares' | 'vinculos_societarios'
  evidence?: string
}

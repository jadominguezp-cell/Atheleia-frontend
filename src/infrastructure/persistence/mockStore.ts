import type { Document } from '../../domain/documents/types'
import type { LegalReviewTicket } from '../../domain/tickets/types'

export const documentsStore: Document[] = []
export const ticketsStore: LegalReviewTicket[] = []

export const auditLog: Array<{ userId: string; action: string; timestamp: string; payloadHash?: string }> = []

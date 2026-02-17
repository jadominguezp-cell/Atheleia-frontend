import type { LegalReviewTicket } from '../../domain/tickets/types'

export interface CreateTicketParams {
  documentId: string
  reason: string
  priority: LegalReviewTicket['priority']
  assignedTeam: string
  relatedOperationId?: string
}

/** Contrato: crear y gestionar tickets de revisión legal. */
export interface LegalReviewService {
  createTicket(params: CreateTicketParams): Promise<LegalReviewTicket>
}

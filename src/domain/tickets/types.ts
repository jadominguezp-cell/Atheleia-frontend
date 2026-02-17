export type TicketPriority = 'alta' | 'media' | 'baja'
export type TicketStatus = 'abierto' | 'en_progreso' | 'cerrado'

export interface LegalReviewTicket {
  ticketId: string
  documentId: string
  reason: string
  priority: TicketPriority
  assignedTeam: string
  assignedTo?: string
  deadline?: string
  relatedOperationId?: string
  createdAt: string
  status: TicketStatus
  suggestedResponse?: string
}

import { Badge } from '@chakra-ui/react'
import { estadoDocumentoALabel } from '../../services/documentService'
import type { EstadoDocumento } from '../../types'

const COLOR: Record<EstadoDocumento, string> = {
  NO_CARGADO: 'gray',
  CARGADO: 'blue',
  OBSERVADO: 'red',
  APROBADO: 'green',
}

interface DocumentStatusBadgeProps {
  estado: EstadoDocumento
}

export function DocumentStatusBadge({ estado }: DocumentStatusBadgeProps) {
  return (
    <Badge colorScheme={COLOR[estado]} variant="subtle" borderRadius="full" px={2} py={0.5}>
      {estadoDocumentoALabel(estado)}
    </Badge>
  )
}

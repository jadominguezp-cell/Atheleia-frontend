import { Badge } from '@chakra-ui/react'
import type { EstadoCumplimiento } from '../../types'

const MAP: Record<EstadoCumplimiento, { label: string; colorScheme: string }> = {
  COMPLETO: { label: 'Completo', colorScheme: 'green' },
  PENDIENTE: { label: 'Pendiente', colorScheme: 'yellow' },
  OBSERVADO: { label: 'Observado', colorScheme: 'red' },
}

interface StatusBadgeProps {
  estado: EstadoCumplimiento
}

export function StatusBadge({ estado }: StatusBadgeProps) {
  const { label, colorScheme } = MAP[estado]
  return (
    <Badge colorScheme={colorScheme} variant="subtle" borderRadius="full" px={2} py={0.5}>
      {label}
    </Badge>
  )
}

import { Badge } from '@chakra-ui/react'
import { riesgoALabel } from '../../services/riskService'
import type { RiesgoNivel } from '../../types'

const COLOR: Record<RiesgoNivel, string> = {
  BAJO: 'green',
  MEDIO: 'yellow',
  ALTO: 'red',
}

interface RiskBadgeProps {
  nivel: RiesgoNivel
}

export function RiskBadge({ nivel }: RiskBadgeProps) {
  return (
    <Badge colorScheme={COLOR[nivel]} variant="subtle" borderRadius="full" px={2} py={0.5}>
      {riesgoALabel(nivel)}
    </Badge>
  )
}

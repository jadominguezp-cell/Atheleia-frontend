import { useState, useCallback, useMemo } from 'react'
import type { RiskEvent, NivelRiesgo } from '../domain/risk/risk.types'
import { calcularNivelRiesgo, calcularRiesgoGlobal } from '../application/services/riskCalculationService'

const INITIAL_EVENTS: Omit<RiskEvent, 'id' | 'riesgoInherente'>[] = [
  {
    codigo: 'R01',
    evento: 'Lavado de activos a través de clientes ficticios',
    causa: 'Falta de debida diligencia en el conocimiento del cliente',
    riesgoAsociado: 'Cliente',
    probabilidad: 2,
    impacto: 3,
  },
  {
    codigo: 'R02',
    evento: 'Uso de canales digitales para transacciones anónimas',
    causa: 'Debilidades en la autenticación de identidad en línea',
    riesgoAsociado: 'Canal',
    probabilidad: 2,
    impacto: 2,
  },
]

function buildEvent(data: Omit<RiskEvent, 'id' | 'riesgoInherente'>, id: string): RiskEvent {
  return {
    ...data,
    id,
    riesgoInherente: data.probabilidad * data.impacto,
  }
}

export function useRiskMatrix() {
  const [events, setEvents] = useState<RiskEvent[]>(() =>
    INITIAL_EVENTS.map((ev, i) => buildEvent(ev, `event-${i}`)),
  )

  const riesgoGlobal = useMemo<NivelRiesgo>(() => {
    const niveles = events.map((ev) => calcularNivelRiesgo(ev.probabilidad, ev.impacto))
    return calcularRiesgoGlobal(niveles)
  }, [events])

  const updateEvent = useCallback((id: string, updates: Partial<RiskEvent>) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== id) return ev
        const newEv = { ...ev, ...updates }
        newEv.riesgoInherente = newEv.probabilidad * newEv.impacto
        return newEv
      }),
    )
  }, [])

  const addEvent = useCallback(() => {
    const id = `event-${Date.now()}`
    const newEvent: RiskEvent = {
      id,
      codigo: `R0${events.length + 1}`,
      evento: '',
      causa: '',
      riesgoAsociado: 'Cliente',
      probabilidad: 1,
      impacto: 1,
      riesgoInherente: 1,
    }
    setEvents((prev) => [...prev, newEvent])
  }, [events.length])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
  }, [])

  return { events, riesgoGlobal, updateEvent, addEvent, deleteEvent }
}

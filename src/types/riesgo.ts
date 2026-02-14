/** Nivel de riesgo y factores para matriz SPLAF */
export type RiesgoNivel = 'BAJO' | 'MEDIO' | 'ALTO'

export interface FactoresRiesgo {
  actividadEconomica: RiesgoNivel
  paisOrigen: RiesgoNivel
  tipoActivo: RiesgoNivel
  montoOperacion: RiesgoNivel
  estructuraSocietaria: RiesgoNivel
}

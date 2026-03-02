export type ProbabilidadNivel = 1 | 2 | 3
export type ImpactoNivel = 1 | 2 | 3
export type NivelRiesgo = 'Bajo' | 'Medio' | 'Alto'

export type RiesgoAsociado = 'Cliente' | 'Proveedor' | 'Trabajadores' | 'Producto' | 'Canal' | 'Zona Geográfica'

export interface RiskEvent {
  id: string
  codigo: string
  evento: string
  causa: string
  riesgoAsociado: RiesgoAsociado
  probabilidad: ProbabilidadNivel
  impacto: ImpactoNivel
  riesgoInherente: number
}

export interface MatrizRiesgoState {
  events: RiskEvent[]
  riesgoGlobal: NivelRiesgo
}

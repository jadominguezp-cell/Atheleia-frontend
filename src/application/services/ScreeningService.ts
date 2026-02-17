import type { Profile, ScreeningResult } from '../../domain/screening/screening.types'

/** Contrato: screening de perfil contra listas (ONU, UIF, internas). */
export interface ScreeningService {
  runProfileScreening(profile: Profile): Promise<ScreeningResult>
}

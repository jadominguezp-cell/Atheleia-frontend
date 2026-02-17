import type { DocumentType } from '../../domain/documents/types'

export interface OperationContext {
  profileId: string
  tipo: 'natural' | 'juridica'
}

const REASONS: Record<DocumentType, string> = {
  consulta_reniec:
    'Verificar identidad y coincidencia de datos personales; requisito básico de identificación (SPLAFT).',
  consulta_sunat:
    'Confirmar RUC, actividad económica y vigencia tributaria para clasificación de riesgo fiscal.',
  consulta_migraciones:
    'Verificar estatus migratorio del representante en operaciones internacionales.',
  consulta_infogob:
    'Recopilar información pública y antecedentes administrativos de la contraparte.',
  consulta_essalud:
    'Confirmar registros vinculados a relaciones laborales; indicador secundario de riesgo.',
  consulta_centrales_riesgo:
    'Detectar historiales de morosidad o alertas crediticias relevantes al riesgo de lavado.',
  consulta_sunarp:
    'Verificar titularidad y cargas registrales sobre activos; esencial para trazabilidad.',
  solicitud_ficha_ruc:
    'Obtener detalle formal de la empresa para validar representantes y estructura societaria.',
}

/** Genera shortReason por tipo de documento (propósito + referencia normativa). */
export function generateReason(
  documentType: DocumentType,
  _context: OperationContext,
): string {
  const base = REASONS[documentType] ?? ''
  return `${base} Res. SBS N° 789-2018 / SPLAFT.`
}

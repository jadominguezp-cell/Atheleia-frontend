# Contexto (pegar tal cual en la cabecera del proyecto)

MVP web B2B de compliance y debida diligencia corporativa para empresas peruanas que compran/venden activos con contrapartes extranjeras, alineado a la normativa Resolución SBS N° 789-2018 emitida por la Superintendencia de Banca, Seguros y AFP. Usuario principal: abogado corporativo / tributario / oficial de cumplimiento. Stack objetivo: React + TypeScript + Vite, Chakra UI. Principios arquitectónicos: SOLID, separación por dominio (types por dominio, services de responsabilidad única, hooks, context, components por feature). Tono: corporativo, legal, en español — incluir avisos persistentes "Información simulada — No sustituye asesoría legal".

Fuentes externas / entidades de integración (usar como sourceId en metadatos): RENIEC, SUNAT, Migraciones, InfoGov, EsSalud, SUNARP, Unidad de Inteligencia Financiera del Perú, Consejo de Seguridad de Naciones Unidas.

---

# Objetivo del entregable

Generar SPEC técnica + UI/UX + scaffold inicial (mocks) que implemente, como **continuación inmediata del flujo actual** (splash → búsqueda DNI/RUC → carga → checklist), la **Vista Post-Checklist** con:

- Visualización de **Documentos encontrados automáticamente** (evidencia recuperada).
- Visualización de **Documentos que requieren análisis legal** (no encontrados, coincidencias parciales, evidencia insuficiente).
- Bajo cada documento: descripción breve automática (vínculo normativo y propósito).
- Acciones rápidas por documento: ver evidencia, marcar revisado, solicitar info, comentar, escalar.
- Integración con módulo **Screening & Alert Intelligence** (listas sanciones, PEP, UIF) y generación automática de **LegalReviewTicket** cuando proceda.
- **ComplianceAssistant** contextual para respuestas regulatorias (p.ej. preguntas 8–13) con evidencia adjunta.

---

# Flujo UX (obligatorio)

1. Splash "Aletheia" sobre fondo azul oscuro → pantalla búsqueda (DNI 8 / RUC 11) → BUSCAR.
2. Al pulsar BUSCAR: círculo de carga + "Aletheia está revelando los documentos".
3. Checklist existente → transición automática a **Post-Checklist View**.
4. **Post-Checklist View** (desktop/tablet): dos columnas responsivas:
   - **Izquierda:** Documentos encontrados automáticamente (cards).
   - **Derecha:** Documentos que requieren análisis legal (cards + panel tickets).
5. **Cards documentales:** título, icono origen (nube = automático / lápiz = manual), estado, timestamp, shortReason, requiredBy, confidenceScore, evidencias, acciones.
6. "Ver evidencia" → drawer/modal con evidencia + historial + "Generar ticket".
7. **Tickets:** panel derecho (drawer) con LegalReviewTicket editable (ticketId, documentId, reason, priority, assignedTo, deadline). Plantilla de respuesta autogenerada por ComplianceAssistant.
8. Filtrado por estado, fuente, tipo, prioridad, PEP.
9. Exportación mock: Exportar evidencia → ZIP/PDF con aviso legal.

---

# Modelo de datos Document

```ts
interface Document {
  id: string;
  type: DocumentType;
  sourceId: string;
  found: boolean;
  state: 'encontrado' | 'no_encontrado' | 'coinicidencia_parcial' | 'requiere_aclaracion';
  confidenceScore: number; // 0..100
  requiredBy: string[];
  shortReason: string;
  evidenceUrls: string[];
  timestamp: string; // ISO
  reviewStatus: 'pendiente' | 'en_revision' | 'revisado';
  assignedTo?: string;
  relatedScreeningId?: string;
}
```

**shortReason** se genera mediante `DocumentReasonService.generateReason(documentType, operationContext)` e incluye propósito + referencia normativa (SPLAFTT / Res. SBS N° 789-2018).

---

# LegalReviewTicket

```ts
interface LegalReviewTicket {
  ticketId: string;
  documentId: string;
  reason: string;
  priority: 'alta' | 'media' | 'baja';
  assignedTeam: string;
  assignedTo?: string;
  deadline?: string;
  relatedOperationId?: string;
  createdAt: string;
  status: 'abierto' | 'en_progreso' | 'cerrado';
  suggestedResponse?: string;
}
```

---

# Screening & Alert Intelligence

- `ScreeningService.runProfileScreening(profile)` → ScreeningResult (listas ONU, UIF, internas).
- Si `match === true` o `confidenceScore > umbral` → generar LegalReviewTicket y mover documento a columna "requiere análisis legal".
- Registrar listVersionId y timestamp en cada ScreeningResult.
- PEP: PEPCheckService (nacional/extranjero/familiares/vinculos); si PEP → ajustar RiskEngine.

---

# Servicios (contratos)

- `DocumentFetchService.fetchById(profileId, type): Promise<DocumentResult>`
- `DocumentReasonService.generateReason(type, context): string`
- `ScreeningService.runProfileScreening(profile): Promise<ScreeningResult>`
- `LegalReviewService.createTicket(ticketParams): Promise<LegalReviewTicket>`

Servicios como interfaces inyectables con adapters mock en `/infrastructure/adapters`.

---

# UI / Diseño

- **Paleta:** azul oscuro #0b2a4a, gris #6b7280, blanco, CTA #1976d2.
- **Cards:** borde sutil, shadow, ribbon (nube = automático / lápiz = manual). Estados: Encontrado (verde), No encontrado (gris), Coincidencia parcial (amarillo), Requiere aclaración (ámbar/rojo).
- **Drawer lateral** para tickets; skeleton loaders durante búsqueda.
- **Aviso persistente footer:** Información simulada — No sustituye asesoría legal.

---

# Estructura de proyecto

```
/src
  /domain/documents, /domain/screening, /domain/tickets
  /application/services
  /infrastructure/adapters, /infrastructure/persistence
  /features/Search, /features/PostChecklistView, /features/ComplianceAssistant
  /ui/theme, /ui/components
  /hooks
  /mocks
```

---

# QA (pasos de validación)

1. Ejecutar búsqueda mock (DNI/RUC).
2. Verificar checklist → Post-Checklist View aparece automáticamente.
3. Forzar coincidencia parcial en screening → ticket creado y documento en columna "requiere análisis legal".
4. Abrir ticket, editar respuesta sugerida, cerrar.
5. Exportar evidencia PDF/ZIP (mock) y comprobar aviso legal.
6. Revisar logs de auditoría y versiones de lista.

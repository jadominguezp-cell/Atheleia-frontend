# Aletheia — Compliance y debida diligencia SPLAF

## Contexto

MVP web B2B de compliance y debida diligencia corporativa para empresas peruanas que compran/venden activos con contrapartes extranjeras, alineado a la **Resolución SBS N° 789-2018** (Superintendencia de Banca, Seguros y AFP). Usuario principal: abogado corporativo / tributario / oficial de cumplimiento.

**Stack:** React + TypeScript + Vite, Chakra UI. Principios: SOLID, separación por dominio. Tono: corporativo, legal, español. Aviso persistente: *Información simulada — No sustituye asesoría legal.*

**Fuentes de integración (sourceId):** RENIEC, SUNAT, Migraciones, InfoGov, EsSalud, SUNARP, UIF, ONU.

---

## Cómo ejecutar (mock local)

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Arrancar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador la URL que indique Vite (p. ej. `http://localhost:5173`).

**Flujo:** Splash "Aletheia" → Búsqueda DNI (8 dígitos) o RUC (11 dígitos) → BUSCAR → Carga "Aletheia está revelando los documentos" → Checklist de documentos → **Ver resultados de búsqueda** → Vista Post-Checklist (documentos encontrados automáticamente | documentos que requieren análisis legal).

---

## Pasos de QA (validación)

1. **Búsqueda mock:** Ingresar un DNI (8 dígitos) o RUC (11 dígitos) y pulsar BUSCAR. Debe mostrarse el círculo de carga y el texto "Aletheia está revelando los documentos".
2. **Checklist:** Tras la carga, debe aparecer el checklist con los 8 tipos de documento y la etiqueta Búsqueda automática / Búsqueda manual.
3. **Post-Checklist:** Pulsar "Ver resultados de búsqueda". Debe mostrarse la vista en dos columnas: documentos encontrados automáticamente y documentos que requieren análisis legal.
4. **Acciones por documento:** En cada card, probar "Ver evidencia" (drawer), "Marcar revisado", "Escalar" (abre drawer de ticket).
5. **Ticket:** Al escalar o "Generar ticket", debe abrirse el panel de LegalReviewTicket con motivo, prioridad, equipo asignado y respuesta sugerida editable.
6. **Exportación:** El botón "Exportar evidencia (ZIP/PDF mock)" debe estar visible; en una versión completa generaría el archivo con aviso legal.
7. **Aviso legal:** El footer debe mostrar "Información simulada — No sustituye asesoría legal" en todas las pantallas tras el splash.

---

## Estructura del proyecto

- `SPEC-TECNICA.md` — Spec técnica y contexto (cabecera del proyecto).
- `src/domain` — Tipos y modelos (documents, screening, tickets).
- `src/application/services` — Contratos de servicios (DocumentReason, DocumentFetch, Screening, LegalReview).
- `src/infrastructure/adapters` — Implementaciones mock (documentFetch.mock).
- `src/infrastructure/persistence` — mockStore, auditLog.
- `src/features` — Search/reveal, PostChecklistView (DocumentCard, EvidenceDrawer, TicketsDrawer).
- `src/hooks` — useDocumentSearch.
- `src/mocks` — documents.json, screenings.json.

---

## Contratos de servicios

- **DocumentReasonService:** `generateReason(documentType, context)` → shortReason con propósito y norma.
- **DocumentFetchService:** `fetchById(profileId, type)` → DocumentResult (mock en `documentFetch.mock.ts`).
- **ScreeningService:** `runProfileScreening(profile)` → ScreeningResult (listas, listVersionId).
- **LegalReviewService:** `createTicket(params)` → LegalReviewTicket.

Implementaciones actuales: mocks; preparado para inyección de adapters reales.

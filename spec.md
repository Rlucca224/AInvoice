# Especificación del Proyecto: FintechCopilot

## Enfoque: Spec-Driven Development (SDD)
"El contrato (la especificación) es la fuente de verdad". No se escribe código de backend hasta que el esquema de la API esté definido y acordado.

---

## Módulos Funcionales del Sistema

### 1. Módulo de Autenticación y Perfil
*   **Registro de usuario**: Con validación de email.
*   **Login (JWT)**: Autenticación segura.
*   **Gestión de perfil**: Definición de moneda base y preferencias de notificación.

### 2. Módulo de Procesamiento Inteligente (El corazón "IA")
*   **Carga de documentos**: Endpoint para recibir un archivo (PDF/Imagen).
*   **Extracción de datos (IA)**: Servicio interno que envía el archivo a un LLM o servicio OCR, recibe un JSON estructurado (`Fecha`, `Proveedor`, `Monto`, `IVA`, `Moneda`).
*   **Validación de datos**: El usuario revisa los datos extraídos por la IA antes de confirmarlos (human-in-the-loop).

### 3. Módulo de Gestión de Gastos (CRUD)
*   **Listado de gastos**: Con filtros por fecha, categoría y proveedor.
*   **Edición manual**: Corrección manual si la extracción de IA falló.
*   **Eliminación**: Borrado de registros.
*   **Categorización automática**: Sugerida por la IA al guardar el gasto.

### 4. Módulo de Dashboard y Analítica
*   **Métricas agregadas**: Gasto total mensual, distribución de gasto por categoría.
*   **Comparativa**: Evolución y comparativas mes a mes.

---

## Estrategia de Implementación SDD

1.  **Diseño de Contrato (OpenAPI)**: Crear un archivo OpenAPI (`swagger.yaml` o `openapi.json`) antes de programar en .NET.
2.  **Mocking (Simulación)**: Probar y maquetar usando un servidor mock si es necesario.
3.  **Desarrollo en Frontend (Angular)**: Construir la UI basada en los contratos.
4.  **Desarrollo en Backend (.NET Core)**: Implementar controladores y DTOs basados exactamente en el contrato OpenAPI definido.

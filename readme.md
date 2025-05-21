# Read Garden Core

New version of Read Garden viewer core.
Extremely enhanced and fully built from scratch.
Mobile first version, mainly intended to work smoothly in mobile apps.

## Basic instructions

Use `pnpm`.

## Work with this repo

There are multiple dev scripts, but `pnpm dev` should work.
Check `.env.example` so you can check what you need in your `.env` file.
It's highly recommended to work with ngrok and all server variables set, so developing conditions will be mostly the same than real web/app.

### Using with ngrok

Full experience needs **two ngrok** URLs so final behavior can be really simulated.
For this, you'll need to create a free account in <https://ngrok.com> and [connect your account](https://ngrok.com/docs/getting-started/#step-2-connect-your-account)

## Build

There are different build scripts, using different esbuild configs.
Dev and expo configs are working, main config is intended to be used when core is extended to web projects as well (might need some testing before it's ready).

To run `npm run build:expo` its necessary that the application repository be in the same folder, the build will be saved in `expoPath` variable from `package.json`.

# Gestión de Eventos y Acciones [(Excalidraw)](https://app.excalidraw.com/l/4N9ldVOwdSU/9M9GjIMVcUv)

Este proyecto implementa un sistema interactivo basado en eventos (events) y acciones (actions) claramente definidas y separadas según sus responsabilidades. A continuación, se explica detalladamente el funcionamiento del sistema, así como la interacción entre eventos lanzados desde el core y las acciones gestionadas desde el wrapper.

## Estructura del Proyecto

El proyecto consta principalmente de dos tipos de elementos:

- **EVENTS** (Eventos lanzados desde el core)
- **ACTIONS** (Acciones ejecutadas desde el wrapper hacia el core)

Estos elementos interactúan constantemente para manejar la lógica de selección, creación, modificación y eliminación de highlights y notas.

### Eventos (EVENTS)

- Eventos emitidos por el core que son escuchados por el wrapper.
- Ejemplos de eventos:
  - `onUserSelect`: lanzado al seleccionar texto con el ratón.
  - `onClickHighlight`: lanzado al hacer clic en un highlight existente.
  - `onUpdateHighlight`: lanzado al actualizar un highlight.
  - `onDeleteElement`: lanzado al borrar un highlight o nota.
  - `onEditElement`: lanzado al editar una nota.

### Acciones (ACTIONS)

- Acciones invocadas por el wrapper que solicitan al core realizar operaciones específicas.
- Ejemplos de acciones:
  - `drawHighlights`: dibuja highlights existentes.
  - `removeHighlights`: elimina highlights existentes.
  - `showSelectionMenu`: muestra el menú contextual con opciones de selección (tipo, color).

## Flujo de Trabajo

### Selección de Texto y Creación de Elementos

1. **Selección de texto** (`onUserSelect`) lanza un evento desde el core.

   - wrapper responde con `showSelectionMenu`, mostrando las opciones disponibles.

2. **Interacción con menú de selección**:

   - Click en opción "highlight": crea un highlight.
   - Click en opción "nota": muestra menú de notas con opciones para crear o cancelar.

3. **Creación de highlights o notas**:
   - Confirmación del usuario ejecuta la creación y lo dibuja en el DOM.
   - Cancelación cierra el menú y limpia la selección.

### Interacción con Highlights o Notas Existentes

1. **Click en elemento existente** (`onClickHighlight`):

   - Según tipo, lanza menú específico:
     - Tipo "highlight": muestra menú para cambiar color o eliminar.
     - Tipo "nota": muestra menú para editar o borrar.

2. **Acciones sobre elementos existentes**:
   - Cambio de highlighter: ejecuta `onUpdateHighlight`.
   - Borrado: ejecuta `onDeleteElement`.
   - Edición de nota: ejecuta `onEditElement`.

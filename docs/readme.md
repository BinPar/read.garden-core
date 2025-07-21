# Documentación del Proyecto read.garden-core

¡Bienvenida/o a la documentación tecnica del proyecto! Aquí encontrarás todo lo que necesitas para entender, desarrollar y mantener el el proyecto.

## Índice General

- [Módulos y lógica de inicialización](#módulos-y-lógica-de-inicialización)
- [Funcionamiento general](#funcionamiento-general)
- [Proceso de Carga del Visor](#proceso-de-carga-del-visor)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Proceso de Build](#proceso-de-build)

# Módulos y lógica de inicialización

**El Núcleo**: `src/`
Este directorio contiene la esencia del visor.

`src/index.ts`
Es el punto de entrada principal. Exporta la función `setup`, que inicializa el visor y se asigna a `window.readGardenCore` para ser accesible globalmente en el navegador.

`src/@types/`
Define todas las interfaces y tipos de TypeScript utilizados en el proyecto, proporcionando una estructura de datos clara y segura. Aquí se definen los tipos para:

# Funcionamiento general

El visor NO trabaja directamente con archivos EPUB o PDF. En su lugar, utiliza un formato pre-procesado que consiste en:

- Archivo de Manifiesto (index.json): Este es el "mapa" del libro. Es un archivo JSON que contiene toda la metainformación esencial:

  - El tipo de layout: flow (texto que fluye, como un libro normal) o fixed (diseño fijo, como un cómic o PDF).
  - Una lista (contents) que enumera todos los archivos de contenido (capítulos) en orden.
  - La URL de la hoja de estilos CSS específica del libro.

- Archivos de Contenido (HTML): Cada capítulo o sección del libro es un archivo HTML independiente. Esto permite cargar el libro de forma incremental, mejorando enormemente el rendimiento, especialmente en dispositivos móviles.

- Contenedor Único (Formato de Distribución): Aunque el visor consume archivos HTML y JSON, estos a menudo se distribuyen comprimidos en un único archivo binario. Este archivo contiene todos los HTML, CSS, imágenes y fuentes.

- Descompresión y Cifrado: Los scripts en `scripts/tools/oneFileToPath/` se encargan de leer este archivo único, extraer el index.json que se encuentra al final del archivo, y luego usar ese índice para descomprimir cada recurso (HTML, CSS, etc.) en una estructura de carpetas que el visor pueda entender. Además, el contenido dentro de este archivo puede estar ofuscado mediante un cifrado simple para protegerlo.

## Proceso de Carga del Visor

Una vez que el contenido está preparado (es decir, descomprimido en su estructura de carpetas con index.json), el visor lo carga de la siguiente manera:

1. **Inicialización del Visor (`setup`)**: Todo comienza cuando se llama a la función `readGardenCore()`. Esta función recibe la configuración inicial, incluyendo la URL base donde se encuentra el contenido del libro.
2. **Descarga del Manifiesto**: El primer paso es descargar el archivo `index.json` desde la URL base del libro. Este archivo le da al visor toda la información que necesita para saber qué cargar y cómo mostrarlo.
3. **Procesamiento del Manifiesto**: Una vez descargado, la función `processJsonData` procesa el `index.json`. Crea estructuras de datos internas (Mapas de JavaScript) que permiten un acceso muy rápido a los capítulos por su `slug` (identificador único) y mantiene el orden correcto de los mismos. También establece enlaces de "anterior" y "siguiente" en cada capítulo para facilitar la navegación.
4. **Carga del Contenido Inicial**: El visor utiliza el `initialContentSlug` del manifiesto para saber qué capítulo cargar primero. Llama a la función `loadContentBySlug` para iniciar la carga.
5. **Descarga del HTML del Capítulo**: La función `loadContent` se encarga de la descarga del archivo HTML correspondiente al capítulo. Para no bloquear el navegador, esta descarga se realiza en un Web Worker en segundo plano.
6. **Renderizado en el DOM**: Una vez que el Web Worker ha descargado el HTML, lo devuelve al hilo principal. La función `renderContent` toma este HTML y lo inyecta directamente en el `<div>` principal del visor.
7. **Precarga Inteligente (Preloading)**: Tan pronto como se carga el primer capítulo, el visor no se queda inactivo. La función `preloadInBackground` se activa para comenzar a descargar los capítulos siguientes (y anteriores) durante el tiempo de inactividad del navegador (`requestIdleCallback`). De esta manera, cuando el usuario pasa a la siguiente página, el contenido ya está descargado y la transición es instantánea

Este proyecto implementa un sistema interactivo basado en eventos (events) y acciones (actions) claramente definidas y separadas según sus responsabilidades. A continuación, se explica detalladamente el funcionamiento del sistema, así como la interacción entre eventos lanzados desde el core y las acciones gestionadas desde el wrapper.

[(Excalidraw)](https://app.excalidraw.com/l/4N9ldVOwdSU/9M9GjIMVcUv)

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

# Proceso de build

El proyecto utiliza esbuild para un empaquetado rápido y eficiente. Existen tres configuraciones principales:

- esbuild.dev.mjs: Para el desarrollo local. Genera los archivos en la carpeta
- web/, incluye sourcemaps para facilitar la depuración y activa el modo "watch" para reconstruir automáticamente los cambios.
- esbuild.expo.mjs: Diseñado para integrarse con proyectos de React Native (Expo). Empaqueta el core y lo coloca en la ruta especificada en package.json (expoPath), cambiando la extensión a .viewerjs.
- esbuild.mjs: Para la compilación de producción. Genera los archivos en la carpeta
- build/, minificando el código y eliminando comentarios para optimizar el tamaño.

---

<div align="center">

_Última actualización: 21 de julio de 2025_

</div>

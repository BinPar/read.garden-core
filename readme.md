<div align="center">
  
  ```text
                    _                       _                                 
 _ __ ___  __ _  __| |   __ _  __ _ _ __ __| | ___ _ __     ___ ___  _ __ ___ 
| '__/ _ \/ _` |/ _` |  / _` |/ _` | '__/ _` |/ _ \ '_ \   / __/ _ \| '__/ _ \
| | |  __/ (_| | (_| | | (_| | (_| | | | (_| |  __/ | | | | (_| (_) | | |  __/
|_|  \___|\__,_|\__,_|  \__, |\__,_|_|  \__,_|\___|_| |_|  \___\___/|_|  \___|
                        |___/                                                 
  ```
  Desarrollado por [**BinPar Digital Ignition**](https://binpar.com)
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org)
  [![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org)
  [![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
</div>

Nueva versión de Read Garden Viewer Core, extremadamente mejorado y completamente construido desde cero. Primera versión móvil, principalmente destinada a funcionar sin problemas en aplicaciones móviles.

## 🌍 Características Principales

- **Doble Motor de Renderizado**: Soporte nativo para libros de texto que fluyen (modo flow) y contenido de diseño fijo como cómics o revistas (modo fixed).
- **Interactividad y Anotaciones**: Funcionalidades integradas para que el usuario pueda resaltar texto con diferentes colores y añadir notas personales.
- **Personalización Avanzada de Lectura**: Ofrece un control total sobre la experiencia visual, permitiendo ajustar el tamaño de fuente, cambiar la familia tipográfica y modificar el interlineado y la alineación del texto.
- **Modo dark/light**: Incluye modos de visualización claro (light) y oscuro (dark) para adaptarse a distintas condiciones de luz.
- **Diseño "Mobile First"**: Construido desde cero para un rendimiento óptimo en dispositivos móviles.
- **Modo horizontal**: Soporte para lectura en orientación horizontal, ideal para dispositivos con pantallas anchas.

## Primeros Pasos

### ✅ Requisitos Previos

- pnpm: El proyecto utiliza pnpm como gestor de paquetes. Asegúrate de tenerlo instalado.
- Node.js: La versión de Node.js requerida es la v22 o superior, como se especifica en el archivo .nvmrc.
- ngrok: Para una simulación completa del entorno real, se recomienda el uso de dos URLs de ngrok. Esto requiere una cuenta gratuita en [ngrok.com](https://ngrok.com) y conectar la cuenta localmente.

### 🛠️ Configuración del entorno

1. Instalar dependencias:

```bash
pnpm install
```

2. Crear cuenta gratuita en [ngrok.com](https://ngrok.com) y configurar la cuenta localmente.
3. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto basado en el `.env.example`
4. Arrancar el servidor de desarrollo:

```bash
pnpm run dev
```

## 🚀 Arrancar app

Al ejecutar

```bash
pnpm run dev
```

se mostraran dos enlaces, el enlace web (túnel público) y el del servidor web de Ngrok

```bash
::: Server available with Ngrok on: https://example.com
::: Web available with Ngrok on: https://example.com
```

se tienen que abrir ambos y dar click en "Visit site", primero hacerlo en el server y despues en la web, con esto deberia abrir correctamente la aplicacion.

## 🐛 Posibles errores

- **Third-Party Cookies**: si al momento de abrir el enlace de la web, dar click en "Visit site" y si al abrir un enlace para visualizar el visor este se ve blanco, puede que sea por que es necesario activar las cookies de terceros en el navegador. Tanto en mobile como en desktop puede surgir este error.

## 📁 Estructura de directorios

```text
read.garden-core/
├── assets/             # Archivos estáticos como CSS, imágenes y fuentes
├── dev/                # Lógica para el visor de desarrollo de prueba
├── scripts/            # Scripts para tareas de automatización (ej. descarga de contenido)
├── server/             # Backend (servidor Express) para ngrok, cookies y API
├── src/                # Código fuente principal del visor de libros
│   ├── @types/         # Definiciones de tipos de TypeScript para todo el proyecto
│   ├── tools/          # Herramientas de ayuda y funciones genéricas
│   └── utils/          # Lógica central y utilidades del visor
│       ├── actions/    # Implementación de las acciones que el wrapper puede invocar
│       ├── events/     # Lógica para despachar eventos desde el core
│       ├── fixed/      # Funcionalidades específicas para el modo de visualización "fixed"
│       └── flow/       # Funcionalidades específicas para el modo de visualización "flow"
├── web/                # Carpeta de salida para los builds de desarrollo
├── esbuild.dev.mjs     # Configuración de esbuild para el entorno de desarrollo
├── esbuild.expo.mjs    # Configuración de esbuild para builds de Expo (React Native)
├── esbuild.mjs         # Configuración de esbuild para builds de producción
└── package.json        # Dependencias y scripts del proyecto
```

## 🚢 Build

Hay diferentes scripts de compilación, utilizando diferentes configuraciones de ESBuild.
Las configuraciones de Dev y Expo están funcionando(podría necesitar algunas pruebas antes de que esté lista).

Para ejecutar `npm run build:expo` es necesario que el repositorio de aplicaciones esté en la misma carpeta, la compilación se guardará en la variable` expoPath` de `paquete.json`.

## 🤝 Cómo Contribuir

Todo el trabajo de desarrollo se realiza en la rama develop. Asegúrate de crear tus nuevas ramas a partir de develop y de enviar tus Pull Requests apuntando a esta misma rama. La rama main se reserva para las versiones estables.
Usamos un formato de commits convencional. La estructura general es la siguiente:

**Formato**: `type: description`

**Tipos**:

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta código)
- `refactor`: Refactorización
- `test`: Añadir tests
- `chore`: Tareas de mantenimiento

**Ejemplos**:

- `feat: some highlights actions and events`
- `fix: highlights positions`
- `chore: logs cleaning`

## 📚 Documentación tecnica

Toda la documentación detallada del proyecto se encuentra en la carpeta [`/docs`](./docs). Te recomendamos empezar por el [README de la documentación](./docs/readme.md), que funciona como un panel de control del estado del proyecto.

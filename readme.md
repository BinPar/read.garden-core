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

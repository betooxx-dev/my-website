# my-website

Mi sitio web!

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · next-intl · Framer Motion · Biome · Jest.

Ver [AGENTS.md](./AGENTS.md) para el detalle de convenciones, pre-commit hooks y estructura de tests.

## Requisitos

- Node.js 20+
- npm

## Desarrollo

```bash
npm install
npm run dev
```

El sitio queda en <http://localhost:3000>. La raíz redirige a `/es` o `/en` según el header `Accept-Language`. En desarrollo se usan defaults locales seguros; copia `.env.example` a `.env.local` cuando quieras conectar Studio con Argos.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción (`output: "standalone"`) |
| `npm run start` | Corre el build de producción |
| `npm run lint` | Biome check (lint + formato) |
| `npm run format` | Biome format con escritura |
| `npm run typecheck` | Verifica TypeScript sin emitir archivos |
| `npm test` | Corre la suite de Jest |
| `npm run test:watch` | Jest en modo watch |

## Variables de entorno

Validadas con `@t3-oss/env-nextjs` + Zod en [src/env.ts](src/env.ts).

| Variable | Uso | Desarrollo | Producción |
|---|---|---|---|
| `ARGOS_API_URL` | Argos desde el servidor | `http://localhost:5000/api` | Pendiente del backend |
| `NEXT_PUBLIC_ARGOS_API_URL` | Blog público desde el navegador | `http://localhost:5000/api` | Pendiente del backend |
| `NEXT_PUBLIC_SITE_URL` | URL canónica y sitemap | `http://localhost:3000` | Pendiente del dominio final |
| `STUDIO_ARGOS_API_KEY` | Scope `blog:admin` de Argos | Opcional | Pendiente del backend |
| `STUDIO_USERNAME` | Login privado de Studio | `studio` | Pendiente del backend |
| `STUDIO_PASSWORD_HASH` | Password en formato `scrypt:salt:base64url` | Default local | Pendiente del backend |
| `STUDIO_SESSION_SECRET` | Firma HMAC de la sesión | Default local | Pendiente del backend |

Mientras el backend de Argos no esté desplegado, el portafolio puede compilar en producción sin estas variables. Cuando se habiliten Blog y Studio deberán volver a ser obligatorias, usar URLs HTTPS y secretos aleatorios, y nunca copiar los placeholders de `.env.example`.

## Estructura

```
src/
  app/[locale]/   Rutas con i18n (home, blog, now, error, not-found)
  components/     UI (features, layout, shared)
  i18n/           Configuración de next-intl
  messages/       Traducciones (es.json es la fuente)
  __tests__/      Tests de i18n y env
  proxy.ts        Detección de locale (convención Next 16)
```

## Docker (desarrollo)

```bash
docker compose up --build
```

El Compose de desarrollo monta el código con hot-reload sobre `node:20-alpine`.

## Docker (producción)

```bash
cp .env.production.example .env.production
# Las variables de Argos y Studio permanecen comentadas hasta desplegar el backend.
docker compose -f compose.production.yaml up --build -d
docker compose -f compose.production.yaml ps
```

El build usa la salida `standalone` de Next.js y ejecuta el servidor con un usuario sin privilegios. El archivo `.env.production` se monta como secreto durante el build —necesario para validar las variables `NEXT_PUBLIC_*`— y también se inyecta en runtime; está ignorado por Git y por el contexto normal de Docker.

El puerto se publica únicamente en `127.0.0.1:3000` para colocarlo detrás de un reverse proxy con TLS. Puede cambiarse con `WEBSITE_PORT`. El healthcheck está disponible en `/api/health`.

## Contribuir

Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/) (`type: slug`). Detalles de flujo en [AGENTS.md](./AGENTS.md).

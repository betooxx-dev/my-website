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
| `ARGOS_API_URL` | Argos desde el servidor | `http://localhost:5000/api` | HTTPS, obligatoria |
| `NEXT_PUBLIC_ARGOS_API_URL` | Blog público desde el navegador | `http://localhost:5000/api` | HTTPS, obligatoria |
| `NEXT_PUBLIC_SITE_URL` | URL canónica y sitemap | `http://localhost:3000` | HTTPS, obligatoria |
| `STUDIO_ARGOS_API_KEY` | Scope `blog:admin` de Argos | Opcional | Obligatoria |
| `STUDIO_USERNAME` | Login privado de Studio | `studio` | Obligatoria |
| `STUDIO_PASSWORD_HASH` | Password en formato `scrypt:salt:base64url` | Default local | Obligatoria, sin default |
| `STUDIO_SESSION_SECRET` | Firma HMAC de la sesión | Default local | Obligatoria, mínimo 32 caracteres |

El build de producción falla temprano si falta una variable o si alguna URL usa HTTP. Los valores de CI son credenciales ficticias aisladas; despliegues reales deben usar secretos aleatorios y nunca copiar los placeholders de `.env.example`.

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

El [Dockerfile](Dockerfile) monta el código con hot-reload sobre `node:20-alpine`. El `next.config.ts` ya está configurado con `output: "standalone"` para producción cuando se necesite construir una imagen optimizada.

## Contribuir

Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/) (`type: slug`). Detalles de flujo en [AGENTS.md](./AGENTS.md).

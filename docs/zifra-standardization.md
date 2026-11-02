# Estándares compartidos con Zifra

Comparación del 2 de noviembre de 2026: `zifra-landing` local `cca3ade`,
remoto `1e072b6`; sitio personal actualizado por fast-forward de `0e2b1c8`
a `ef1fa7b`. Los cambios locales de `.claude` se conservan.

| Área | Resultado |
| --- | --- |
| Arquitectura | El sitio ya separa rutas, UI por dominio, configuración, contratos Zod, servicios y reglas de negocio; mantiene pruebas de límites arquitectónicos. |
| Runtime | Ambos usan Node 24 y Next 16. Se actualiza Next a 16.4.4, React a 19.2.9 y los tipos Node a la versión 24. |
| Docker | El sitio ya usa stages, caché npm, standalone, usuario sin privilegios, init y secretos de build. |
| i18n | Español pasa a URLs sin prefijo e inglés mantiene `/en`; se alinean enlaces, canonical, hreflang, JSON-LD, sitemap y llms.txt. |
| Calidad | Ya existen Biome, TypeScript, Jest, pruebas de copy y Playwright. CI ahora valida la imagen final de producción y conserva evidencia de fallos. |
| Guardrail | Se incorpora la recuperación del commit anterior a un push tras squash y se falla explícitamente si falta la base. |
| SEO | El sitio ya tiene metadatos sociales, imágenes OG, JSON-LD, robots, sitemap y política de posts demo. Se adaptan las URLs al nuevo estándar. |
| Seguridad | Se conservan headers defensivos, Studio deshabilitado en producción y validación runtime de contratos. |

También se actualizan Axios, Zod, next-intl, Jest y dependencias transitivas
corregibles; Sharp queda fijado a 0.35.5. Para corregir los avisos moderados
de las herramientas de test, se fijan `glob` 14.0.2 en sus consumidores Jest
y `test-exclude`, y `minimatch` 11.0.1 en `test-exclude`. Son overrides
limitados a desarrollo; se verifica la suite también con cobertura.
La auditoría completa conserva avisos bajos de `deepmerge` y sus consumidores.
No se aplica el downgrade mayor propuesto por `npm audit fix --force`.
CI conserva su umbral original `--audit-level=moderate`.

No se trasladan integraciones propias de Zifra como Atlas, solicitudes de demo,
Zustand o su contenido comercial. El sitio ya tiene sus propias reglas de Blog
y Studio. Tampoco se reemplaza su identidad visual por la de la landing.

## Validación reproducible

`docker compose run --rm --no-deps -e NODE_ENV=test web sh -lc 'npm run lint && npm run typecheck && npm test -- --runInBand'`

En CI, `npm run test:e2e:docker` usa un archivo temporal de build con una URL
ficticia, un contenedor con nombre único y un puerto asignado por Docker.
Espera `/api/health`, ejecuta Playwright y elimina sus recursos al terminar.
No lee `.env.production` ni utiliza servicios de producción.

Las pruebas de navegador cubren español sin prefijo, selección de idioma en
ambas direcciones, cookies y cabeceras de idioma, redirección de URLs antiguas,
navegación desde Blog, menú móvil, ancho de pantalla y aislamiento de Studio.

Se añade además visibilidad del contenido animado sin JavaScript y con
movimiento reducido. El selector conserva query y fragmento y navega a la URL
canónica del idioma elegido, evitando dejar `/es` en el historial visible.

## Resultado de validación

- Biome, TypeScript y guardrail de 500 líneas: correctos.
- Jest: 35 suites, 86 tests correctos, también con `--coverage` para comprobar
  los consumidores de los overrides de glob y minimatch.
- Build de producción: correcto con Next 16.4.4.
- `CI=1 npm run test:e2e:docker`: 9 pruebas correctas, incluyendo sitemap y
  contenido sin JavaScript. En el ejecutor Docker local se utilizó
  `E2E_DOCKER_HOST=host.docker.internal`; CI usa localhost por defecto.
- `npm audit --omit=dev --audit-level=moderate`: cero vulnerabilidades.
- `npm audit --audit-level=moderate`: correcto; quedan 5 avisos bajos de
  desarrollo, sin moderados, altos ni críticos.
- Entrega autorizada: `develop` → PR a `master` → checks verdes → merge.

La configuración de prefijos y detección de idioma sigue la
[documentación oficial de next-intl](https://next-intl.dev/docs/routing/configuration).

# AGENTS.md

Guía para agentes de IA y colaboradores sobre las convenciones, decisiones de diseño y prácticas de este proyecto.

---

## Stack

- **Framework:** Next.js 16 (App Router) con React 19
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **i18n:** next-intl
- **Linter/Formatter:** Biome
- **Tests:** Jest con `next/jest` (SWC transformer)
- **Git hooks:** simple-git-hooks + lint-staged

---

## Estructura del proyecto

```
src/
  app/                   # Rutas y layouts delgados de Next.js
    [locale]/            # Superficie pública y shell compartido
    studio/blog/
      _components/       # Componentes privados de la ruta editorial
  components/
    features/            # UI reutilizable agrupada por dominio
    layout/              # Shells compartidos (Navbar, Footer)
    shared/              # Primitivas reutilizables entre dominios
  config/                # Fuentes únicas de configuración del sitio
  contracts/             # Esquemas runtime y tipos nombrados como *-contract
  services/              # Cliente api.ts y servicios *.service.ts
  features/              # Reglas de negocio agrupadas por dominio
  i18n/                  # Routing, navegación y tipos de locale
  shared/                # Utilidades puras realmente transversales
  messages/              # Archivos de traducción (es.json, en.json)
  __tests__/             # Tests agrupados por dominio
scripts/                 # Scripts de utilidad para CI
.github/workflows/       # GitHub Actions
```

---

## Ramas y GitHub Actions

Las ramas activas son **`master`** y **`develop`**. Todos los workflows de GitHub Actions deben configurarse para ejecutarse en ambas:

```yaml
on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master, develop]
```

### Workflows existentes

| Archivo | Qué hace | Cuándo corre |
|---|---|---|
| `ci.yml` | Lint (Biome) + Build (Next.js) | Push y PR a `master`/`develop` |
| `line-guardrail.yml` | Detecta archivos que cruzan 500 líneas | Push y PR a `master`/`develop` |

---

## Pre-commit hook

El hook de pre-commit corre en este orden y bloquea el commit si falla cualquiera:

```
npx lint-staged   →   npm test
```

- **lint-staged** aplica `biome check --write` solo a los archivos staged (`*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.css`)
- **npm test** corre todos los tests con Jest

### Agregar un nuevo test al pre-commit

Los tests se ejecutan automáticamente porque `npm test` corre toda la suite. Para que un nuevo test se incluya, solo hace falta que su archivo termine en `.test.ts` y esté dentro de `src/__tests__/`.

No es necesario modificar `package.json` ni el hook.

Si en el futuro se necesita separar tests lentos de tests rápidos, crear dos scripts:

```json
"test": "jest",
"test:fast": "jest --testPathPatterns=src/__tests__/fast"
```

Y en el hook usar `test:fast` para no ralentizar el commit.

---

## Tests

La suite cubre i18n, Blog, Studio, SEO, contratos externos y utilidades. Todos
los tests viven en `src/__tests__/` y se agrupan por dominio.

### Archivos

| Archivo | Qué verifica |
|---|---|
| `i18n/helpers.ts` | Utilidades compartidas (loaders, flattenKeys, findKeyLine, findSourceFiles) |
| `i18n/translations.test.ts` | Completitud entre locales: todos los keys de `es.json` existen en los demás locales y viceversa |
| `i18n/usage.test.ts` | Uso en código: no hay keys en el JSON sin usar, ni keys usados en el código que no existan en el JSON |
| `blog/argos-contract.test.ts` | Los DTO recibidos desde Argos cumplen esquemas Zod en runtime |
| `seo/site-profile.test.ts` | Correo y redes sociales sólo se definen en `config/site-profile.ts` |

### Límites arquitectónicos

- `app/` coordina rutas, datos y layouts; una página no debe acumular secciones
  independientes. Los componentes exclusivos de una ruta viven en `_components/`.
- `components/shared/` no importa desde `components/features/` ni desde `app/`.
- `services/` contiene exclusivamente integración remota; no renderiza UI.
- `features/` contiene reglas de negocio y se divide por dominio y subdominio.
- `shared/` no conoce `app/`, `services/` ni un feature concreto.
- Los datos personales públicos se leen desde `config/site-profile.ts`.
- Todo payload externo de Argos se valida con los esquemas de `contracts/`.
- `i18n/routing.ts` es la única fuente para la lista y el tipo `Locale`.
- `services/api.ts` configura únicamente el cliente HTTP base; cada servicio
  `*.service.ts` declara sus endpoints y valida sus respuestas.

### Locale fuente

**`es.json` es el locale fuente (source of truth).** Al añadir una nueva clave de traducción, el flujo es:

1. Añadirla a `es.json`
2. Añadir su traducción a todos los demás locales (`en.json`, etc.)
3. Correr `npm test` — los tests confirmarán que todo está en sync

### Claves dinámicas

El analizador de uso detecta llamadas dinámicas como `t(variable)` o `t(\`template\`)`. Cuando las detecta, marca el namespace completo como dinámico y lo excluye del check de "claves sin usar" para evitar falsos positivos. Ejemplo: `navT(key)` en `Footer.tsx` marca el namespace `navbar` como dinámico.

---

## i18n

- Los archivos de traducción están en `src/messages/`
- El patrón de uso con next-intl es siempre:
  ```ts
  const t = await getTranslations("namespace")  // server
  const t = useTranslations("namespace")         // client
  t("key")
  ```
- No usar template literals en `t()` salvo que sea estrictamente necesario, ya que el análisis estático no puede verificarlos
- Al eliminar una sección o componente, eliminar también sus keys del JSON

---

## Guardrail de líneas

El script `scripts/check_code_file_line_limit.py` detecta archivos que **cruzan** el umbral de 500 líneas (de menos a más), no archivos que ya lo superaban. Esto incentiva mantener archivos pequeños sin penalizar deuda técnica existente.

Extensiones vigiladas: `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.py`, `.css`, `.scss`

Para correrlo manualmente antes de un PR:

```bash
python3 scripts/check_code_file_line_limit.py --mode local --threshold 500
```

---

## Linting y formato

Biome maneja tanto lint como formato. Configuración en `biome.json`.

- Usar comillas dobles (Biome lo impone)
- No usar `!important` en CSS salvo para sobreescribir estilos inline de librerías (ej. Framer Motion). En ese caso suprimir con comentario:
  ```css
  /* biome-ignore lint/complexity/noImportantStyles: needed to override Framer Motion inline styles */
  opacity: 1 !important;
  ```
- No usar non-null assertions (`!`) — preferir acceso explícito por índice o comprobación
- Evitar `Object.assign` en acumuladores de `.reduce()` — usar bucles `for...of`

---

## Convenciones de commits

Seguir **Conventional Commits**: `type: slug`

```
feat: add experience section with company logos
fix: resolve missing hero translations in en.json
chore: update dependencies
```

- No incluir al agente de IA como co-autor — omitir cualquier línea `Co-Authored-By:` de herramientas como Claude, Copilot u otras IAs

## Convenciones de ramas

Usar el mismo prefijo que el tipo de commit seguido de un slug descriptivo: `type/slug`

```
feat/experience-section
fix/cta-social
chore/update-dependencies
docs/branch-conventions
```

- El slug debe ser corto, en minúsculas y con guiones
- El prefijo debe coincidir con el tipo del commit principal que irá en esa rama

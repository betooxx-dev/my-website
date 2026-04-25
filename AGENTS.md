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
  app/[locale]/          # Rutas Next.js con soporte i18n
  components/
    features/home/       # Secciones de la home page
    layout/              # Navbar, Footer
    shared/              # Componentes reutilizables
  messages/              # Archivos de traducción (es.json, en.json)
  __tests__/
    i18n/                # Tests de cobertura de traducciones
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

La suite actual cubre exclusivamente i18n. Todos los tests viven en `src/__tests__/`.

### Archivos

| Archivo | Qué verifica |
|---|---|
| `i18n/helpers.ts` | Utilidades compartidas (loaders, flattenKeys, findKeyLine, findSourceFiles) |
| `i18n/translations.test.ts` | Completitud entre locales: todos los keys de `es.json` existen en los demás locales y viceversa |
| `i18n/usage.test.ts` | Uso en código: no hay keys en el JSON sin usar, ni keys usados en el código que no existan en el JSON |

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

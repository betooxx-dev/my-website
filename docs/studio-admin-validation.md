# Validación de administración del blog

Fecha local: 4 de septiembre de 2026. Repositorios: `argos` y `my-website`, ambos en `master`.

## Resultado y límite de la entrega

Implementadas las seis funcionalidades: catálogo persistente de categorías con
administración en Studio; eliminación de publicaciones; eliminación protegida de
imágenes; vista previa privada compartiendo `BlogArticle`; revisión SEO orientativa;
y `coverAlt` desde Argos hasta tarjetas, artículos y metadatos.

**QA privado completado en navegador**, con usuario local `studio-test`.
Se crearon y eliminaron datos desechables: publicación, portada y categoría de QA.
Se comprobaron editor, preview y biblioteca en escritorio y móvil (390×844),
publicación real, metadatos/alt, despublicación, eliminación y 404 de la URL retirada.

**Listos para commit**, sujeto a la autorización del usuario para crearlo. No se creó
commit, rama, push, merge ni PR. Blog y Studio siguen deshabilitados en producción.

## Base existente conservada

El seed de ocho publicaciones y cuatro portadas, el endpoint público inicial de
categorías, los filtros por categorías, el copy español y el diseño editorial ya
existían sin commit. Se conservaron. El seed fue adaptado para crear sus categorías;
el markup editorial se extrajo a un componente compartido conservando su diseño.
Las etiquetas siguen siendo metadatos de cada publicación.

## Pruebas realizadas mediante Docker Compose

| Comprobación | Resultado |
| --- | --- |
| Argos `npm run lint:check` (lint sin reescribir cambios ajenos) | OK |
| Argos `npm run build` | OK |
| Argos `npm run test:ci` | 23 pruebas unitarias |
| Argos `npm run test:e2e:ci` | 18 pruebas de integración; PostgreSQL aislado con Testcontainers |
| Argos `npm run validate:guardrails` | OK, con Git disponible dentro del contenedor |
| Frontend `npm run lint` | OK |
| Frontend `npm run typecheck` | OK |
| Frontend `npm test -- --runInBand` | 33 suites, 84 pruebas |
| Frontend build de producción | OK; secreto efímero aleatorio y volumen `.next` aislado |
| Guardrail de 500 líneas del frontend | OK |
| HTTP `scripts/qa/categories.mjs` | OK: normalización, duplicados, renombrado, referencias, auth y limpieza |
| HTTP `scripts/qa/deletions.mjs` | OK: publicación pública retirada, portada/Markdown protegido y asset libre eliminado |
| HTTP `scripts/qa/preview.mjs` | OK: sesión obligatoria, contenido privado, robots y exclusión de sitemap |
| Seed dos ejecuciones | 0 assets creados, 0 posts creados, 8 actualizados en cada ejecución |
| Migración repetida en local | 0 migraciones pendientes |
| `git diff --check` de ambos repositorios | OK |

La integración cubre la carrera guardar Markdown/eliminar asset: solo puede completarse
una de las operaciones incompatibles. También cubre retirar una portada previamente
cargada como relación, que inicialmente reveló una regresión de TypeORM y fue corregida.
La prueba de migración crea un esquema anterior, inserta variantes de categorías,
aplica el backfill, verifica integridad y renombrado, y ejecuta rollback sin perder posts.

### QA público en navegador

- Escritorio: filtro Trabajo, artículo editorial, título final y canonical.
- Móvil 390×844: índice y artículo sin desbordamiento visual observado.
- Alt real visible en el árbol de accesibilidad; `og:image:alt` e ImageObject de
  BlogPosting contienen el alt del asset.
- Navegación a `/en/blog` mediante selector de idioma; categorías Technology/Work
  recibidas del backend.

### QA privado y correcciones posteriores

- Inicio de sesión real con `studio-test` / `Studio-local-2026!`.
- Seed local ejecutado dos veces: la segunda no modifica archivos. Rechazo en
  `NODE_ENV=production` comprobado sin modificación de `.env.local`.
- Borrador creado con categoría Tecnología obtenida de Argos; imagen PNG subida
  desde el selector de archivos con alt real.
- Guardado y preview de la versión persistida, `noindex, nofollow`, presentación
  compartida, regreso al editor y revisión de viewport móvil.
- Panel SEO actualizado al escribir título, slug, extracto y elegir portada.
- Cancelación de eliminación; rechazo de portada en uso con mensaje en español.
  El contenido sin guardar del editor permaneció intacto tras ese error.
- Publicación real con título, descripción, canonical y `og:image:alt` coincidentes.
- Despublicación, eliminación del borrador y eliminación posterior del asset libre.
  La biblioteca se actualizó y la ruta pública retiró la publicación (404).
- Categoría creada, duplicado por espacios/mayúsculas/acentos rechazado, categoría
  renombrada/ordenada y eliminada; selector actualizado desde Argos.

Se reemplazó `window.confirm` por un diálogo HTML accesible con Confirmar/Cancelar,
foco inicial en Cancelar y envío con el submitter original. El diálogo nativo no
se mostraba de forma fiable en el navegador integrado.

Se corrigió el reset automático de React tras errores recuperables: los valores y
su recuperación local se conservan hasta un guardado correcto. Verificado creando
una categoría duplicada y observando que el nombre escrito permanece visible.

El detector de copy JSX ahora usa el AST de TypeScript: evita confundir genéricos
`useRef<T>` con etiquetas y detecta texto junto a expresiones. Tiene una prueba
positiva/negativa; las cadenas señaladas se movieron al copy central de Studio.

## Persistencia y notas operativas

La migración `1788560000000-CreateBlogCategories` ya se aplicó a la base local.
Producción usa el runner de migraciones existente. El comando de desarrollo
`blog:migrate-categories` está documentado para bases antiguas creadas mediante
`synchronize`; no habilita ninguna superficie en producción.

El rollback conserva posts y categorías canónicas como strings; no reconstruye las
variantes ortográficas originales. El catálogo se comparte entre idiomas y el orden
menor aparece primero. No se aplica similitud difusa de palabras: se normalizan Unicode,
acentos, espacios, mayúsculas y puntuación.

Una URL literal de asset dentro de un ejemplo de código se protege de forma conservadora.
Un UUID aislado no bloquea la eliminación. Una imagen seleccionada en cambios sin guardar
puede eliminarse tras confirmar; el guardado posterior rechaza referencias inexistentes.

Los alt heredados del seed aún son etiquetas como `Seed cover: SHIP / 04`; el nuevo flujo
los transmite fielmente. No se inventó una descripción distinta ni se reescribió el seed.
Al ejecutar el seed apareció un aviso de deprecación de `pg` sobre consultas simultáneas;
no hubo fallo ni duplicados. No se cambiaron dependencias.

## Archivos

“Base ampliada” indica un archivo que ya tenía cambios sin commit y fue adaptado en esta
tarea. “Base conservada” indica trabajo previo que no se editó durante esta tarea.

### argos

- Base ampliada: [README.md](</Users/betox/personal/argos/README.md>)
- Base ampliada: [package.json](</Users/betox/personal/argos/package.json>)
- Nuevo: [scripts/blogs/migrate-categories.ts](</Users/betox/personal/argos/scripts/blogs/migrate-categories.ts>)
- Base conservada: [scripts/blogs/seed-data.ts](</Users/betox/personal/argos/scripts/blogs/seed-data.ts>)
- Base ampliada: [scripts/blogs/seed.ts](</Users/betox/personal/argos/scripts/blogs/seed.ts>)
- Nuevo: [src/migrations/1788560000000-CreateBlogCategories.ts](</Users/betox/personal/argos/src/migrations/1788560000000-CreateBlogCategories.ts>)
- Modificado: [src/modules/blogs/admin-blogs.service.ts](</Users/betox/personal/argos/src/modules/blogs/admin-blogs.service.ts>)
- Modificado: [src/modules/blogs/assets/blog-assets.service.ts](</Users/betox/personal/argos/src/modules/blogs/assets/blog-assets.service.ts>)
- Nuevo: [src/modules/blogs/assets/markdown-asset-references.spec.ts](</Users/betox/personal/argos/src/modules/blogs/assets/markdown-asset-references.spec.ts>)
- Nuevo: [src/modules/blogs/assets/markdown-asset-references.ts](</Users/betox/personal/argos/src/modules/blogs/assets/markdown-asset-references.ts>)
- Base conservada: [src/modules/blogs/blogs.controller.ts](</Users/betox/personal/argos/src/modules/blogs/blogs.controller.ts>)
- Modificado: [src/modules/blogs/blogs.module.ts](</Users/betox/personal/argos/src/modules/blogs/blogs.module.ts>)
- Base ampliada: [src/modules/blogs/blogs.service.ts](</Users/betox/personal/argos/src/modules/blogs/blogs.service.ts>)
- Nuevo: [src/modules/blogs/categories/blog-categories.controller.ts](</Users/betox/personal/argos/src/modules/blogs/categories/blog-categories.controller.ts>)
- Nuevo: [src/modules/blogs/categories/blog-categories.service.spec.ts](</Users/betox/personal/argos/src/modules/blogs/categories/blog-categories.service.spec.ts>)
- Nuevo: [src/modules/blogs/categories/blog-categories.service.ts](</Users/betox/personal/argos/src/modules/blogs/categories/blog-categories.service.ts>)
- Nuevo: [src/modules/blogs/categories/blog-category.entity.ts](</Users/betox/personal/argos/src/modules/blogs/categories/blog-category.entity.ts>)
- Nuevo: [src/modules/blogs/categories/category-name.spec.ts](</Users/betox/personal/argos/src/modules/blogs/categories/category-name.spec.ts>)
- Nuevo: [src/modules/blogs/categories/category-name.ts](</Users/betox/personal/argos/src/modules/blogs/categories/category-name.ts>)
- Nuevo: [src/modules/blogs/categories/category.dto.ts](</Users/betox/personal/argos/src/modules/blogs/categories/category.dto.ts>)
- Modificado: [src/modules/blogs/entities/blog-post.entity.ts](</Users/betox/personal/argos/src/modules/blogs/entities/blog-post.entity.ts>)
- Nuevo: [test/blog-admin-scenarios.ts](</Users/betox/personal/argos/test/blog-admin-scenarios.ts>)
- Nuevo: [test/blog-category-migration.e2e-spec.ts](</Users/betox/personal/argos/test/blog-category-migration.e2e-spec.ts>)
- Base ampliada: [test/blogs.e2e-spec.ts](</Users/betox/personal/argos/test/blogs.e2e-spec.ts>)

### my-website

- Modificado: [README.md](</Users/betox/personal/my-website/README.md>)
- Nuevo: [docs/studio-admin-validation.md](</Users/betox/personal/my-website/docs/studio-admin-validation.md>)
- Nuevo: [scripts/qa/categories.mjs](</Users/betox/personal/my-website/scripts/qa/categories.mjs>)
- Nuevo: [scripts/qa/deletions.mjs](</Users/betox/personal/my-website/scripts/qa/deletions.mjs>)
- Nuevo: [scripts/qa/preview.mjs](</Users/betox/personal/my-website/scripts/qa/preview.mjs>)
- Nuevo: [src/__tests__/blog/seo.test.ts](</Users/betox/personal/my-website/src/__tests__/blog/seo.test.ts>)
- Nuevo: [src/__tests__/studio/admin-actions.test.ts](</Users/betox/personal/my-website/src/__tests__/studio/admin-actions.test.ts>)
- Modificado: [src/__tests__/studio/interface.test.ts](</Users/betox/personal/my-website/src/__tests__/studio/interface.test.ts>)
- Base ampliada: [src/app/[locale]/blog/[slug]/page.tsx](</Users/betox/personal/my-website/src/app/[locale]/blog/[slug]/page.tsx>)
- Base conservada: [src/app/[locale]/blog/page.tsx](</Users/betox/personal/my-website/src/app/[locale]/blog/page.tsx>)
- Modificado: [src/app/studio/blog/_components/AssetLibrary.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/AssetLibrary.tsx>)
- Nuevo: [src/app/studio/blog/_components/CategoryManager.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/CategoryManager.tsx>)
- Nuevo: [src/app/studio/blog/_components/DeletePost.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/DeletePost.tsx>)
- Modificado: [src/app/studio/blog/_components/DraftQueue.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/DraftQueue.tsx>)
- Modificado: [src/app/studio/blog/_components/PublishedPosts.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/PublishedPosts.tsx>)
- Nuevo: [src/app/studio/blog/_components/SeoReview.tsx](</Users/betox/personal/my-website/src/app/studio/blog/_components/SeoReview.tsx>)
- Modificado: [src/app/studio/blog/actions.ts](</Users/betox/personal/my-website/src/app/studio/blog/actions.ts>)
- Nuevo: [src/app/studio/blog/category-actions.ts](</Users/betox/personal/my-website/src/app/studio/blog/category-actions.ts>)
- Modificado: [src/app/studio/blog/page.tsx](</Users/betox/personal/my-website/src/app/studio/blog/page.tsx>)
- Modificado: [src/app/studio/blog/post-fields.tsx](</Users/betox/personal/my-website/src/app/studio/blog/post-fields.tsx>)
- Nuevo: [src/app/studio/blog/preview/[id]/page.tsx](</Users/betox/personal/my-website/src/app/studio/blog/preview/[id]/page.tsx>)
- Nuevo: [src/components/features/blog/BlogArticle.tsx](</Users/betox/personal/my-website/src/components/features/blog/BlogArticle.tsx>)
- Base conservada: [src/components/features/blog/BlogIndex.tsx](</Users/betox/personal/my-website/src/components/features/blog/BlogIndex.tsx>)
- Base conservada: [src/components/features/blog/MarkdownContent.tsx](</Users/betox/personal/my-website/src/components/features/blog/MarkdownContent.tsx>)
- Modificado: [src/components/features/blog/PostCard.tsx](</Users/betox/personal/my-website/src/components/features/blog/PostCard.tsx>)
- Modificado: [src/contracts/blog-contract.ts](</Users/betox/personal/my-website/src/contracts/blog-contract.ts>)
- Modificado: [src/contracts/studio-contract.ts](</Users/betox/personal/my-website/src/contracts/studio-contract.ts>)
- Base conservada: [src/features/blog/queries.ts](</Users/betox/personal/my-website/src/features/blog/queries.ts>)
- Nuevo: [src/features/blog/seo.ts](</Users/betox/personal/my-website/src/features/blog/seo.ts>)
- Nuevo: [src/features/studio/admin-copy.ts](</Users/betox/personal/my-website/src/features/studio/admin-copy.ts>)
- Base ampliada: [src/messages/en.json](</Users/betox/personal/my-website/src/messages/en.json>)
- Base ampliada: [src/messages/es.json](</Users/betox/personal/my-website/src/messages/es.json>)
- Base conservada: [src/services/blog.service.ts](</Users/betox/personal/my-website/src/services/blog.service.ts>)
- Modificado: [src/services/studio.service.ts](</Users/betox/personal/my-website/src/services/studio.service.ts>)


### Archivos añadidos o modificados al completar el acceso y QA

- Nuevo: [scripts/qa/seed-studio-user.mjs](/Users/betox/personal/my-website/scripts/qa/seed-studio-user.mjs).
- Modificado: [package.json](/Users/betox/personal/my-website/package.json), comando `studio:seed-user`.
- Modificado: [StudioSubmitButton.tsx](/Users/betox/personal/my-website/src/components/features/studio/StudioSubmitButton.tsx).
- Modificado: [StudioActionForm.tsx](/Users/betox/personal/my-website/src/components/features/studio/StudioActionForm.tsx).
- Modificado: [StudioUnsavedChanges.tsx](/Users/betox/personal/my-website/src/components/features/studio/StudioUnsavedChanges.tsx).
- Modificado: [hardcoded.test.ts](/Users/betox/personal/my-website/src/__tests__/i18n/hardcoded.test.ts).
- Ampliados: README, copy administrativo, SeoReview y preview (listados arriba).
- Configuración local ignorada por Git: `.env.local` ahora usa el usuario de pruebas;
  `.env.local.studio-user-backup` conserva usuario/hash anteriores. No se modificaron
  la API key ni el secreto de sesión existentes.

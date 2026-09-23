# Publicaciones

Cada artículo vive en `es/slug.md` o `en/slug.md`. El nombre del archivo es el slug de la URL. El bloque entre `---` es JSON; el resto es Markdown.

```md
---
{"title":"Título","excerpt":"Resumen breve","category":"Tecnología","date":"2026-09-22","cover":"/blog/portada.png","coverAlt":"Descripción de la portada","tags":["web"],"featured":false}
---
# Título

Contenido del artículo.
```

Guarda las portadas y las imágenes del cuerpo en `public/blog/`. En el Markdown puedes insertar imágenes con `![Descripción](/blog/imagen.png)`. Publicar consiste en añadir los archivos al repositorio y desplegar Next.js en Vercel.

Los tres artículos de ejemplo por idioma tienen `"demo":true` en sus metadatos. La variable de servidor `SHOW_DEMO_BLOG_POSTS=true` los muestra en el listado y permite abrir sus URLs. Con `false` o sin definir, quedan ocultos y sus URLs devuelven 404. Los artículos de demo no entran en el sitemap y llevan `noindex`. Para probarlos en producción, configura la variable en Vercel para el entorno **Production** y vuelve a desplegar. Apágala y vuelve a desplegar cuando termine la prueba.

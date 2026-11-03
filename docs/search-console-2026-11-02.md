# Revisión de Search Console: albertoavendano.com

Revisión del 2 de noviembre de 2026 desde Edge, limitada a la propiedad
`sc-domain:albertoavendano.com`. Se contrastaron los informes con respuestas
HTTP actuales y una prueba en vivo de Google.

## Hallazgos y clasificación

| Informe | Evidencia | Resultado |
| --- | --- | --- |
| Indexación | Última actualización del resumen: 22/10/26; 2 URLs indexadas y 6 excluidas. | El resumen es histórico y no demuestra el estado del despliegue actual. |
| Canonical diferente | Una URL: `/es`. La inspección registra rastreo del 31/10/26; canonical declarada `/es`, seleccionada por Google `/`. | Google eligió la portada correcta. Actualmente `/es` ya redirige a `/`; se refuerza la migración con 308 permanente. |
| Redirecciones | `https://www.albertoavendano.com/` y `/es/`. | Son alias que deben redirigir, no páginas que deban indexarse por separado. Ambos llegan a la portada canónica; no se eliminan las redirecciones para ocultar el aviso. |
| Noindex | `/es/blog`, `/es/blog/movimiento-con-intencion`, `/es/blog/disenar-software-tranquilo`. | Sus destinos actuales sin `/es` son demos y mantienen `noindex` intencional. Quedan fuera del sitemap. |
| Sitemaps | Solo existían seis envíos de 2021–2022, con errores de obtención; faltaba el sitemap actual. | Se envió `https://albertoavendano.com/sitemap.xml`. Google confirmó “Correcto”, con 2 páginas descubiertas. |
| Portada | Inspección del índice: “La URL está en Google”. Prueba en vivo: “La URL está disponible para Google” y “La página se puede indexar”. | No hay bloqueo actual de indexación de la portada. |
| Acciones manuales | “No se ha detectado ningún problema”. | Sin sanciones detectadas. |
| Seguridad | “No se ha detectado ningún problema”. | Sin problemas de seguridad detectados por Search Console. |
| HTTPS | Actualización 1/11/26: sin problemas críticos ni problemas en los últimos 90 días. | Sin corrección necesaria. |
| Core Web Vitals | Actualización 31/10/26: datos de uso insuficientes en móviles y ordenador. | No equivale a métricas aprobadas ni a un fallo de rendimiento. |
| Mensajes | Cuatro avisos: 15/10, 7/10, 25/9 y 22/9. | Coinciden con los correos revisados; no hay avisos nuevos adicionales. |

Los seis sitemaps antiguos permanecen como registros históricos; no se recrean
endpoints de un sitio anterior ni se redirigen categorías y eventos inexistentes
a la portada. El sitemap vigente es `/sitemap.xml` y está declarado en robots.txt.

## Corrección y verificación

- `next.config.ts` redirige `/es` explícitamente a `/` y `/es/:path*` a
  `/:path*` con estado 308. La regla explícita evita una cabecera Location
  vacía al resolver el parámetro opcional sin segmentos en el servidor real.
- Se conservan rutas y parámetros de consulta.
- Tests de integración de configuración reproducen el fallo antes del cambio
  y verifican raíz, blog y artículo con query después del cambio.
- Playwright comprueba las respuestas HTTP reales del contenedor de producción
  y que los destinos canónicos respondan 200.
- Se mantiene el noindex de las demos y el contenido del sitemap.
- QA funcional: passed en Docker aislado. Build, Biome, TypeScript y guardrail
  correctos; 36 suites Jest con 89 tests y 10 pruebas Playwright correctas.
- La auditoría conserva el umbral moderado y pasa con los cinco avisos bajos
  de herramientas de desarrollo ya documentados en la entrega anterior.

## Pasos operativos de entrega

1. Validar en Docker; commit y push a `develop`.
2. Abrir PR a `master`; integrar solo con todos los checks verdes.
3. Verificar `/es` y `/es/blog` en el despliegue público.
4. En Vercel, convertir la redirección existente de `www.albertoavendano.com`
   hacia `albertoavendano.com` de temporal 307 a permanente 308, conservando
   destino y asociación del dominio.
5. Solicitar validación del aviso de canonical duplicado en Search Console.
   El resultado final depende del siguiente rastreo de Google; iniciar validación
   no significa que Google ya la haya terminado.

Las exclusiones intencionales de redirección y noindex se conservan. No se
solicita que Google indexe aliases o contenido de demostración.

Referencias: [informe de indexación de Google](https://support.google.com/webmasters/answer/7440203)
y [redirects en Next.js](https://nextjs.org/docs/app/guides/redirecting).

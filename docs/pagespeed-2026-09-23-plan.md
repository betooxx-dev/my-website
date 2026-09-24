# Plan de rendimiento: portada `/es` y `/en`

Fecha de validación: 23 de septiembre de 2026. Estado: diagnóstico y plan; no se han aplicado cambios de implementación.

## Evidencia de partida

- [PageSpeed Insights de `/` (móvil)](https://pagespeed.web.dev/analysis/https-albertoavendano-com/p4dnnvijn7?utm_source=search_console&form_factor=mobile&hl=es): la redirección terminó en `/en`; rendimiento 88, FCP 1,8 s, LCP 3,3 s, TBT 0 ms, CLS 0. En [ordenador](https://pagespeed.web.dev/analysis/https-albertoavendano-com/p4dnnvijn7?utm_source=search_console&form_factor=desktop&hl=es): rendimiento 98, LCP 0,6 s. Sin datos de campo suficientes.
- Mediciones directas de producción con Lighthouse 12.8.2 y Chrome local, una ejecución por combinación. No son estrictamente comparables con PageSpeed, que usó Lighthouse 13.5.0, otra máquina y otra conexión:

  | Ruta | Dispositivo | Rendimiento | FCP | LCP | TBT | CLS |
  | --- | --- | ---: | ---: | ---: | ---: | ---: |
  | `/es` | móvil | 90 | 1,1 s | 3,5 s | 10 ms | 0 |
  | `/en` | móvil | 88 | 1,6 s | 3,5 s | 20 ms | 0 |
  | `/es` | ordenador | 100 | 0,3 s | 0,7 s | 0 ms | 0 |
  | `/en` | ordenador | 100 | 0,3 s | 0,6 s | 0 ms | 0 |

- Se intentó la API de PageSpeed para `/es` directamente, pero devolvió HTTP 429 por cuota diaria agotada. Las cuatro mediciones directas anteriores cubren ambas rutas y dispositivos; repetir con PageSpeed cuando vuelva la cuota.
- Validación del repositorio `161bd53`: `npm run lint`, `npm run typecheck`, 82 pruebas Jest y `npm run build` pasaron en Node 22 mediante Docker. El build generó `/es` y `/en` como HTML estático.

## Causas verificadas y decisiones

1. **Imagen LCP, prioridad alta — prioridad P1.** `HeroSection.tsx` usa `next/image` con `preload` y `quality={75}`. El HTML publicado contiene precarga de la imagen y la etiqueta `<img>` desde la respuesta inicial, sin `loading="lazy"`. Por tanto, descubrimiento y carga inmediata ya están resueltos. La precarga carece de `fetchpriority="high"`; Lighthouse lo marca tanto en el informe original como en las mediciones directas. La imagen optimizada transferida en el informe pesa 48,7 KiB. Su ahorro teórico por más compresión es 7,4 KiB. **Acción:** probar `fetchPriority="high"` en la imagen y verificar que la precarga emitida por Next también lleve prioridad alta, sin duplicarla. Medir LCP antes de dar el cambio por bueno. Evaluar compresión/formato solo después de una comparación visual del rostro y los detalles de la foto; su beneficio es pequeño.
2. **Retraso de renderizado del LCP — prioridad P1 de investigación.** En nuestras trazas móviles, la descarga de la imagen tardó unos 145–147 ms y el retraso de renderizado del elemento fue mucho mayor: aproximadamente 1,1 s en `/es` y 2,0 s en `/en`. La foto está dentro de `.hero-card-reveal`, que anima `transform` durante 1 s con 0,2 s de espera; además `TiltCard` aplica transformaciones con Framer Motion. Esto es un candidato, no una atribución causal demostrada. **Acción:** grabar una traza de rendimiento y hacer una variante controlada que omita solo la animación de entrada de la foto; comparar LCP y apariencia. Mantener la animación si el efecto sobre LCP es marginal o la experiencia empeora.
3. **JavaScript inicial sin uso — prioridad P2.** PageSpeed atribuye 29,9 KiB de ahorro al chunk `2o_vrls5zbbcd.js` (43,7 KiB transferidos) y 29,4 KiB a `1k4v66l3seak7.js` (72,1 KiB). El primero contiene Framer Motion; en esta ruta lo usan `TiltCard` en el hero y `ScrollReveal` en secciones posteriores. `DragSlider` también es un componente cliente de la portada, aunque no importa Framer Motion. El segundo contiene código del runtime de Next/React y polyfills. La cifra de Lighthouse es cobertura durante carga inicial, no bytes que puedan eliminarse directamente. **Acción:** primero aislar con analizador de bundles o traza qué módulos del primer chunk llegan en la carga inicial; después prototipar una tarjeta con CSS/puntero o diferir animaciones inferiores, comparando peso y comportamiento de hover, scroll y movimiento reducido. Evitar ocultar contenido hasta la hidratación.
4. **JavaScript antiguo — prioridad P3.** Los 13,7 KiB indicados se concentran en `1k4v66l3seak7.js`; Lighthouse identifica polyfills como `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries` y `Object.hasOwn`. No hay configuración propia de `browserslist` ni imports explícitos de polyfills; provienen del bundle de framework/runtime. **Acción:** revisar una actualización de Next/React cuando exista una versión estable y comparar el bundle; no retirar polyfills del framework manualmente por un ahorro estimado pequeño.
5. **CSS que bloquea renderizado — prioridad P3.** En ordenador, PageSpeed apunta a dos hojas CSS del propio build de aproximadamente 1,4 y 16,6 KiB transferidos y estima 60 ms de ahorro. La portada importa Tailwind y estilos globales; esta CSS necesita cargarse antes de mostrar correctamente el hero. **Acción:** inspeccionar cobertura CSS y si hay estilos de rutas ajenas en la hoja global. Dividir estilos solo si se demuestra una reducción de la ruta crítica sin parpadeos visuales. No diferir CSS esencial para perseguir 60 ms en una página con LCP de 0,6 s en ordenador.
6. **Redirección de idioma — sin defecto confirmado.** `routing.ts` configura `defaultLocale: "es"` y deja activa la detección de idioma de `next-intl`. En producción, `/` responde 307 a `/es` sin `Accept-Language` o con español, y 307 a `/en` con `Accept-Language: en-US,en;q=0.9`; las rutas `/es` y `/en` responden 200. Esto explica por qué PageSpeed acabó en `/en`. **Acción:** usar siempre las rutas explícitas en pruebas y enlaces de campañas. Conservar la negociación de idioma salvo que se decida una portada raíz determinista; ese cambio sería de producto/SEO, no de rendimiento.

## Orden de ejecución para la siguiente fase

1. Capturar línea base repetible: tres ejecuciones por ruta y dispositivo, misma versión de Lighthouse y condiciones, guardar JSON y comparar medianas de LCP, FCP, TBT y CLS. Registrar también tamaño de JS/CSS y captura visual. Las cuatro ejecuciones de arriba son una primera referencia, no una mediana.
2. Aplicar prioridad alta a la imagen LCP y comprobar HTML/precarga generados; medir. Investigar por separado el retraso de renderizado mediante una variante controlada de la animación de la foto.
3. Analizar el bundle de Framer Motion y, solo si el beneficio medido compensa, reducir la interacción de la tarjeta o diferir animaciones de secciones inferiores sin alterar accesibilidad ni contenido inicial.
4. Revisar compresión de foto, polyfills y CSS únicamente si las trazas muestran impacto relevante. Evitar cambios de formato o calidad con pérdida visual perceptible.
5. Para cada cambio: lint, typecheck, Jest, build; revisar `/es` y `/en` en móvil y ordenador, navegación, hover, slider, preferencia de movimiento reducido y ausencia de regresiones de CLS. Comparar medianas en producción tras desplegar y revertir cualquier cambio que empeore experiencia o métricas de manera consistente.

La comprobación previa de `robots.txt`, sitemap, canonicals, títulos, descripciones y datos estructurados sigue vigente; este plan no propone modificaciones allí.

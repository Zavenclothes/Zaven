# ZAVEN — sitio público + Measurement Lab — v2

Web estática creada para practicar **GA4, Google Tag Manager, Meta Pixel, UTM** y luego TikTok Pixel, sin necesidad de pagar hosting.

## Qué incluye esta versión
- Menú horizontal negro con logo tipográfico blanco/transparente (sin recuadro de imagen).
- Submenús: Hombre, Colecciones y Descubre.
- Menú móvil desplegable.
- Secciones de categorías, catálogo, lookbook/pasarela, guía de tallas, asesoría, ubicación demo, FAQ, contacto y newsletter.
- Buscador interno demo.
- Carrito y checkout demo.
- Formulario de lead + `gracias.html`.
- Panel de depuración de UTM/eventos desde el footer.

## Eventos preparados para practicar
Todos hacen `dataLayer.push()` y quedan visibles en el panel de medición:
- `landing_view`
- `nav_click`
- `menu_open`
- `select_content`
- `view_item`
- `add_to_cart`
- `view_cart`
- `begin_checkout`
- `search_open`
- `search`
- `cta_click`
- `size_guide_select`
- `store_locator_click`
- `faq_open`
- `generate_lead`
- `contact_submit`
- `sign_up`
- `custom_engagement`
- `scroll_75`

Si luego instalas Meta Pixel (`fbq`), el laboratorio ya traduce automáticamente algunos eventos principales a `ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead` y `Search`.

## Publicarlo gratis
### Opción A — GitHub Pages
1. Crea un repositorio, por ejemplo `zaven-lab`.
2. Sube todos los archivos manteniendo `/assets`.
3. Settings → Pages → Deploy from a branch → `main` / root.
4. GitHub te dará una URL pública tipo `https://usuario.github.io/zaven-lab/`.

### Opción B — Netlify
1. Entra a Netlify.
2. Usa despliegue manual / drag & drop con el contenido de esta carpeta.
3. Recibirás una URL pública gratuita.

## Orden recomendado de integración
1. Publicar la web.
2. Crear Google Tag Manager e instalar el snippet en `index.html` y `gracias.html`.
3. Conectar GA4 desde GTM.
4. Verificar `page_view` y eventos en DebugView / Realtime.
5. Crear Meta Pixel en Events Manager e instalarlo.
6. Verificar eventos en Test Events.
7. Crear URLs UTM y abrirlas manualmente.
8. Montar campañas de Meta en borrador con esa URL y seleccionar el evento deseado.
9. TikTok al final.

## URL UTM de prueba
`https://TU-DOMINIO/?utm_source=facebook&utm_medium=paid_social&utm_campaign=zaven_lab&utm_content=video_01&utm_term=prospecting`

Cambia `video_01` por `video_02`, `imagen_01`, etc. y revisa el panel de medición.

## Dónde pegar integraciones
En `index.html`, dentro de `<head>`, está el bloque comentado **LAB DE MEDICIÓN**. El `noscript` de GTM debe ir justo después de `<body>`. Repite la integración base también en `gracias.html` cuando lleguemos a esa etapa.

## Nota
La web es un laboratorio. Los formularios no guardan ni transmiten información personal a un backend. El checkout tampoco procesa pagos reales.


## Modo público vs. modo técnico
La interfaz pública ya no muestra textos de laboratorio, UTM, GA4, Pixel ni instrucciones de medición. El tracking sigue activo por debajo. Para abrir el panel técnico sin exponerlo al visitante, usa `?debug=1` al final de la URL o presiona `Ctrl+Shift+D`.

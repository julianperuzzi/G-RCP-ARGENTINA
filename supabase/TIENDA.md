# Tienda GRCP

La tienda pública (`/shop`) obtiene los productos publicados desde Supabase. GRCP administra el catálogo en `/Portal/tienda`. Las instituciones no pueden crear, modificar ni consultar borradores.

## Primer uso

1. Entrar al portal con la cuenta administradora GRCP y abrir **Tienda**.
2. Revisar los tres productos importados de la hoja anterior. Están en **Borrador** porque sus precios, descripciones y fotos necesitan validación.
3. Corregir precio, categoría, descripción y disponibilidad. Guardar la ficha.
4. Agregar hasta seis fotos JPG, PNG o WebP. El navegador las comprime antes de subirlas al bucket `shop-images`.
5. Pulsar **Publicar** cuando el producto esté listo. Solo entonces aparecerá en `/shop`.

El catálogo permite precios normales y de oferta en ARS, stock disponible o limitado, destacados, búsqueda, filtros, ficha con galería y carrito. El carrito guarda IDs y cantidades en el navegador y vuelve a consultar la base antes de abrir la consulta por WhatsApp. La consulta no reserva stock ni genera un cobro en línea: GRCP confirma disponibilidad, entrega e importe final por ese canal.

## Datos y permisos

- `shop_products`: fichas, precios, stock y publicación.
- `shop_product_images`: referencias y orden de las fotos.
- `shop_product_audit`: historial automático de altas y cambios, solo legible por GRCP.
- Storage `shop-images`: archivos de imagen públicos para los productos publicados, carga y borrado solo por GRCP.

Las políticas RLS están en `migrations/20261008170418_shop_catalog.sql`. Los borradores importados están en `migrations/20261008171633_shop_catalog_import_drafts.sql`. Ambas migraciones ya se aplicaron al proyecto remoto el 8 de octubre de 2026 mediante Supabase CLI. El historial de migraciones remoto anterior a esta función no está reconciliado; no ejecutar `supabase db push` sin revisar ese historial. Los cambios de esquema futuros deben aplicarse de forma controlada.

## Operación

- Para retirar un producto de la tienda, usar **Retirar publicación** o **Archivar**.
- Al corregir un precio, el historial conserva el valor anterior. El precio del carrito se verifica nuevamente antes de consultar.
- El stock limitado es informativo. Como el pedido se termina por WhatsApp, ajustar unidades en el portal después de concretar una venta.
- Si una foto externa deja de funcionar, reemplazarla por una foto cargada en el portal.

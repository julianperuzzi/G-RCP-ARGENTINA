-- La hoja anterior contenía precios y descripciones sin validar.
-- Se conservan para revisión en el portal, sin publicarlos al público.
insert into public.shop_products
  (sku, name, category, summary, description, price_cents, sale_price_cents,
   stock_mode, status, featured, sort_order, external_image_url)
values
  ('LEGACY-1', 'Muñeco RCP', 'Capacitación', 'Kit básico de primeros auxilios',
   'Contiene 1 mascarilla, guantes y vendas', 20000000, null,
   'available', 'draft', false, 1, null),
  ('LEGACY-2', 'DEA Portátil', 'DEA y accesorios', 'Desfibrilador Real portátil philips',
   E'DEA Philips HeartStart HS1\n\nctrodos de desfibrilación SMART, botón verde de encendido/apagado, botón azul de información, botón naranja de descarga. Indicadores: Luz de funcionamiento, botón de información azul, luz de precaución, luz del botón de descarga encendida al administrar una descarga.',
   2000000, 1800000, 'available', 'draft', false, 2,
   'https://tccommercear.vtexassets.com/arquivos/ids/161349-800-auto?v=638793067825970000&width=800&height=auto&aspect=true'),
  ('LEGACY-3', 'Camilla', 'Rescate', 'Camilla plegable',
   'Resistente hasta 150kg, plegable', 1500000, 1400000,
   'out_of_stock', 'draft', false, 3,
   'https://i.pinimg.com/736x/19/9c/40/199c40b041d1950db4fccdbf4ffdddcb.jpg')
on conflict (sku) do nothing;

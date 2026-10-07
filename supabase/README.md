# Registro DEA · GRCP

Proyecto destino: **https://tfueuppotcanagvgxpca.supabase.co**. Estos archivos no se ejecutaron en la nube: la instalación queda a cargo del propietario del proyecto.

## 1. Ejecutar SQL en el proyecto correcto

En el SQL Editor de **ese proyecto**, ejecutar en orden:

1. `01-instalar-registro.sql`: tablas, permisos RLS, autorización exclusiva e historial. Ejecutar una sola vez en un esquema donde no existan estas tablas. La transacción revierte todo si falla.
2. `02-cargar-dea.sql`: 437 ubicaciones del KMZ proporcionado. Se puede volver a ejecutar: no duplica ni sobrescribe registros con la misma clave de origen.

La carga inicial publica los puntos **sin verificar**, con acceso y disponibilidad **sin confirmar**. El archivo de origen no proporciona direcciones, localidades, provincias ni horarios estructurados: se dejan vacíos y se completan en el panel. Esto no es un inventario exhaustivo de todos los DEA de Argentina.

## 2. Crear la única cuenta de gestión

En **Authentication → Users**, crear `gruporcpsa@gmail.com` con contraseña y email confirmado (o confirmar su email si ya existe). Crear el usuario con las herramientas de Authentication; no insertar contraseñas ni usuarios mediante SQL.

En la configuración de Authentication:

- Habilitar el proveedor email/contraseña.
- Deshabilitar el registro de nuevos usuarios (**Allow new users to sign up**).
- Mantener deshabilitados el inicio anónimo y los proveedores que no se utilicen.
- Durante el desarrollo, configurar Site URL `http://localhost:3001` y permitir la URL de redirección `http://localhost:3001/PanelDEA` para recuperación de contraseña. Al publicar el sitio, configurar el dominio definitivo y su ruta `/PanelDEA`.

La base comprueba el ID real de la sesión en `auth.users`, el email exacto y su confirmación. Ninguna otra cuenta puede administrar DEA aunque llegue a iniciar sesión. El sitio no tiene registro público ni gestión de usuarios. Si ya hay cuentas ajenas en Authentication, el propietario debe revisarlas; estos SQL no las eliminan.

## 3. Conectar el sitio

Copiar `.env.example` a `.env.local`, dejando la URL indicada y completando `VITE_SUPABASE_PUBLISHABLE_KEY` con la **Publishable key** (`sb_publishable_...`) o la antigua clave **anon** del proyecto. Nunca usar `secret`, `service_role`, contraseña de base ni token personal. `.env.local` está excluido de Git.

Reiniciar el servidor Vite:

```powershell
npm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Abrir `/PanelDEA` e ingresar con la cuenta oficial. Sin clave configurada, `/MapaDEA` permite explorar una copia local de los 437 puntos y muestra claramente ese estado; el panel no simula guardados.

## Funciones y comprobación

El inicio solicita permiso de ubicación una sola vez durante la visita y muestra el DEA candidato más cercano. La ubicación se conserva únicamente en memoria al navegar entre el inicio y el mapa; no se incorpora a la URL ni se guarda en el navegador. El botón de detalle incluye el identificador público del DEA y el modo de transporte y abre su ficha con la ruta calculada desde el mismo origen. Si se rechaza el permiso, se puede consultar el mapa o elegir un origen manual; la web no repite automáticamente la solicitud al volver al inicio.

- Crear y editar DEA, elegir coordenadas en el mapa, completar acceso/horarios/disponibilidad y verificar con fecha.
- Publicar o mantener borradores; archivar y restaurar como borrador. No hay borrado definitivo desde el cliente.
- Importar KMZ/KML con revisión de descartados, detección de duplicados y publicación opcional; exportar JSON y consultar historial.
- Mapa OpenStreetMap/Leaflet, búsqueda, filtros, ubicación opcional y orden por distancia en línea recta. Se excluyen de la búsqueda del más cercano los puntos informados fuera de servicio o con acceso restringido. Los puntos sin confirmar pueden ser candidatos y se identifican como tales.
- Ruta dibujada en el mapa, tiempo estimado, distancia e indicaciones en español, con elección entre auto y caminata. Usa Valhalla/FOSSGIS sobre OpenStreetMap y compara el tiempo de los recorridos devueltos; no incluye tráfico en vivo. El DEA más cercano se elige por distancia en línea recta; no se compara el tiempo de viaje a todos los DEA.
- Ubicación opcional por permiso del navegador o punto de partida manual elegido en el mapa. Para calcular la ruta, las coordenadas de origen y destino se envían al proveedor; GRCP no las guarda en la base ni en el almacenamiento local. La navegación externa en Google Maps incluye el origen si se eligió.
- Si el proveedor no devuelve una ruta, el sitio muestra un error y permite reintentar o continuar con las indicaciones externas.
- Cambios del panel se consultan al cargar o recargar el mapa público; no usa suscripción en tiempo real.

Después de configurar: comprobar en una ventana privada que el público ve publicados pero no borradores; crear un registro de prueba, editarlo, consultar su historial, publicarlo, archivarlo y restaurarlo; probar recuperación de contraseña con el correo oficial.

Las pruebas locales ejecutan estos SQL en PostgreSQL con PGlite y verifican permisos, auditoría, restricciones y carga repetible. No sustituyen la comprobación final de Authentication/email en el proyecto:

```powershell
npm run test:dea
npm run build
```

`npm run dea:sql` regenera los dos SQL desde la migración y `dea-import.json`. `npm run dea:convert -- "ruta\archivo.kmz"` reconvierte un archivo fuente; revisar el reporte antes de regenerar SQL.

Las teselas públicas de OpenStreetMap requieren atribución y cumplimiento de su [política de uso](https://operations.osmfoundation.org/policies/tiles/). Para tráfico sostenido se puede configurar un proveedor compatible en `VITE_MAP_TILE_URL`, conservando la atribución correspondiente.

El endpoint de rutas público de FOSSGIS es un servicio de demostración, sin garantía de disponibilidad. `VITE_ROUTING_URL` permite sustituirlo por un servicio Valhalla propio o gestionado con CORS habilitado. Si el nuevo proveedor requiere claves privadas, usar un backend; nunca colocarlas en variables `VITE_`.

Para publicar en Vercel, configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en el entorno Production del proyecto y volver a desplegar. El archivo `.env.local` no se sube al repositorio. Autorizar también `https://grcp-arg.com/PanelDEA` como URL de recuperación en Supabase Authentication.

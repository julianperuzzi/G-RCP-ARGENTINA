# Portal institucional GRCP

Proyecto destino: **tfueuppotcanagvgxpca** · https://tfueuppotcanagvgxpca.supabase.co.

**Activado el 7 de octubre de 2026** en este proyecto: SQL `03`, bucket privado, función `grcp-invite` (versión 1) y configuración de Auth. El sitio está publicado en https://grcp-arg.com/Portal. **No volver a ejecutar `03` en este proyecto.** La instalación no modifica las tablas del mapa DEA ni publica inventarios institucionales.

**Estado del correo por verificar.** Esta guía registró que el propietario verificó `grcp-arg.com` en Resend y que faltaba comprobar una invitación real. Hay notas posteriores que indican que SMTP pudo haberse activado. Antes de invitar a otra institución, revisar la configuración actual en Supabase y comprobar la recepción, aceptación y recuperación de contraseña con una cuenta de prueba. No inferir el estado de producción a partir de esta guía.

## Mapa de instituciones

`/Portal/mapa` es una vista exclusiva de GRCP con todas las instituciones y sus sedes no archivadas. Permite buscar, mostrar pendientes de ubicar, abrir la ficha, editar la ubicación y abrir indicaciones externas. Las instituciones pausadas se identifican en la lista. Usa Leaflet/OpenStreetMap; no publica datos en el mapa DEA público.

Los formularios de institución y sede permiten tocar el mapa, arrastrar el marcador o ingresar latitud/longitud. La dirección escrita no geocodifica automáticamente. Si se quita la ubicación, se borran ambas coordenadas. La base valida rangos y pares completos, conserva RLS y registra cambios en la auditoría.

La migración `20261007044329_portal_institution_locations.sql` **ya se aplicó en producción** el 7 de octubre de 2026. Para un entorno nuevo, ejecutar después de `03-instalar-portal.sql`. No repetir en el proyecto actual.

## Tesorería interna GRCP

`/Portal/tesoreria` permite registrar fondos (caja, banco y billetera), obligaciones por cobrar o pagar, cobros y gastos, transferencias entre fondos, comprobantes y un historial de cambios. Admite ARS y USD en libros separados. Si no hay un fondo activo en la moneda elegida, el botón de movimiento guía a crearlo y luego abre el formulario de movimiento. En «Cobros y pagos», cada registro se muestra como «Por cobrar/Cobrado» o «Por pagar/Pagado». El estado saldado se calcula a partir de los movimientos vigentes; se puede elegir al crear el registro o usar «Marcar como cobrado/pagado» después. En ambos casos se selecciona un fondo y se registra el importe completo o el saldo restante; también se admiten pagos parciales. Anular el movimiento devuelve el registro a pendiente si corresponde. La categoría se elige de una lista o se escribe como personalizada. Al crear o editar un registro se puede adjuntar un comprobante o documento; luego se pueden añadir más desde la lista. Las imágenes JPG/PNG de más de 1 MB se optimizan en el navegador cuando el resultado pesa menos; los PDF se conservan originales y el archivo final no puede superar 10 MB. No inicia transferencias bancarias, no recibe pagos en línea y no emite facturas fiscales. Los importes de cobros y pagos se pueden corregir desde su ficha. La corrección de un movimiento anula el asiento original y crea su reemplazo en una sola transacción, con motivo, vínculo e historial; la corrección del importe total no puede quedar por debajo de los cobros o pagos vigentes. Las fichas permiten abrir registros y previsualizar PDF/JPG/PNG privados desde los documentos asociados. Los importes se guardan en centavos enteros.

**Migración de corrección aplicada en el proyecto remoto:** `supabase/migrations/20261007191433_grcp_finance_amount_corrections.sql`. La función de corrección se comprobó en el esquema remoto el 8 de octubre de 2026; falta probar un ciclo real desde la interfaz con comprobante.

**Migración aplicada por el propietario el 7 de octubre de 2026:** `supabase/migrations/20261007165719_grcp_finance_wallet.sql`. Es adicional al portal ya instalado; no volver a ejecutar `03` ni esta migración en el proyecto actual. Se comprobó desde el proyecto remoto que las cinco tablas financieras existen y rechazan consultas sin sesión con `42501`; la sesión GRCP carga `/Portal/tesoreria` sin error. La migración crea RLS exclusivo para GRCP, auditoría y el bucket privado `grcp-finanzas` para PDF/JPG/PNG de hasta 10 MB. La escritura y descarga remotas de comprobantes aún no se probaron con registros reales.

Antes de registrar finanzas reales, probar con GRCP un fondo controlado, un pendiente, un cobro parcial, una transferencia, una anulación y un comprobante. Confirmar con una cuenta institucional que no ve `/Portal/tesoreria` ni puede leer `portal_finance_*` o el bucket. Retirar los datos de prueba mediante anulaciones/cancelaciones; los asientos y su auditoría se conservan. Las pruebas locales `npm run test:portal` ejecutan la migración con PostgreSQL/PGlite y comprueban estas reglas, pero no sustituyen la prueba remota de escritura y Storage.

DISEI SRL se registró como primera institución real con el correo responsable y el punto de Google Maps proporcionados por el propietario. No se inventaron revisiones, equipos, capacitaciones ni certificados. Comprobar en Auth y con el destinatario el estado actual de la invitación y el primer ingreso.

## Estado verificado en Supabase

- Las diez tablas tienen RLS; el bucket `grcp-instituciones` es privado y limita archivos a 10 MB.
- `gruporcpsa@gmail.com` existe con email confirmado y es el administrador general.
- Registro público e ingreso anónimo deshabilitados; proveedor email/contraseña habilitado y confirmación de email requerida.
- Site URL apunta al dominio publicado. Redirecciones de Portal autorizadas conservando las anteriores de PanelDEA.
- Prueba transaccional `04-verificar-portal.sql` ejecutada en la base real: administración, rechazo de usuarios sin membresía, revisión de equipos, repetición única de actividades, certificados y auditoría. Los registros de prueba se revirtieron.
- API comprobada: portal sin sesión devuelve 401, invitación sin sesión 401, origen ajeno 403 y preflight del portal 204. El mapa DEA público sigue respondiendo 200.
- La función de invitaciones figura ACTIVE. Su validación de sesión se realiza dentro de la función.
- El asesor de seguridad no reportó problemas de tablas/RLS del portal. Reportó la protección de contraseñas filtradas deshabilitada; esa característica requiere [Pro o superior](https://supabase.com/docs/guides/auth/password-security). No se cambió el plan.
- La comprobación remota no sustituye la prueba de recepción de correos y descarga real de un certificado con una cuenta institucional; hacerlas al habilitar SMTP y crear el primer acceso de prueba.

## Verificar el correo institucional

Una opción compatible es [Resend con Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp). Requiere una cuenta del propietario y validar un dominio de envío mediante sus registros DNS. No usar un remitente `@gmail.com` con un dominio que no se controla.

1. Cuenta Resend y dominio `grcp-arg.com`: verificados por el propietario.
2. En Supabase → Authentication → Email → SMTP Settings, comprobar los datos SMTP y el nombre de remitente `GRCP Argentina`; cargarlos si faltan.
3. Ingresar las credenciales directamente en Supabase; nunca agregarlas al repositorio, a variables `VITE_` ni al chat. `config.toml` no declara SMTP y no sobrescribe esa configuración.
4. Autorizar y enviar una invitación de prueba a un correo controlado por GRCP, completar el enlace y comprobar recuperación de contraseña. Después probar un acceso institucional y sus archivos privados.

Datos para Resend: host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña = API key con permiso de envío sobre el dominio verificado; remitente propuesto `GRCP Argentina <accesos@grcp-arg.com>`. La clave puede prepararse en `.env.smtp.local` (ignorado por Git), nunca en el código público. Las plantillas en español están en `supabase/templates/`; Supabase permite aplicarlas una vez habilitado SMTP propio. El intento previo con el proveedor predeterminado fue rechazado y no se da por desplegado.

El servicio de correo predeterminado de Supabase solo envía a miembros autorizados del equipo del proyecto; no sirve para incorporar instituciones externas. [Documentación de SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## Instalación de referencia para un entorno nuevo

1. Abrir el SQL Editor de ese proyecto y ejecutar **`03-instalar-portal.sql` una sola vez**. Incluye tablas, índices, permisos por institución, historial y bucket privado. No volver a ejecutar `01` ni `02` si el registro DEA ya funciona. La instalación es transaccional: si falla, se revierte y se puede corregir/reintentar.
2. Mantener `gruporcpsa@gmail.com` como usuario Auth confirmado. Es el único administrador general; esta regla se verifica en la base, no por un rol asignado desde el navegador.
3. En Authentication → URL Configuration, permitir `https://grcp-arg.com/Portal`, `http://localhost:3001/Portal` y `http://127.0.0.1:3001/Portal`. Mantener las URLs de `/PanelDEA`. Site URL en producción: `https://grcp-arg.com`.
4. Mantener email/contraseña y confirmación de email. Mantener deshabilitado el registro público y el inicio anónimo. Los usuarios institucionales se crean por GRCP con Auth; no se insertan contraseñas mediante SQL.
5. Ingresar a `/Portal` con GRCP, crear una institución y sus sedes. Abrir **Accesos**, asignar el correo de su responsable y elegir `Responsable` o `Consulta`.

La asignación usa el email **confirmado y actual** de Auth. Si se deshabilita el acceso, se pausa o archiva la institución, sus usuarios dejan de acceder mediante las políticas de la base. El mismo responsable puede pertenecer a más de una institución, cada una con su permiso. No hay acceso de alumnos individual en esta versión: los responsables y usuarios de consulta ven los documentos de toda su institución.

## Invitar usuarios

Dos opciones:

**Desde Supabase, sin desplegar funciones:** Authentication → Users → Invite user. Usar el correo asignado en Accesos. Configurar la redirección de invitación a `/Portal`; si la invitación de Studio utiliza Site URL sin una ruta específica, autorizar el enlace y abrir `/Portal` al llegar. El portal reconoce el enlace `type=invite` y permite elegir una contraseña. También se puede crear una cuenta confirmada desde Auth y entregar el acceso por el canal habitual de GRCP; nunca compartir la contraseña del administrador.

**Desde el panel:** la función incluida `supabase/functions/grcp-invite/index.ts` ya está desplegada en **ese proyecto**. La función valida el token con `getUser` y consulta `get_portal_context` antes de utilizar la clave de servicio. No permite que una institución invite usuarios ni asigna roles desde metadata. Comprobar SMTP y la entrega real antes de usarla con más instituciones.

Si utilizás CLI, autenticala en tu cuenta correcta, verificá el proyecto y ejecutá:

```powershell
npx supabase functions deploy grcp-invite --project-ref tfueuppotcanagvgxpca --use-api
```

`supabase/config.toml` desactiva la verificación JWT del gateway para esta función; **la función verifica la sesión y la autorización explícitamente**. `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` son variables del runtime de Supabase, nunca variables `VITE_`. El destino por defecto de los enlaces es `https://grcp-arg.com/Portal`. Se puede configurar `GRCP_PORTAL_URL` como secreto de la función para otro dominio autorizado.

Configurar SMTP propio en Supabase para invitaciones y recuperación en producción y verificar sus límites de correo. El botón de invitación informa errores de envío; asignar el correo no garantiza entrega. Las cuentas existentes pueden ingresar o recuperar su contraseña desde el portal.

## Funcionamiento

- **GRCP:** administra instituciones, sedes, accesos, equipamiento, actividades, asistencia, revisiones, documentos y respuestas a solicitudes.
- **Responsable institucional:** consulta su información, descarga documentos, exporta el calendario/CSV y crea solicitudes. No certifica equipos ni modifica certificados emitidos.
- **Consulta:** accede a información y documentos; no crea solicitudes.
- **Separación de datos:** cada institución solo consulta sus propias sedes, equipos, capacitaciones, participantes, revisiones, documentos y solicitudes. Un responsable tampoco puede crear instituciones, capacitaciones ni modificar registros de GRCP aunque invoque la API directamente. La tesorería, los accesos y el historial global pertenecen únicamente a GRCP. La interfaz consulta por los identificadores de institución asignados y las políticas RLS de la base vuelven a comprobar cada lectura y escritura.
- **Calendario:** vista mensual y agenda. Al completar una actividad con repetición, la base genera una única próxima actividad, con meses civiles en Argentina y ajuste al fin de mes. No se crean futuras instancias por el simple paso del tiempo. Cancelar no genera la siguiente. Una fecha vencida no equivale a una revisión realizada.
- **Equipamiento:** DEA, botiquines, kits de trauma y férulas, camilla rígida, oxígeno, resucitador manual, silla de evacuación, salidas, extintores y otros elementos. Vencimientos de batería/electrodos, vencimiento general y próxima revisión. Cada equipo ofrece acciones para registrar una revisión y adjuntar fotos, manuales u otros PDF/JPG/PNG privados; las fotos aparecen en su ficha y se pueden previsualizar. Se admiten hasta ocho archivos al crear un equipo y más desde su ficha. Las imágenes grandes se comprimen antes de guardarse; el archivo final no puede superar 10 MB. Los insumos de botiquín se describen en observaciones; todavía no hay inventario individual por insumo.
- **Migración de adjuntos de equipamiento aplicada en el proyecto remoto:** `supabase/migrations/20261008142346_portal_equipment_media.sql`. Amplía los tipos de equipo, vincula los documentos al equipo con una clave de institución y habilita fotos y manuales. La columna de adjuntos se comprobó en el esquema remoto el 8 de octubre de 2026; falta probar una carga real desde la interfaz.
- **Perfiles y operadores:** `20261008150143_portal_staff_profiles_usage.sql` agrega el perfil personal (nombre y teléfono), operadores GRCP invitados por la cuenta principal y métricas agregadas por institución. La cuenta principal conserva Tesorería, Accesos, gestión DEA y administración de operadores. Los operadores confirmados y activos gestionan registros institucionales; al deshabilitarlos pierden acceso inmediatamente. Los perfiles personales son privados de cada usuario. Esta migración y la función `grcp-invite` actualizada se aplicaron al proyecto remoto el 8 de octubre de 2026; falta validar un operador invitado real.
- **Métricas de uso:** cuentan accesos institucionales asignados, último ingreso conocido, personas activas y usos de módulos en los últimos 30 días, equipos, revisiones, actividades, documentos, espacio de archivos y solicitudes abiertas. Una persona suma como máximo un uso por módulo y día; solo se registran aperturas de módulos institucionales, nunca del perfil personal. No miden descargas, duración de sesiones ni pagos. La función SQL exige permiso GRCP incluso cuando se invoca directamente por API.
- **Revisiones:** historial sin edición/borrado desde el cliente. Resultado, checklist configurable, observaciones, responsable y próxima fecha. Se pueden adjuntar fotos o PDF como evidencia y crear un seguimiento si el resultado requiere atención. Registrar una revisión actualiza el estado del equipo; una revisión histórica anterior no reemplaza el último resultado. Corregir mediante una nueva revisión documentada.
- **Capacitaciones:** participantes, asistencia individual o por lote, aviso de participantes posiblemente duplicados y acceso directo a certificados. La carga de un certificado exige una capacitación realizada y un participante con asistencia registrada. Para corregir el nombre o retirar la asistencia de alguien con certificado activo, primero se archiva ese documento; también se protege el estado de la capacitación asociada. No genera ni firma certificados automáticamente: se adjunta el PDF emitido por GRCP.
- **Documentos:** PDF/JPG/PNG hasta 10 MB; bucket privado, descarga autenticada, filtros de vencimiento y enlace al registro de origen. La acción **Nueva versión** carga el archivo nuevo, incrementa la versión y archiva el anterior; si falla el archivado después de la carga, el portal informa el estado parcial para que GRCP revise ambos registros. Los archivos emitidos se conservan; no se sobrescriben ni se borran desde el portal. Archivar un documento corta nuevas descargas institucionales. Una descarga ya realizada no puede revocarse.
- **Solicitudes:** capacitación, revisión, simulacro, consulta o incidencia. GRCP registra respuesta y estado; resolver requiere respuesta.
- **Trazabilidad:** historial automático de cambios accesible solo a GRCP. Los archivados se pueden restaurar.
- **Exportaciones:** CSV de los registros filtrados y calendario ICS para importar en otra agenda. Son archivos estáticos, sin sincronización automática. CSV neutraliza fórmulas de texto ingresado.
- **Alertas:** avisos dentro del portal sobre fechas vencidas o próximas (30 días) y solicitudes pendientes. **No hay envío automático de recordatorios por email/WhatsApp**, facturación, QR público ni cobro de suscripciones en esta versión.
- **Fichas:** los detalles tienen enlaces copiables y los formularios avisan antes de descartar cambios. Los errores de validación conocidos se muestran junto al campo.
- **Accesos y DEA:** la migración `20261007194929_grcp_portal_access_status_and_dea_evidence.sql` añade seguimiento de invitaciones, último ingreso y archivos privados de verificación DEA. Aplicarla antes de desplegar de nuevo `grcp-invite`; el panel muestra un estado reducido mientras falte la migración. El mapa de gestión DEA permite enlazar una ficha y avisa sobre ubicaciones posiblemente duplicadas.

## Demostración

`http://localhost:3001/Portal?demo=1` usa instituciones y personas ficticias. Permite explorar como GRCP o como responsable y probar formularios en memoria. Nunca carga esos registros en Supabase, no envía invitaciones y se reinicia al recargar o salir. El archivo de certificado inicial es solo una referencia visual; los archivos subidos durante la demostración sí se pueden descargar mientras dure la visita.

La web pública, mapa DEA y metronómo continúan en sus rutas. El portal tiene navegación propia y no ejecuta Analytics/Speed Insights sobre sus páginas.

## Verificación antes de incorporar instituciones reales

```powershell
npm run test:portal
npm run test:dea
npm run test:rcp
npm run build
```

Las pruebas ejecutan el SQL real con PostgreSQL/PGlite y roles simulados de Supabase; verifican RLS, archivos privados, referencias entre instituciones, revisiones, repetición, auditoría y conservación de los permisos DEA. No prueban el servicio remoto Auth, SMTP ni transferencia real de Storage.

Para repetir la prueba transaccional remota sin guardar registros:

```powershell
npx supabase db query --linked --project-ref tfueuppotcanagvgxpca --file supabase/04-verificar-portal.sql
```

`config.toml` conserva solo opciones que gestionamos explícitamente. `auth.enable_signup = false` cierra el registro; `auth.email.enable_signup = true` mantiene habilitado el proveedor email en el proyecto remoto. Antes de volver a aplicar configuración, ejecutar `npx supabase config diff --project-ref tfueuppotcanagvgxpca` y revisar las diferencias.

Después de instalar, probar con dos instituciones de prueba y dos cuentas confirmadas: iniciar sesión, leer solo sus datos, crear una solicitud, registrar revisión como GRCP, marcar asistencia y descargar un certificado. Deshabilitar un acceso y verificar que pierde acceso; revisar también en una ventana sin sesión. Probar invitación y recuperación por correo, carga fallida y carga correcta de archivo. Retirar o archivar los registros de prueba cuando termine la comprobación.

Documentación oficial: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage privado](https://supabase.com/docs/guides/storage/security/access-control), [invitaciones](https://supabase.com/docs/reference/javascript/auth-admin-inviteuserbyemail).

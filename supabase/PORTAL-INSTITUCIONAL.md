# Portal institucional GRCP

Proyecto destino: **tfueuppotcanagvgxpca** · https://tfueuppotcanagvgxpca.supabase.co.

**Activado el 7 de octubre de 2026** en este proyecto: SQL `03`, bucket privado, función `grcp-invite` (versión 1) y configuración de Auth. El sitio está publicado en https://grcp-arg.com/Portal. **No volver a ejecutar `03` en este proyecto.** La instalación no modifica las tablas del mapa DEA ni publica inventarios institucionales.

**Pendiente: proveedor SMTP.** El propietario confirmó que todavía no tiene uno. La administración y el ingreso de cuentas existentes están disponibles; las invitaciones y recuperaciones para correos externos no están listas para producción. No se enviaron correos ni se crearon cuentas de prueba.

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

## Habilitar correo institucional

Una opción compatible es [Resend con Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp). Requiere una cuenta del propietario y validar un dominio de envío mediante sus registros DNS. No usar un remitente `@gmail.com` con un dominio que no se controla.

1. Crear la cuenta del proveedor y verificar el dominio de envío de GRCP.
2. En Supabase → Authentication → Email → SMTP Settings, cargar los datos SMTP que entregue el proveedor y elegir el nombre de remitente `GRCP Argentina`.
3. Ingresar las credenciales directamente en Supabase; nunca agregarlas al repositorio, a variables `VITE_` ni al chat. `config.toml` no declara SMTP y no sobrescribe esa configuración.
4. Autorizar y enviar una invitación de prueba a un correo controlado por GRCP, completar el enlace y comprobar recuperación de contraseña. Después probar un acceso institucional y sus archivos privados.

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

**Desde el panel:** la función incluida `supabase/functions/grcp-invite/index.ts` ya está desplegada en **ese proyecto**. La función valida el token con `getUser` y consulta `get_portal_context` antes de utilizar la clave de servicio. No permite que una institución invite usuarios ni asigna roles desde metadata. El envío a instituciones requiere completar SMTP.

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
- **Calendario:** vista mensual y agenda. Al completar una actividad con repetición, la base genera una única próxima actividad, con meses civiles en Argentina y ajuste al fin de mes. No se crean futuras instancias por el simple paso del tiempo. Cancelar no genera la siguiente. Una fecha vencida no equivale a una revisión realizada.
- **Equipamiento:** DEA, botiquines, salidas, extintores y otros elementos. Vencimientos de batería/electrodos, vencimiento general y próxima revisión. Los insumos de botiquín se describen en observaciones; todavía no hay inventario individual por insumo.
- **Revisiones:** historial sin edición/borrado desde el cliente. Resultado, checklist configurable, observaciones, responsable y próxima fecha. Registrar una revisión actualiza el estado del equipo; una revisión histórica anterior no reemplaza el último resultado. Corregir mediante una nueva revisión documentada.
- **Capacitaciones:** participantes y asistencia. La carga de un certificado exige una capacitación realizada y un participante con asistencia registrada. Para corregir el nombre o retirar la asistencia de alguien con certificado activo, primero se archiva ese documento; también se protege el estado de la capacitación asociada. No genera ni firma certificados automáticamente: se adjunta el PDF emitido por GRCP.
- **Documentos:** PDF/JPG/PNG hasta 10 MB; bucket privado, descarga autenticada. Archivar un documento corta nuevas descargas institucionales. Los archivos emitidos se conservan; no se sobrescriben ni se borran desde el portal. Para sustituir uno, archivar y cargar una nueva versión. Una descarga ya realizada no puede revocarse.
- **Solicitudes:** capacitación, revisión, simulacro, consulta o incidencia. GRCP registra respuesta y estado; resolver requiere respuesta.
- **Trazabilidad:** historial automático de cambios accesible solo a GRCP. Los archivados se pueden restaurar.
- **Exportaciones:** CSV de los registros filtrados y calendario ICS para importar en otra agenda. Son archivos estáticos, sin sincronización automática. CSV neutraliza fórmulas de texto ingresado.
- **Alertas:** avisos dentro del portal sobre fechas vencidas o próximas (30 días) y solicitudes pendientes. **No hay envío automático de recordatorios por email/WhatsApp**, facturación, QR público ni cobro de suscripciones en esta versión.

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

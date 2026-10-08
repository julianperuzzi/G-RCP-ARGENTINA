# Lanzamiento del portal por invitación

El primer lanzamiento ofrece acceso institucional gestionado por GRCP. GRCP crea la institución, asigna los correos y envía las invitaciones. No hay registro público ni cobro de suscripciones en línea.

## Estado comprobado en el repositorio

- Frontend, portal privado y gestión DEA compilan con Node.js 24.
- Lint, pruebas de portal/RLS, DEA y RCP pasan. La auditoría de dependencias de producción no reporta vulnerabilidades.
- El panel DEA muestra mapa y lista en paralelo en escritorio; permite seleccionar un registro para editarlo y marcar una nueva ubicación desde el mapa.
- La demostración del portal usa datos ficticios y no escribe en Supabase.
- La tesorería interna de GRCP tiene interfaz, migración y pruebas locales. El propietario aplicó la migración financiera; las cinco tablas remotas rechazan solicitudes sin sesión y la sesión GRCP abre la pantalla.
- Las fichas de tesorería muestran movimientos y comprobantes con vista previa. La migración `20261007191433_grcp_finance_amount_corrections.sql` permite corregir importes con auditoría y está aplicada en el proyecto remoto.
- La migración `20261007194929_grcp_portal_access_status_and_dea_evidence.sql` añade estado de invitación, último ingreso y evidencias privadas de verificación DEA. Está aplicada en el proyecto remoto y `grcp-invite` versión 2 figura activa.
- Equipamiento, revisiones, capacitaciones y documentos tienen accesos rápidos a tareas relacionadas; los detalles tienen enlaces copiables, los formularios avisan sobre cambios sin guardar y los documentos pueden reemplazarse por una versión nueva.
- Perfil personal, operadores GRCP y métricas por institución están implementados y probados localmente. La cuenta principal invita y deshabilita operadores; las reglas de la base impiden que estos accedan a Tesorería, Accesos, DEA y altas de operadores. La migración `20261008150143_portal_staff_profiles_usage.sql` está aplicada en el proyecto remoto y la función `grcp-invite` actualizada figura activa. Falta una prueba de invitación y uso con cuentas reales.
- La tienda interpreta “Sin Stock” y “Disponible” de la hoja, bloquea los productos agotados y ofrece reintento si falla el catálogo. Los historiales institucional y financiero cargan páginas sucesivas con orden estable. La portada solicita ubicación solo tras una acción explícita. Las vistas públicas señaladas por QA tienen `h1` y el carrito, el detalle de producto y la galería admiten cierre con Escape y control de foco.
- Una petición pública sin sesión a `portal_institutions`, `portal_activities`, `portal_memberships`, `portal_documents`, tesorería y auditoría recibió HTTP 401 del proyecto remoto el 8 de octubre de 2026. Esto comprueba el acceso anónimo, no la separación entre cuentas institucionales.

Estas comprobaciones no acreditan que un correo se entregue, que la versión desplegada coincida con este árbol de trabajo, ni que una cuenta institucional pueda descargar archivos reales.

El asesor de seguridad remoto de Supabase informó dos funciones `SECURITY DEFINER` públicas ejecutables por usuarios autenticados. Son llamadas deliberadas con comprobaciones de rol y de institución en el cuerpo; los casos locales de permisos las cubren. También informó que la protección frente a contraseñas filtradas está desactivada. Esa opción requiere plan Pro o superior según [la documentación de Supabase](https://supabase.com/docs/guides/auth/password-security), por lo que se debe verificar el plan antes de activarla.

## Antes de incorporar más instituciones

1. Verificar en Supabase la configuración SMTP actual y enviar una invitación a un correo de prueba controlado por GRCP. Completar el enlace y probar recuperación de contraseña. La documentación histórica del proyecto muestra estados distintos de SMTP; consultar la configuración y entrega reales antes de darlo por operativo.
2. Con dos instituciones de prueba y cuentas distintas, confirmar que cada responsable solo ve su institución, puede crear solicitudes y descargar únicamente sus documentos. Confirmar que una cuenta sin sesión no ve datos privados y que revocar acceso o pausar la institución corta el acceso.
3. Probar desde el sitio publicado la carga y descarga de un PDF y un archivo rechazado por tipo o tamaño. Registrar capacitación, asistencia y certificado de prueba; comprobar que solo el destinatario autorizado puede descargarlo.
4. Confirmar que el dominio publicado sirve la versión validada, que las redirecciones de Auth vuelven a `/Portal` y que `/PanelDEA` mantiene el acceso exclusivo de GRCP. Revisar el mapa DEA público y el panel en escritorio y móvil.
5. Configurar monitoreo de errores, disponibilidad y límites de correo. Definir responsable de atención a instituciones y canal para incidencias.
6. Documentar una copia de seguridad y ejecutar una restauración de prueba del proyecto antes de cargar datos que no se puedan reconstruir fácilmente. Definir frecuencia y responsable.
7. Revisar los textos institucionales, privacidad y condiciones de uso con quienes correspondan antes de ofrecer el servicio. Establecer qué datos se cargarán y cuánto tiempo se conservarán.
8. Antes de registrar finanzas reales, probar un ciclo completo de alta, cobro parcial, anulación, carga y descarga de comprobante con GRCP; comprobar RLS y el bucket privado con una cuenta institucional; y verificar respaldo/restauración de los datos financieros. La migración `20261007165719_grcp_finance_wallet.sql` ya figura aplicada por el propietario.
9. El 8 de octubre se comprobó que las migraciones de corrección financiera y equipamiento ya estaban aplicadas; se aplicaron las de invitaciones/evidencia DEA y perfiles/operadores/métricas, y se desplegó `grcp-invite`. El proyecto no tiene historial `supabase_migrations.schema_migrations` porque las migraciones se han instalado por SQL; no ejecutar `db push` sin conciliar ese historial. Comprobar invitaciones, perfil, métricas y adjuntos desde cuentas reales.
10. Con cuentas institucionales reales de dos organizaciones distintas, comprobar en el proyecto remoto que cada una ve solo sus datos y documentos, no recibe tesorería ni módulos de gestión GRCP y no puede crear una capacitación ni una institución mediante la API. La revisión local usa las políticas SQL del repositorio, pero no sustituye esta comprobación del esquema remoto aplicado.

El punto 1 y la prueba de extremo a extremo del punto 2 necesitan acceso autorizado a la configuración remota y cuentas de prueba. No deben darse por aprobados solo porque pasan las pruebas locales.

## Control de cada cambio

La acción [verify.yml](.github/workflows/verify.yml) ejecuta instalación reproducible, lint, pruebas de portal, DEA, RCP y tienda, build y auditoría de dependencias de producción. Antes de desplegar, revisar su resultado y repetir en el sitio publicado las rutas `/Portal`, `/Portal/mapa`, `/Portal/tesoreria`, `/PanelDEA`, `/MapaDEA` y `/shop`.

Las dependencias de desarrollo de Tailwind 3 aún reciben avisos de seguridad transitivos en `npm audit` completo. La compilación usa esas herramientas; el código publicado no las instala. Una migración a Tailwind 4 requiere revisar estilos y probar visualmente toda la web antes de adoptarla.

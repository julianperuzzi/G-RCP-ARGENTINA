# GRCP Argentina

Web de capacitación y preparación ante emergencias. React, Vite, OpenStreetMap y Supabase. Node.js 24.

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Configurar `.env.local` con las variables públicas indicadas en `.env.example`. Nunca incluir claves de servicio en el frontend.

Para cambiar de computadora, seguir [Continuar en otra PC](CONTINUAR-EN-OTRA-PC.md): clonación, variables locales y sincronización de cambios.

- `/MapaDEA`: mapa público, búsqueda del DEA cercano e indicaciones.
- `/PanelDEA`: gestión exclusiva de la cuenta GRCP, con mapa siempre visible a la izquierda y listado a la derecha. Desde el mapa se puede seleccionar un DEA para editarlo o marcar un punto nuevo para darlo de alta.
- `/Practica-rcp`: metrónomo visual y sonoro para practicar con maniquí.
- `/Portal`: gestión de instituciones y acceso privado a calendarios, equipamiento, revisiones, capacitaciones, certificados y solicitudes.
- `/Portal?demo=1`: demostración con datos ficticios y cambios en memoria.
- `/Portal/mapa`: mapa privado de instituciones y sedes para GRCP.
- `/Portal/tesoreria`: tesorería privada de GRCP para fondos, cobros, pagos, compromisos y comprobantes; sin procesamiento de pagos en línea.

Instalación y configuración del [registro DEA](supabase/README.md) y del [portal institucional](supabase/PORTAL-INSTITUCIONAL.md). La ampliación del portal utiliza `supabase/03-instalar-portal.sql`; la tesorería requiere además la migración `supabase/migrations/20261007165719_grcp_finance_wallet.sql`. No reinstalar las tablas DEA existentes.

```powershell
npm run test:dea
npm run test:rcp
npm run test:portal
npm run lint
npm run build
npm audit --omit=dev --audit-level=moderate
```

El primer lanzamiento del portal está pensado para instituciones invitadas por GRCP. La verificación automática del repositorio repite estas comprobaciones en cada push y pull request. Ver [preparación del lanzamiento](LANZAMIENTO-PORTAL.md) para las pruebas con cuentas reales y tareas operativas.

El portal, Auth, Storage y la función de invitaciones ya están instalados en el proyecto GRCP. No reinstalar los SQL al cambiar de PC. El estado remoto de SMTP debe comprobarse antes de enviar nuevas invitaciones; consultar la guía del portal. Los recordatorios automáticos por correo y la facturación todavía no están implementados.

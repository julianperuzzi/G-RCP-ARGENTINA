# GRCP Argentina

Web de capacitación y preparación ante emergencias. React, Vite, OpenStreetMap y Supabase. Node.js 24.

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Configurar `.env.local` con las variables públicas indicadas en `.env.example`. Nunca incluir claves de servicio en el frontend.

- `/MapaDEA`: mapa público, búsqueda del DEA cercano e indicaciones.
- `/PanelDEA`: gestión exclusiva de la cuenta GRCP.
- `/Practica-rcp`: metrónomo visual y sonoro para practicar con maniquí.
- `/Portal`: gestión de instituciones y acceso privado a calendarios, equipamiento, revisiones, capacitaciones, certificados y solicitudes.
- `/Portal?demo=1`: demostración con datos ficticios y cambios en memoria.

Instalación y configuración del [registro DEA](supabase/README.md) y del [portal institucional](supabase/PORTAL-INSTITUCIONAL.md). La ampliación del portal utiliza `supabase/03-instalar-portal.sql`; no reinstalar las tablas DEA existentes.

```powershell
npm run test:dea
npm run test:rcp
npm run test:portal
npm run build
```

El portal requiere ejecutar el SQL en el proyecto correcto y configurar Auth/Storage antes de incorporar instituciones reales. El envío de invitaciones desde el panel requiere desplegar la función incluida; también se pueden crear las cuentas desde Supabase Auth. Los recordatorios automáticos por correo y la facturación todavía no están implementados.

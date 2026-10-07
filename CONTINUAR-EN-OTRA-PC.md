# Continuar GRCP en otra PC

El código está en GitHub; el sitio publicado, en Vercel; y los datos y usuarios, en Supabase. Cambiar de PC no requiere copiar ni recrear la base de datos.

## Primera preparación

1. Instalar Git y **Node.js 24.x** (incluye npm).
2. Abrir una terminal en la carpeta donde se guardan los proyectos y ejecutar:

```powershell
git clone https://github.com/julianperuzzi/G-RCP-ARGENTINA.git
cd G-RCP-ARGENTINA
git switch main
npm ci
Copy-Item .env.example .env.local
```

3. Completar `VITE_SUPABASE_PUBLISHABLE_KEY` en `.env.local` con la misma clave pública de la PC anterior o la del proyecto GRCP en Supabase. También se puede copiar directamente el `.env.local` de la PC anterior. La URL ya está en `.env.example`:

```text
https://tfueuppotcanagvgxpca.supabase.co
```

Usar una clave **publishable/anon**; nunca `service_role`, una clave secreta de Supabase ni una API key de Resend en una variable `VITE_`.

4. Levantar la web:

```powershell
npm run dev -- --host 127.0.0.1 --port 3001 --strictPort
```

Abrir http://localhost:3001. El portal está en `/Portal` y el mapa privado de GRCP en `/Portal/mapa`. Para explorar sin sesión y sin guardar datos reales, usar `/Portal?demo=1`.

5. Abrir esta carpeta en el editor elegido. Para subir cambios, autenticar Git con la cuenta que tiene acceso al repositorio. No hace falta autenticarse en la CLI de Supabase para editar la interfaz o ejecutar la web.

## Al alternar entre computadoras

Antes de dejar una PC, revisar y subir el trabajo:

```powershell
git status
git diff
git add <archivos-que-cambiaste>
git commit -m "Descripción de los cambios"
git push origin main
```

En la otra PC, con el árbol de trabajo limpio:

```powershell
git pull --ff-only origin main
npm ci
```

Si `git status` muestra cambios locales, guardarlos en un commit o resolverlos antes del `pull`. No usar `reset --hard` para resolver una divergencia: puede eliminar trabajo local. Evitar editar los mismos archivos sin sincronizar primero.

Antes de publicar cambios de la aplicación:

```powershell
npm run test:portal
npm run test:dea
npm run test:rcp
npm run build
```

La integración existente de Vercel publica los commits de `main`; comprobar que el despliegue termine correctamente. `.env.local` es solo para desarrollo: las variables de producción se administran en Vercel.

## Base de datos, accesos y correo

- El proyecto Supabase correcto es **tfueuppotcanagvgxpca**. Usar siempre ese proyecto.
- Las tablas DEA, el portal y la migración de ubicaciones ya están aplicados. **No repetir los SQL de instalación ni ejecutar `db reset` o `db push` automáticamente al cambiar de PC.** El esquema existente no necesita reinstalarse.
- La cuenta GRCP es `gruporcpsa@gmail.com`. Usar su contraseña habitual; no guardarla en Git.
- DISEI SRL y su membresía existen en la base real, de modo que estarán disponibles en ambas PCs después de iniciar sesión como GRCP.
- Para tareas administrativas de base o funciones, autenticar la CLI y comprobar el proyecto antes de modificarlo:

```powershell
npx supabase login
npx supabase projects list
```

- `.env.smtp.local` contiene configuración privada de correo cuando se completa. Está excluido de Git y no hace falta para ejecutar la web. No subirlo ni copiar su contenido al chat. Una vez conectado SMTP en Supabase, el envío funciona desde el servidor sin que cada PC tenga la API key de Resend.
- La configuración, el estado de activación y las comprobaciones están en [supabase/PORTAL-INSTITUCIONAL.md](supabase/PORTAL-INSTITUCIONAL.md).

## Contexto para retomar el trabajo

Podés usar este texto como punto de partida en tu editor o asistente:

> Continuamos GRCP Argentina, React/Vite con Node 24, en la rama main. Leé README.md y supabase/PORTAL-INSTITUCIONAL.md. El sitio es https://grcp-arg.com y el Supabase correcto es tfueuppotcanagvgxpca. El portal institucional y el mapa privado están implementados y la base ya está instalada. No reinstales las tablas. Revisá git status y las instrucciones locales antes de editar. Las credenciales están fuera de Git; comprobá el estado actual de SMTP antes de enviar invitaciones.

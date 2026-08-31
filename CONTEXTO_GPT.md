# Contexto GPT - Lagarto Monitor

Repositorio: `https://github.com/oncoorch/Lagarto-Monitor`

Objetivo: aplicacion interna para centralizar enlaces, credenciales operativas cargadas desde Dockploy, monitoreo Docker y controles defensivos del VPS NICOP.

Decision importante: no se publican credenciales reales en GitHub. Los secretos se cargan en Dockploy como variables:

- `MONITOR_USERS_B64`
- `MONITOR_RESOURCES_B64`
- `MONITOR_SESSION_SECRET`
- `MONITOR_POSTGRES_PASSWORD`
- `EVOLUTION_API_KEY`

La app tiene cuatro areas:

1. `Aigents`: VPS de laboratorio activos y servicios asociados.
2. `NICOP`: servicios propios de `oncoorch.com`.
3. `Monitor`: metricas de contenedores Docker via socket de solo lectura.
4. `SOC`: controles defensivos y punto de partida para Wazuh/Fail2ban/UFW/CrowdSec.

Pendiente recomendado:

- Cargar la matriz real de recursos desde el Excel/documentacion local en `MONITOR_RESOURCES_B64`.
- Crear dominio `monitor.oncoorch.com` en Cloudflare y asociarlo en Dockploy.
- Anadir persistencia historica de metricas con Postgres.
- Integrar alertas SSH reales con un script PAM o journald watcher.

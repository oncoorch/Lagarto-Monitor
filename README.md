# Lagarto Monitor

Aplicacion interna para centralizar accesos, monitoreo y controles defensivos de los VPS NICOP y Aigents.

## Estado

Esta version inicial incluye:

- Login interno con usuarios definidos en `MONITOR_USERS_B64`.
- Menu `Aigents` y `NICOP` con servidores y servicios cargados desde `MONITOR_RESOURCES_B64`.
- Modal para copiar credenciales desde variables de entorno de Dockploy.
- Dashboard de contenedores Docker usando `/var/run/docker.sock` en modo lectura.
- Menu `SOC` con controles defensivos iniciales.
- Endpoint de prueba para alertas por Evolution API hacia WhatsApp.

## Seguridad de Credenciales

No se publican credenciales reales en este repositorio. Aunque el repositorio sea privado, los secretos deben vivir en Dockploy o en un archivo local no versionado. Para cargar accesos reales usa:

- `MONITOR_USERS_B64`: usuarios de la aplicacion.
- `MONITOR_RESOURCES_B64`: matriz de VPS, servicios y credenciales.
- `EVOLUTION_API_KEY`: clave de Evolution API para alertas.

## Desarrollo Local

```bash
npm install
npm run dev
```

## Generar Usuario

```bash
npm --silent run create-users -- admin MonitorAdmin 'cambia-esta-clave' admin
```

Pega la salida completa en Dockploy como `MONITOR_USERS_B64`.

## Despliegue en Dockploy

1. Crea una aplicacion nueva desde este repositorio.
2. Usa `compose.yml`.
3. Pega las variables de `.env.example` en Environment Settings.
4. Sustituye los valores `change_me_*`.
5. Configura el dominio recomendado: `monitor.oncoorch.com`.
6. Despliega.

## Documentacion

- [Manual de recursos](docs/resources.md)
- [Manual de seguridad](docs/security.md)
- [Ejemplo de matriz](docs/resources.example.json)

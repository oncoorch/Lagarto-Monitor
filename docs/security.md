# Seguridad y Monitoreo

Lagarto Monitor es un panel defensivo. Su objetivo es visibilidad operativa y respuesta basica ante eventos del VPS.

## Controles Iniciales

- `ssh_alerts`: notificacion de accesos SSH.
- `docker_watch`: vigilancia de contenedores, CPU, RAM y reinicios.
- `firewall`: estado esperado de UFW o reglas equivalentes.
- `fail2ban`: bloqueo de intentos repetidos de acceso.
- `wazuh`: recomendado para fase 2 como SIEM/EDR opensource.

## Alertas WhatsApp

Configura estas variables:

```bash
EVOLUTION_API_URL=https://evolution.oncoorch.com
EVOLUTION_API_KEY=change_me
ALERT_WHATSAPP_INSTANCE=NICOP USA
ALERT_WHATSAPP_NUMBER=17549715275
```

El boton `Probar alerta` valida el envio por Evolution API.

## Recomendacion de Fase 2

Para SOC/EDR/XDR real se recomienda integrar:

- Wazuh para agentes, reglas y dashboard SIEM.
- Fail2ban para SSH y reverse proxy.
- UFW o nftables para firewall local.
- CrowdSec para reputacion colaborativa de IPs.
- Grafana + Prometheus + cAdvisor para historicos de metricas.

La version inicial deja el panel y los puntos de integracion listos sin ejecutar herramientas ofensivas.

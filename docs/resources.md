# Matriz de Recursos

`MONITOR_RESOURCES_B64` contiene un JSON codificado en base64. La aplicacion lo usa para listar VPS, servicios y credenciales copiables.

## Estructura

```json
{
  "groups": [
    {
      "key": "aigents",
      "name": "Aigents",
      "servers": [
        {
          "name": "147.93.179.212 1001talleres.aigentss.com",
          "ip": "147.93.179.212",
          "hostname": "1001talleres.aigentss.com",
          "services": [
            {
              "type": "n8n",
              "name": "n8n",
              "url": "https://automation.example.com",
              "credentials": {
                "email": "admin@example.com",
                "password": "paste-in-dokploy-only"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Generar Base64

```bash
base64 -i docs/resources.example.json | tr -d '\n'
```

Pega la salida en Dockploy como `MONITOR_RESOURCES_B64`.

## Tipos Recomendados

- `chatwoot`
- `n8n`
- `evolution`
- `postgres`
- `redis`
- `supabase`
- `dockploy`
- `security`

# Lagarto-Monitor

# 🦎 Proyecto Monitor

**Monitor** es una plataforma centralizada de gestión, monitorización y ciberseguridad diseñada para administrar los VPS de Aigents (alumnos) y la infraestructura interna de Nicop. Desplegada a través de Dockploy, la aplicación unifica el acceso a servicios (n8n, Chatwoot, Postgres), visualización de métricas en tiempo real y respuesta ante incidentes (SOC/XDR) bajo una única interfaz.

---

## 🎯 Características Principales

La aplicación se divide en 4 módulos o menús principales, diseñados para agilizar la administración y auditar la seguridad de la infraestructura.

### 1. 🎓 Menú Aigents (Gestión de Alumnos)

Listado interactivo de todos los VPS activos de Contabo pertenecientes a Aigents.

* **Nomenclatura:** Ordenado por nombre exacto del VPS (ej. `147.93.2.154 venekia-aigentss-com`).
* **Submenú de Servicios:** Al hacer clic en un VPS, se despliega la lista de aplicaciones activas (Chatwoot, n8n, Postgres, etc.).
* **Acceso Directo y Credenciales:** Al seleccionar una app, un modal muestra las credenciales en texto plano (extraídas del `.env`) con un botón para **Copiar** y un botón de **Acceso Directo** a la URL del servicio.

### 2. 🏢 Menú Nicop (Gestión Interna)

Sigue exactamente la misma estructura y funcionalidad que el Menú Aigents, pero dedicado exclusivamente a los servidores y servicios propios de la infraestructura de Nicop.

### 3. 📊 Dashboard de Monitoreo (VPS Nicop)

Un panel visual avanzado (estilo Portainer/Dockploy) para supervisar la salud del servidor.

* **Métricas Docker:** Consumo de RAM de cada contenedor Docker representado con gráficos en colores *rainbow*.
* **Filtros de Tiempo:** Visualización de histórico en minutos, horas, días, semanas, meses y años.
* **Botón de Alerta Roja (Purga de Datos):** Permite limpiar la base de datos de monitoreo para liberar espacio, con opciones para conservar únicamente los últimos **7 días** o los últimos **2 meses**.
* **Gestión de Notificaciones:** Un panel de *switch* (encendido/apagado) para habilitar o silenciar las alertas de acceso a aplicaciones web (útil para apagar notificaciones cuando la web entra en producción y recibe visitas legítimas).

### 4. 🛡️ Menú Secreto de Ciberseguridad

* **Acceso Oculto:** Se activa haciendo clic en el logo del "Lagarto Monitor" y requiere autenticación de administrador.
* **Suite Open Source:** Panel de control (ON/OFF) para las herramientas de ciberseguridad desplegadas en Dockploy (SOC, XDR, Firewall, EDR, herramientas de Pentesting).
* **Gestión Centralizada:** Permite activar o desactivar escudos de seguridad en el VPS de Nicop a demanda.

---

## 🔔 Sistema de Alertas de Seguridad (WhatsApp)

Monitor está integrado con la **API de Baileys** para enviar alertas críticas en tiempo real al WhatsApp de **NICOP USA**.

**Eventos Notificados:**

* 🚨 **Accesos al VPS (SSH):** Notifica cualquier intento de acceso exitoso, incluyendo la IP de origen y su **Geolocalización**.
* 📈 **Consumo Crítico:** Alertas cuando los contenedores Docker exceden los límites de RAM o CPU.
* 🚪 **Acceso a Aplicaciones:** Notifica inicios de sesión en los servicios (n8n, Chatwoot, etc.). *Nota: Este evento es controlable desde el panel de encendido/apagado del Menú 3 para evitar spam.*

---

## ⚙️ Configuración y Variables de Entorno (`.env`)

> ⚠️ **Nota de Seguridad:** Dado que el archivo `.env` contendrá credenciales en texto plano (desencriptadas) para facilitar el acceso rápido del administrador, es **crítico** que el acceso al VPS donde corre Dockploy y a la propia app Monitor esté fuertemente protegido con reglas de Firewall y contraseñas robustas.

El archivo `.env` base para la aplicación debe tener la siguiente estructura:

```bash
# ==========================================
# 🦎 CONFIGURACIÓN GENERAL - APP MONITOR
# ==========================================
APP_ENV=production
PORT=3000
DB_HOST=monitor_db
DB_USER=monitor_admin
DB_PASS=tu_password_seguro

# ==========================================
# 📱 INTEGRACIÓN WHATSAPP (BAILEYS API)
# ==========================================
WHATSAPP_NICOP_USA="+1XXXXXXXXXX"
BAILEYS_API_URL="http://ip-baileys-api:puerto"

# ==========================================
# 🔑 CREDENCIALES DE SERVICIOS (MENÚ 1 Y 2)
# ==========================================
# Formato: APP_NOMBREDELVPS_USER / APP_NOMBREDELVPS_PASS

# VPS: 147.93.2.154 venekia-aigentss-com
N8N_VENEKIA_URL="https://n8n.venekia-aigentss-com"
N8N_VENEKIA_USER="admin@correo.com"
N8N_VENEKIA_PASS="contraseña_texto_plano"

CHATWOOT_VENEKIA_URL="https://chatwoot.venekia-aigentss-com"
CHATWOOT_VENEKIA_USER="superadmin@correo.com"
CHATWOOT_VENEKIA_PASS="contraseña_texto_plano"

# (Añadir el resto de VPS activos aquí...)

# ==========================================
# 🛡️ CREDENCIALES MENÚ SECRETO (CIBERSEGURIDAD)
# ==========================================
SECRET_MENU_USER="admin_cyber"
SECRET_MENU_PASS="password_ultra_seguro"

```

---

## 🚀 Guía de Despliegue (Dockploy)

1. **Clonar el Repositorio:** Descarga el código fuente de Monitor en el VPS de Nicop.
2. **Configurar el `.env`:** Completa el archivo `.env` con todas las credenciales de los servicios activos (n8n, Chatwoot, etc.) asegurándote de que estén en texto plano para el visor de la app.
3. **Desplegar con Dockploy:**
* Crea una nueva aplicación en la interfaz de Dockploy.
* Asigna los repositorios correspondientes a la app Monitor, la base de datos (Postgres/MySQL para el histórico) y el ecosistema de herramientas de seguridad.
* Ejecuta el despliegue.


4. **Verificación:** Accede a la URL asignada, comprueba que los menús listan correctamente los servidores y haz clic en el logo del Lagarto Monitor para comprobar el acceso al área de ciberseguridad.

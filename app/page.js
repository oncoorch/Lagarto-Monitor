"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Copy,
  Database,
  ExternalLink,
  Eye,
  Lock,
  LogOut,
  Monitor,
  Network,
  Server,
  Shield,
} from "lucide-react";

const fallbackGroups = [
  {
    key: "aigents",
    name: "Aigents",
    servers: [
      { name: "147.93.2.154 venekia-aigentss-com", ip: "147.93.2.154", hostname: "venekia-aigentss-com", services: [] },
      { name: "147.93.179.212 1001talleres.aigentss.com", ip: "147.93.179.212", hostname: "1001talleres.aigentss.com", services: [] },
      { name: "154.38.191.168 hyundai.aigentss.com", ip: "154.38.191.168", hostname: "hyundai.aigentss.com", services: [] },
      { name: "62.84.187.169 kia.electrolineras.aigentss.com", ip: "62.84.187.169", hostname: "kia.electrolineras.aigentss.com", services: [] },
    ],
  },
  {
    key: "nicop",
    name: "NICOP",
    servers: [
      { name: "169.58.168.77 oncoorch.com", ip: "169.58.168.77", hostname: "oncoorch.com", services: [] },
    ],
  },
];

function serviceIcon(type) {
  if (type === "postgres" || type === "redis") return <Database size={18} />;
  if (type === "security") return <Shield size={18} />;
  return <ExternalLink size={18} />;
}

export default function Page() {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [resources, setResources] = useState({ groups: fallbackGroups });
  const [activeMenu, setActiveMenu] = useState("aigents");
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [revealedService, setRevealedService] = useState("");
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [soc, setSoc] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => res.json()).then((data) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/resources").then((res) => res.json()).then((data) => {
      if (data.groups) setResources(data);
    });
    fetch("/api/soc").then((res) => res.json()).then((data) => setSoc(data.controls || []));
  }, [user]);

  useEffect(() => {
    if (!user || activeMenu !== "monitor") return;
    let alive = true;
    const load = () => fetch("/api/metrics").then((res) => res.json()).then((data) => {
      if (alive) setMetrics(data);
    }).catch(() => {});
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [user, activeMenu]);

  const groupsByKey = useMemo(() => Object.fromEntries((resources.groups || []).map((group) => [group.key, group])), [resources]);
  const activeGroup = groupsByKey[activeMenu] || groupsByKey.aigents || fallbackGroups[0];

  async function submitLogin(event) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    const data = await response.json();
    if (!response.ok) {
      setLoginError(data.error || "No se pudo iniciar sesion");
      return;
    }
    setUser(data.user);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  async function revealService() {
    setReauthError("");
    const response = await fetch("/api/auth/reauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: reauthPassword }),
    });
    if (!response.ok) {
      setReauthError("No se pudo validar la clave");
      return;
    }
    setRevealedService(serviceKey(selectedService));
    setReauthPassword("");
  }

  function serviceKey(service) {
    return `${service?.name || ""}|${service?.url || ""}`;
  }

  function maskCredentials(credentials = {}) {
    return Object.fromEntries(Object.entries(credentials).map(([key, value]) => {
      const text = String(value ?? "");
      if (!text) return [key, ""];
      return [key, "•".repeat(Math.min(Math.max(text.length, 8), 18))];
    }));
  }

  if (!user) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={submitLogin}>
          <div className="brand-lock"><Lock size={24} /></div>
          <h1>Lagarto Monitor</h1>
          <p>Panel interno de servicios NICOP y Aigents</p>
          <label>Usuario</label>
          <input value={loginForm.username} onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })} />
          <label>Contrasena</label>
          <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
          {loginError && <div className="error">{loginError}</div>}
          <button>Entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <button className="logo" onClick={() => setActiveMenu("soc")} title="SOC">
          <img src="/icon.svg" alt="" />
          <span>Lagarto</span>
        </button>
        <button className={activeMenu === "aigents" ? "active" : ""} onClick={() => setActiveMenu("aigents")}><Network size={18} />Aigents</button>
        <button className={activeMenu === "nicop" ? "active" : ""} onClick={() => setActiveMenu("nicop")}><Server size={18} />NICOP</button>
        <button className={activeMenu === "monitor" ? "active" : ""} onClick={() => setActiveMenu("monitor")}><Activity size={18} />Monitor</button>
        <button className={activeMenu === "soc" ? "active" : ""} onClick={() => setActiveMenu("soc")}><Shield size={18} />SOC</button>
        <div className="spacer" />
        <button onClick={logout}><LogOut size={18} />Salir</button>
      </aside>

      <section className="content">
        <header>
          <div>
            <h1>{activeMenu === "monitor" ? "Monitoreo NICOP" : activeMenu === "soc" ? "Centro de Seguridad" : activeGroup?.name}</h1>
            <p>{user.name} · {new Date().toLocaleString("es-EC")}</p>
          </div>
          <button className="ghost" onClick={() => fetch("/api/alerts/test", { method: "POST" })}><AlertTriangle size={18} />Probar alerta</button>
        </header>

        {["aigents", "nicop"].includes(activeMenu) && (
          <div className="server-grid">
            {(activeGroup?.servers || []).map((server) => (
              <article className="server-card" key={`${server.ip}-${server.hostname}`}>
                <div>
                  <h2>{server.name}</h2>
                  <p>{server.ip} · {server.hostname}</p>
                </div>
                <button onClick={() => setSelectedServer(server)}><Eye size={18} />Ver servicios</button>
              </article>
            ))}
          </div>
        )}

        {activeMenu === "monitor" && (
          <div className="monitor-grid">
            <div className="metric-card">
              <h2>Resumen</h2>
              <strong>{metrics?.totals?.cpu ?? "--"}%</strong>
              <span>CPU total de contenedores</span>
            </div>
            <div className="metric-card">
              <h2>Memoria</h2>
              <strong>{metrics?.totals?.memoryMb ?? "--"} MB</strong>
              <span>RAM usada por contenedores</span>
            </div>
            <div className="table-card">
              <h2>Contenedores</h2>
              <table>
                <thead><tr><th>Nombre</th><th>CPU</th><th>RAM</th><th>Estado</th></tr></thead>
                <tbody>
                  {(metrics?.containers || []).map((item) => (
                    <tr key={item.id}><td>{item.name}</td><td>{item.cpu}%</td><td>{item.memoryMb} MB</td><td>{item.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === "soc" && (
          <div className="soc-grid">
            {soc.map((item) => (
              <article className="soc-card" key={item.key}>
                <Shield size={22} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                </div>
                <span className={item.enabled ? "pill on" : "pill"}>{item.enabled ? "Activo" : "Pendiente"}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedServer && (
        <div className="modal-backdrop" onClick={() => setSelectedServer(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>{selectedServer.name}</h2>
            <p>{selectedServer.ip} · {selectedServer.hostname}</p>
            <div className="service-list">
              {(selectedServer.services || []).length ? selectedServer.services.map((service) => (
                <button key={service.name} onClick={() => {
                  setSelectedService(service);
                  setRevealedService("");
                  setReauthPassword("");
                  setReauthError("");
                }}>
                  {serviceIcon(service.type)}
                  <span>{service.name}</span>
                  <ExternalLink size={16} />
                </button>
              )) : <p className="empty">Agrega servicios en MONITOR_RESOURCES_B64 para mostrar accesos directos.</p>}
            </div>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="modal-backdrop" onClick={() => setSelectedService(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h2>{selectedService.name}</h2>
            <p>{selectedService.url}</p>
            <pre>{JSON.stringify(
              revealedService === serviceKey(selectedService)
                ? selectedService.credentials || {}
                : maskCredentials(selectedService.credentials || {}),
              null,
              2
            )}</pre>
            {revealedService !== serviceKey(selectedService) && (
              <div className="reauth">
                <label>Confirma tu clave para revelar credenciales</label>
                <input
                  type="password"
                  value={reauthPassword}
                  onChange={(event) => setReauthPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") revealService();
                  }}
                />
                {reauthError && <span>{reauthError}</span>}
              </div>
            )}
            <div className="modal-actions">
              {revealedService === serviceKey(selectedService) ? (
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedService.credentials || {}, null, 2))}><Copy size={18} />Copiar</button>
              ) : (
                <button onClick={revealService}><Eye size={18} />Revelar</button>
              )}
              {selectedService.url && <a href={selectedService.url} target="_blank" rel="noreferrer">Abrir</a>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

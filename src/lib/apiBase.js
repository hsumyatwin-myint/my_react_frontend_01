function normalizeBase(value) {
  let base = (value || "").trim().replace(/\/+$/, "");
  if (!base) {
    return "";
  }
  if (base.startsWith("/")) {
    return base;
  }
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  return base;
}

const configuredBase = normalizeBase(import.meta.env.VITE_API_URL);

function buildApiRoot(base) {
  if (!base) {
    return "/api";
  }

  if (base.endsWith("/api")) {
    return base;
  }

  return `${base}/api`;
}

// In dev, use same-origin /api through Vite proxy.
export const API_ROOT = import.meta.env.DEV ? "/api" : buildApiRoot(configuredBase);

export function apiUrl(path) {
  const cleanPath = `/${String(path || "").replace(/^\/+/, "")}`;
  return `${API_ROOT}${cleanPath}`;
}

// For static/public files (e.g. profile images).
export const PUBLIC_BASE = import.meta.env.DEV ? "" : configuredBase;

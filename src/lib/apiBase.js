const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

// In Vite dev, use same-origin '/api' through dev-server proxy to avoid CORS.
const API_BASE = import.meta.env.DEV ? "" : configuredApiUrl;

export default API_BASE;

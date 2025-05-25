const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

type Resp = "json" | "text" | "void";

async function apiFetch<T = any>(
  method: string,
  path: string,
  body?: unknown,
  expect: Resp = "json",
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_BASE}${path.replace(/\/?$/, "/")}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const err = await res.json();
      msg = err.detail ?? err.message ?? msg;
    } catch {}
    throw new Error(msg);
  }

  if (expect === "void" || res.status === 204) return null as unknown as T;
  if (expect === "text") return (await res.text()) as T;
  return (await res.json()) as T;
}

export default {
  get      : <T = any>(p: string)          => apiFetch<T>("GET"   , p),
  getPlain :      (p: string)              => apiFetch<string>("GET", p, undefined, "text"),
  post     : <T = any>(p: string, b?: any) => apiFetch<T>("POST"  , p, b),
  put      : <T = any>(p: string, b?: any) => apiFetch<T>("PUT"   , p, b),
  delete   : <T = any>(p: string)          => apiFetch<T>("DELETE", p, undefined, "void"),
};
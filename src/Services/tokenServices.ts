type JwtPayload = {
  _id?: string;
  exp?: number;
  isAdmin?: boolean;
};

const LS_KEY = "token";
const SS_KEY = "token_session";

function base64UrlToString(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decode(token: string): JwtPayload {
  const part = token.split(".")[1];
  if (!part) throw new Error("Bad token");
  const json = base64UrlToString(part);
  return JSON.parse(json) as JwtPayload;
}

export function setToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(LS_KEY, token);
    sessionStorage.removeItem(SS_KEY);
  } else {
    sessionStorage.setItem(SS_KEY, token);
    localStorage.removeItem(LS_KEY);
  }
}

export function getToken(): string | null {
  return localStorage.getItem(LS_KEY) || sessionStorage.getItem(SS_KEY);
}

export function clearToken() {
  localStorage.removeItem(LS_KEY);
  sessionStorage.removeItem(SS_KEY);
}

export function isTokenExpired(token: string) {
  try {
    const p = decode(token);
    const now = Date.now() / 1000;
    return !!p?.exp && p.exp < now;
  } catch {
    return true;
  }
}

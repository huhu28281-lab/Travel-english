import { AppError, json } from "./api-utils";

const COOKIE = "__Host-travel-visitor";
type Learner = { userId: string; browserScoped: boolean; cookie?: string };

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    throw new AppError("앱 안에서 다시 시도해 주세요.", 403);
  }
}

export async function visitorId(token: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return "visitor:" + [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, "0")).join("");
}

export async function learnerSession(request: Request, create = false): Promise<Learner> {
  if (request.method !== "GET" || create) sameOrigin(request);
  // The Sites dispatcher supplies this header for existing signed-in learners.
  const account = request.headers.get("oai-authenticated-user-id");
  if (account) return {userId: account, browserScoped: false};
  const token = request.headers.get("cookie")?.split(";").map(value => value.trim()).find(value => value.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  if (token && /^[a-f0-9]{64}$/.test(token)) return {userId: await visitorId(token), browserScoped: true};
  if (!create) throw new AppError("학습 화면을 다시 열어 주세요.", 401);
  const fresh = [...crypto.getRandomValues(new Uint8Array(32))].map(value => value.toString(16).padStart(2, "0")).join("");
  return {
    userId: await visitorId(fresh), browserScoped: true,
    cookie: `${COOKIE}=${fresh}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
  };
}

export function sessionResponse(learner: Learner) {
  const response = json({ready: true, browserScoped: learner.browserScoped});
  if (learner.cookie) response.headers.set("Set-Cookie", learner.cookie);
  return response;
}

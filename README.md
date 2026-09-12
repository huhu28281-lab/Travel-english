# 트래블 잉글리시 — 여행 기초 회화

기존 출근길 영어 앱과 독립된 프로젝트입니다. 원본 파일, 배포 주소, 기록 및 계정 비밀값을 공유하거나 수정하지 않습니다.

- 한국 시간의 오늘 날짜에 맞는 수업을 기본으로 엽니다. 월~금 버튼에 실제 날짜를 표시하며, 날짜 선택·이전/다음 주·오늘 바로가기로 미완료 여부와 상관없이 원하는 날을 열 수 있습니다. 주말은 금요일 수업부터 복습합니다.
- 4주 × 5일, 여행 상황 20개와 핵심 회화 100개. 5일의 30단계를 모두 마치면 축하 후 다음 월요일 수업으로 이동하며, 앱을 다시 열면 오늘 날짜로 돌아옵니다. 4주 분량을 마치면 반복 복습하되 날짜별 완료 기록은 분리합니다. 기존 수업 ID와 완료 기록은 유지합니다.
- 기초 / 실전 난도, 듣기, 표현, 따라 말하기, 대화, 기억, 복습의 6단계.
- D1에 앱별 학습 기록과 단어장 저장. 기존 로그인 사용자의 기록은 유지하고, 익명 방문자는 HttpOnly 보안 쿠키의 SHA-256 식별자로 기록을 분리합니다. 로그인 화면 없이 이용할 수 있으며 쿠키를 삭제하면 기존 익명 기록을 다시 찾을 수 없습니다.
- 기기 지원에 따른 음성 합성, 음성 입력, 녹음 후 비교. 음성 인식은 발음 정확도 점수가 아닙니다.
- 앱 전용 이름·아이콘·manifest, 반응형 레이아웃과 요일별 여행 친구 5종. 완료하면 포즈를 바꾸며 춤추고, 동작 줄이기 설정에서는 정지한 완료 포즈를 보여줍니다.
- AI 대화 및 외부 발음 평가 연결은 포함하지 않습니다. 교재의 예시 대화로 연습하며, 발음 연습은 예시 음성과 내 녹음을 비교하는 방식입니다.

## 개발과 보관

### 직접 Cloudflare Workers 배포

- 별도 Worker 이름은 `travel-english`, 별도 D1 이름은 `travel-english-db`입니다. 기존 morning-english Worker와 DB를 변경하지 않습니다.
- 여행 앱 D1 ID `76b85945-6d97-4c23-9939-41c2a5e630f9`가 기본 설정에 반영되어 있습니다. `pnpm run build:cloudflare`로 빌드하며, 다른 데이터베이스를 사용할 때만 빌드 환경의 `CF_D1_DATABASE_ID`로 덮어씁니다. 로그인·Access·AI 환경변수는 필요하지 않습니다.
- 배포 전 `wrangler d1 migrations apply DB --remote --config .cloudflare-deploy.json`로 이 앱의 마이그레이션을 적용하고 `wrangler deploy --config dist/server/wrangler.json`으로 배포합니다. Workers Builds 환경에서는 빌드 스크립트가 마이그레이션을 적용합니다.
- Cloudflare의 Git 연결에서 저장소 `huhu28281-lab/Travel-english`, 브랜치 `main`, Worker 이름 `travel-english`를 선택합니다. 빌드 명령은 `npm run build:cloudflare`, 배포 명령은 `npx wrangler deploy --config dist/server/wrangler.json`, 루트 디렉터리는 저장소 최상위(`/`)로 설정합니다.
- Workers Builds의 빌드용 API 토큰에는 마이그레이션 적용을 위한 **Account → D1 → Edit** 권한이 필요합니다. 자동 생성 토큰에 이 권한이 없다면 Cloudflare의 **My Profile → API Tokens**에서 해당 빌드 토큰에 추가합니다. 토큰 값은 코드나 저장소에 넣지 않습니다.
- 직접 배포 진입점은 외부에서 전달한 Sites 사용자 헤더를 제거하고 익명 방문자 세션으로만 기록을 구분합니다.
- `node scripts/cloudflare-config.mjs --check`는 실제 DB와 연결하지 않는 빌드 확인용입니다. 확인용 결과물로 배포하지 말고 실제 DB ID로 다시 빌드해야 합니다.

소스는 이 프로젝트 전용 Git 저장소에 보관합니다. 배포 전용 프로젝트 ID는 `.openai/hosting.json`에 있습니다. 다른 저장소나 Cloudflare 환경으로 이동할 때 원본 서비스의 프로젝트 ID·DB ID·토큰을 재사용하지 마세요.


## Prerequisites

- Node.js `>=22.13.0`
- Portable: Windows, macOS, or Linux; no Bash required
- Managed Linux: managed Linux runtime with Bash, `flock`, `curl`, `sha256sum`, and GNU `timeout`
- Git is required only for publishing

## Sites Lifecycle

The Sites initializer copies the shared starter and selects managed-linux only when `SITES_MANAGED_LINUX_CONTAINER=1`; otherwise it selects portable. It saves the selection only in ignored `.sites-runtime/execution-profile.json`. Both profiles copy/configure first, then use the plugin's separate `install-dependencies.mjs` step to measure installation independently. Edit source under `app/` and follow the Sites skill for installation, preview, builds, and publishing.

Whenever reopening or moving a checkout, run `node <plugin-root>/scripts/configure-execution-profile.mjs` before project commands. Profile changes do not alter tracked source or require reinstalling otherwise-valid dependencies; restart an existing preview to use the new selection. Do not commit or upload `.sites-runtime/`.

This starter does not use `wrangler.jsonc`.

`install:ci` runs `npm ci` once against the shared lockfile, disables parent-workspace discovery, and includes required dev/optional dependencies despite production/omit settings. Sharp defaults to prebuilt binaries unless explicitly configured otherwise. Do not overlap installers.

- **Portable:** Preserve host HOME, npm cache, registry, proxy, temporary paths, retry/concurrency settings, and lifecycle-script policy. Use `--prefer-offline --no-audit --no-fund`.
- **Managed Linux:** Use the existing project-local HOME/cache/tmp setup and Linux install lock, tarball preflight, and timeout. Restore the image-seeded npm cache only when its lockfile hash matches; retain network fallback. Builds keep their existing timeout. These helpers are not invoked by the portable profile.

`scripts/sites-env.mjs` preserves the caller's HOME, npm cache, proxy, XDG, and temporary-directory configuration while defaulting Wrangler and Miniflare state to the checkout. If npm reports an unwritable cache, select a writable path with `npm_config_cache` for that install. The `dev` and `start` scripts also keep Wrangler logs inside the checkout. Generated `.sites-runtime/` and `.wrangler/` directories are disposable and ignored by Git.

On portable, `npm run dev` uses `vinext dev` with HMR, starting at port 5173. Vinext records the running server in ignored `.vinext/` state, rejects an ordinary duplicate launch, and recovers stale state after a stopped process; exactly simultaneous starts can race. Pass `--port <port>` or `--hostname <host>` after `npm run dev --` when needed; keep portable previews on loopback.

On managed Linux, use `sites-preview start` only for requested browser QA. The project's dev script runs Vite and accepts the supervisor's `--host 0.0.0.0 --port 4173 --strictPort` arguments. The internal browser uses `http://terminal.local:4173/`; it is not a user-facing URL. The supervisor owns the preview lifecycle. The ignored local profile survives the supervisor's cleared process environment.

The portable profile simulates ChatGPT sign-in only for loopback development requests. Visit `/signin-with-chatgpt?return_to=/` to sign in as `local_seedy` (`seedy@sites.test`, display name `Seedy`) and `/signout-with-chatgpt?return_to=/` to sign out. The development cookie preserves that identity across server restarts. Mock auth is disabled in the managed-linux profile and is not included in production builds; hosted authentication remains dispatch-owned.

The Worker uses `vinext/server/fetch-handler`, including Vinext's config-aware image handling. After building, `npm start` runs that Worker locally through Wrangler on `127.0.0.1`, sharing `.wrangler/state` with dev preview and local D1 migrations; it does not deploy the site or simulate sign-in. Use the URL printed by the server. Pass `npm start -- --port <port>` to select a different built-preview port.

Local previews use Miniflare's placeholder `Request.cf` metadata without a network lookup. Set `CLOUDFLARE_CF_FETCH_ENABLED=true` to opt into fetching preview metadata; this setting does not change hosted request metadata.

Local tool usage metrics are disabled by default. Set `WRANGLER_SEND_METRICS=true` to opt in.

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/index.ts` reads the D1 binding from the Cloudflare Worker environment
- `db/schema.ts` starts intentionally empty
- `@cloudflare/workers-types` provides Worker types; `cloudflare-env.d.ts` declares optional `DB`/`BUCKET` bindings—update these declarations if binding names change
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Use it as the durable user key; use email and name for display or contact purposes.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use the returned `userId` as the stable user key for user-owned records; do not use email as a durable identifier.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Local D1 migrations

For a D1-backed local preview, generate SQL with `npm run db:generate`. Build once through the Sites skill's build entrypoint (or `npm run build` for standalone use) to generate `dist/server/wrangler.json`, rebuilding if bindings change. From the project root, apply each pending migration in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_example.sql
```

Replace the filename with the pending migration and `DB` with your D1 binding name if different. Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds the versioned directories. Do not replay migrations already applied locally. This updates only the preview database; publishing applies production migrations separately.

## Diagnostic Commands

- `npm run install:ci`: perform the one locked dependency install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: preview the built Worker locally with D1/R2 support
- `npm run db:generate`: generate Drizzle migrations after schema changes

When using the Sites plugin, follow its skill instructions for installation, builds, and publishing. These npm commands remain available for standalone use.

The portable build runs Vinext directly without a host `timeout` command. The managed-linux build uses `scripts/build-verified.sh` and its existing `SITES_BUILD_TIMEOUT` setting.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

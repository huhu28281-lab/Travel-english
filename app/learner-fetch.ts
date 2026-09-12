"use client";
let session: Promise<void> | undefined;

function prepareSession() {
  if (!session) session = fetch("/api/session", {credentials: "same-origin", cache: "no-store"}).then(async response => {
    if (!response.ok) throw new Error("학습 화면을 열지 못했어요. 다시 시도해 주세요.");
  }).catch(error => { session = undefined; throw error; });
  return session;
}

export async function learnerFetch(path: string, init?: RequestInit) {
  // Share the first cookie request across curriculum, progress and vocabulary.
  await prepareSession();
  const options = {...init, credentials: "same-origin" as const};
  let response = await fetch(path, options);
  if (response.status === 401) {
    session = undefined;
    await prepareSession();
    response = await fetch(path, options);
  }
  return response;
}

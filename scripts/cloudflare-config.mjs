import { writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const checkOnly=process.argv.includes("--check");
// This database identifier is public configuration, not an API credential.
const travelDatabaseId="76b85945-6d97-4c23-9939-41c2a5e630f9";
const databaseId=checkOnly?"00000000-0000-4000-8000-000000000000":(process.env.CF_D1_DATABASE_ID?.trim() || travelDatabaseId);
if(!databaseId || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(databaseId) || (!checkOnly && databaseId.startsWith("00000000")))throw new Error("여행 영어 전용 D1 데이터베이스 ID(CF_D1_DATABASE_ID)를 설정해 주세요.");

const config={
  name:checkOnly?"travel-english-build-check":"travel-english",
  main:"./worker/cloudflare.ts",
  compatibility_date:"2026-05-15",
  compatibility_flags:["nodejs_compat"],
  workers_dev:true,
  preview_urls:false,
  assets:{binding:"ASSETS",run_worker_first:true},
  d1_databases:[{binding:"DB",database_name:"travel-english-db",database_id:databaseId,migrations_dir:"drizzle"}],
  observability:{enabled:true},
};
writeFileSync(".cloudflare-deploy.json",JSON.stringify(config,null,2)+"\n",{mode:0o600});
if(process.argv.includes("--build") || checkOnly) {
  const result=spawnSync(process.execPath,["scripts/run-framework.mjs","build"],{env:{...process.env,DEPLOY_TARGET:"cloudflare"},stdio:"inherit"});
  if(result.status!==0)process.exit(result.status??1);
  if(!checkOnly && process.env.WORKERS_CI==="1") {
    const migration=spawnSync(process.execPath,["node_modules/wrangler/bin/wrangler.js","d1","migrations","apply","DB","--remote","--config",".cloudflare-deploy.json"],{stdio:"inherit"});
    if(migration.status!==0)process.exit(migration.status??1);
  }
}

import app from "vinext/server/app-router-entry";

export default {
  async fetch(request:Request, env:Cloudflare.Env & {ASSETS:Fetcher}, ctx:ExecutionContext):Promise<Response> {
    // Direct Workers traffic has no trusted Sites identity headers.
    const headers=new Headers(request.headers);
    for(const name of [...headers.keys()])if(name.toLowerCase().startsWith("oai-authenticated-"))headers.delete(name);
    const visitorRequest=new Request(request,{headers});
    if((request.method==="GET" || request.method==="HEAD") && !new URL(request.url).pathname.startsWith("/api/")) {
      const asset=await env.ASSETS.fetch(visitorRequest);
      if(asset.status!==404)return asset;
    }
    return app.fetch(visitorRequest,env,ctx);
  },
};

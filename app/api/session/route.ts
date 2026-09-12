import { errorResponse } from "@/app/api-utils";
import { learnerSession, sessionResponse } from "@/app/learner-session";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try { return sessionResponse(await learnerSession(request, true)); }
  catch (error) { return errorResponse(error); }
}

import { errorResponse, json } from "@/app/api-utils";
import { learnerSession } from "@/app/learner-session";
import { progressDb } from "@/db/progress";
import { archivedLessons } from "@/app/weekly-store";
import { activeCourse } from "@/app/study-course";
export const dynamic="force-dynamic";
export async function GET(request: Request) {
  try {
    const {userId}=await learnerSession(request),db=progressDb();
    const [work,basics,archiveLessons]=await Promise.all([activeCourse(db,userId,"work"),activeCourse(db,userId,"basics"),archivedLessons(db,userId)]);
    return json({work:work.pack,basics:basics.pack,weeks:{work:work.weekNumber,basics:basics.weekNumber},archiveLessons});
  }catch(error){return errorResponse(error);}
}

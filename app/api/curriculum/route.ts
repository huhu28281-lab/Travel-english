import { AppError, errorResponse, json } from "@/app/api-utils";
import { learnerSession } from "@/app/learner-session";
import { progressDb } from "@/db/progress";
import { archivedLessons } from "@/app/weekly-store";
import { selectCourse } from "@/app/study-course";
import { calendarDateKey, isStudyDate, studyWeek, weekDate } from "@/app/weekly-types";
export const dynamic="force-dynamic";
export async function GET(request: Request) {
  try {
    const {userId}=await learnerSession(request),db=progressDb();
    const today=calendarDateKey();
    const selectedDate=new URL(request.url).searchParams.get("date") ?? today;
    if(!isStudyDate(selectedDate))throw new AppError("학습할 날짜를 다시 선택해 주세요.");
    const index=studyWeek(weekDate(selectedDate)).index;
    const [work,basics,archiveLessons]=await Promise.all([selectCourse(db,userId,"work",index),selectCourse(db,userId,"basics",index),archivedLessons(db,userId)]);
    return json({work:work.pack,basics:basics.pack,weeks:{work:work.weekNumber,basics:basics.weekNumber},archiveLessons,selectedDate,today});
  }catch(error){return errorResponse(error);}
}

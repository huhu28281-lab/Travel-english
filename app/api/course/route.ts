import { AppError, errorResponse, json, readJson } from "@/app/api-utils";
import { learnerSession } from "@/app/learner-session";
import { selectCourse } from "@/app/study-course";
import { progressDb } from "@/db/progress";
export const dynamic="force-dynamic";
export async function POST(request:Request) {
  try {
    const {userId}=await learnerSession(request);
    const input=await readJson(request,1000);
    if((input.level!=="basics" && input.level!=="work") || !Number.isInteger(input.week) || Number(input.week)<1 || Number(input.week)>3801)throw new AppError("열고 싶은 주차를 다시 선택해 주세요.");
    const course=await selectCourse(progressDb(),userId,input.level,Number(input.week)-1);
    return json({level:input.level,weekNumber:course.weekNumber,pack:course.pack});
  }catch(error){return errorResponse(error);}
}

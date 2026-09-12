import { progressDb } from "@/db/progress";
import { AppError, errorResponse, json, readJson } from "@/app/api-utils";
import { learnerSession } from "@/app/learner-session";
import { advanceCompletedCourse, availableLesson } from "@/app/study-course";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const {userId,browserScoped} = await learnerSession(request);
    const result = await progressDb().prepare("SELECT lesson_id AS lessonId, stage_id AS stageId, completed_at AS completedAt FROM study_progress WHERE user_id = ? ORDER BY completed_at DESC").bind(userId).all();
    return json({progress:result.results,browserScoped});
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const {userId} = await learnerSession(request);
    const input = await readJson(request, 2000);
    if (!Number.isInteger(input.lessonId) || !Number.isInteger(input.stageId) || Number(input.stageId) < 0 || Number(input.stageId) > 5) throw new AppError("올바른 수업을 선택해 주세요.");
    const db = progressDb(), lessonId = Number(input.lessonId), stageId = Number(input.stageId);
    const lesson = await availableLesson(db,lessonId);
    if (!lesson) throw new AppError("학습할 날짜의 수업을 다시 선택해 주세요.");
    const saved=await db.prepare("INSERT INTO study_progress (user_id,lesson_id,stage_id,completed_at) VALUES (?,?,?,?) ON CONFLICT(user_id,lesson_id,stage_id) DO NOTHING").bind(userId,lessonId,stageId,new Date().toISOString()).run();
    const progress = await db.prepare("SELECT lesson_id AS lessonId,stage_id AS stageId,completed_at AS completedAt FROM study_progress WHERE user_id=? AND lesson_id=? AND stage_id=?").bind(userId,lessonId,stageId).first();
    const course = saved.meta.changes===1 ? await advanceCompletedCourse(db,userId,lesson.level,lesson.index) : null;
    const advance = course ? {level:lesson.level,completedWeek:lesson.index+1,weekNumber:course.weekNumber,pack:course.pack} : null;
    return json({progress,advance});
  } catch (error) { return errorResponse(error); }
}

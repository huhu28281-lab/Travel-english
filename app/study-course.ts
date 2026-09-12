import { courseWeekStart, weeklyIdentity, type StudyLevel } from "./weekly-types";
import { preparedPack } from "./weekly-prepared";
import { publishPack, readPack } from "./weekly-store";

async function coursePack(db:D1Database,index:number,level:StudyLevel) {
  const start=courseWeekStart(index);
  return await readPack(db,start,level) || await publishPack(db,preparedPack(start,level));
}

export async function activeCourse(db:D1Database,userId:string,level:StudyLevel) {
  await db.prepare("INSERT INTO study_path (user_id,level,week_index,updated_at) VALUES (?,?,0,?) ON CONFLICT(user_id,level) DO NOTHING").bind(userId,level,new Date().toISOString()).run();
  const path=await db.prepare("SELECT week_index AS weekIndex FROM study_path WHERE user_id=? AND level=?").bind(userId,level).first<{weekIndex:number}>();
  if(!path)throw new Error("Study path unavailable");
  return {pack:await coursePack(db,path.weekIndex,level),weekIndex:path.weekIndex,weekNumber:path.weekIndex+1};
}

export async function selectCourse(db:D1Database,userId:string,level:StudyLevel,weekIndex:number) {
  const pack=await coursePack(db,weekIndex,level);
  await db.prepare("INSERT INTO study_path (user_id,level,week_index,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,level) DO UPDATE SET week_index=excluded.week_index,updated_at=excluded.updated_at").bind(userId,level,weekIndex,new Date().toISOString()).run();
  return {pack,weekIndex,weekNumber:weekIndex+1};
}

export async function advanceCompletedCourse(db:D1Database,userId:string,level:StudyLevel,weekIndex:number) {
  const first=100000+weekIndex*100+(level==="work"?10:0)+1;
  // Advance once only; duplicate saves and a concurrent tab cannot skip a week.
  const result=await db.prepare("UPDATE study_path SET week_index=week_index+1,updated_at=? WHERE user_id=? AND level=? AND week_index=? AND week_index<3800 AND (SELECT COUNT(*) FROM study_progress WHERE user_id=? AND lesson_id BETWEEN ? AND ? AND stage_id BETWEEN 0 AND 5)=30").bind(new Date().toISOString(),userId,level,weekIndex,userId,first,first+4).run();
  if(result.meta.changes!==1)return null;
  return {pack:await coursePack(db,weekIndex+1,level),weekIndex:weekIndex+1,weekNumber:weekIndex+2};
}

export async function availableLesson(db:D1Database,id:number) {
  const identity=weeklyIdentity(id);
  if(!identity)return null;
  const index=Math.floor((id-100000)/100);
  const pack=await coursePack(db,index,identity.level);
  return pack.lessons.some(lesson=>lesson.id===id)?{level:identity.level,index}:null;
}

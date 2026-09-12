import { makeTravelLessons,travelTopics } from "./travel-curriculum";
import { studyWeek,weekDate,weeklyLessonId,type StudyLevel,type WeeklyPack } from "./weekly-types";
export function preparedPack(weekStart:string,level:StudyLevel):WeeklyPack {
 const week=studyWeek(weekDate(weekStart));const cycle=((week.index%4)+4)%4;
 const lessons=makeTravelLessons(cycle,level).map((lesson,i)=>({...lesson,id:weeklyLessonId(weekStart,level,i+1)}));
 const topics=travelTopics.slice(cycle*5,cycle*5+5);
 const words=topics.flatMap(t=>t.rows.slice(0,2).map(r=>({english:r.word,meaning:r.wordKo,example:r.en,exampleKo:r.ko,known:false,saved:false})));
 return {weekStart,nextUpdateAt:week.nextUpdateAt,level,source:"prepared",title:["첫 여행, 한마디부터","이동과 부탁, 조금 더 편하게","낯선 상황에도 차분하게","여행의 마지막까지"][cycle],lessons,words};
}

import data from "./travel-data.json";
import type { Lesson, Phrase } from "./lessons";
import type { StudyLevel } from "./weekly-types";
export function makeTravelLessons(cycle:number,level:StudyLevel):Lesson[]{
 return data.slice((cycle%4)*5,(cycle%4)*5+5).map((lesson,d)=>({id:d+1,title:lesson.title,label:lesson.label,scene:lesson.scene,phrases:lesson.rows.map((r,i)=>{
 const extended=level==="work"; const en=r.en+(extended&&r.extra?" "+r.extra:"");const ko=r.ko+(extended&&r.extraKo?" "+r.extraKo:"");const next=lesson.rows[(i+1)%5];
 return {en,ko,cue:r.cue,cueKo:r.cueKo,tip:lesson.tip,task:ko,variation:{from:en,to:next.en,task:next.ko+" 라고 말해보세요."}} satisfies Phrase;
 })}));
}
export const travelTopics=data;

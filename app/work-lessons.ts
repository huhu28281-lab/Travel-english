import { makeTravelLessons } from "./travel-curriculum";
import { stages } from "./lessons";
export const workLessons=makeTravelLessons(0,"work").map((lesson,i)=>({...lesson,id:i+11}));
export const workStages=stages.map((s,i)=>i===4?{...s,title:"조건 바꾸기",sub:"다른 상황에 응용하기",hint:"시간이나 요청을 바꿔 새로운 문장으로 말해보세요."}:s);

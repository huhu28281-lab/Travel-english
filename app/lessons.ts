export type Phrase = { en:string; ko:string; tip:string; cue:string; cueKo:string; task?:string; variation?:{from:string;to:string;task:string} };
export type Lesson = {id:number;title:string;label:string;scene:string;phrases:Phrase[]};
import { makeTravelLessons } from "./travel-curriculum";
export const lessons:Lesson[]=makeTravelLessons(0,"basics").map((lesson,i)=>({...lesson,id:i+1}));
export const stages = [
{title:"가볍게 듣기",sub:"짧은 대화에 귀 기울이기",hint:"처음엔 뜻을 보면서, 두 번째는 영어만 들으며 반복해보세요."},
{title:"핵심 표현",sub:"오늘 쓸 문장 5개 익히기",hint:"문장을 듣고 뜻을 확인하세요. 한 번에 한 문장씩, 천천히 익혀보세요."},
{title:"따라 말하기",sub:"내 목소리로 한 문장씩",hint:"짧게 듣고 따라 해보세요. 말하기 어려운 곳에서는 직접 입력해도 좋아요."},
{title:"대화 연습",sub:"상대의 말에 답해보기",hint:"상대의 말을 듣고, 제시된 우리말에 맞는 영어로 답해보세요."},
{title:"뜻 떠올리기",sub:"우리말만 보고 기억하기",hint:"답을 보기 전에 먼저 떠올려보세요. 기억나지 않으면 확인해도 괜찮아요."},
{title:"마무리 복습",sub:"오늘 배운 표현 다시 만나기",hint:"우리말에 맞는 표현을 골라보세요. 잘 안 떠오르는 문장은 다시 들어보세요."}
];

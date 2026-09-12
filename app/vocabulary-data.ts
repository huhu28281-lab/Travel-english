import { travelTopics } from "./travel-curriculum";
export type Word={english:string;meaning:string;example:string;exampleKo:string;known:boolean;saved:boolean};
export const wordKey=(s:string)=>s.trim().toLowerCase().replace(/\s+/g," ");
export const vocabulary=travelTopics.flatMap(t=>t.rows.map(r=>({english:r.word,meaning:r.wordKo,example:r.en,exampleKo:r.ko,known:false,saved:false}))).filter((w,i,a)=>a.findIndex(x=>wordKey(x.english)===wordKey(w.english))===i);

export const starterWords:Word[]=vocabulary.slice(0,10);
export function mergeWeeklyWords(weekly:Word[],stored:Word[]){const merged=new Map(weekly.map(w=>[wordKey(w.english),w]));for(const word of stored)merged.set(wordKey(word.english),word);return [...merged.values()];}

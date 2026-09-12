"use client";
import sunnyImageUrl from "./assets/sunny-poses.webp?url";
import cocoImageUrl from "./assets/coco-poses.webp?url";
import mimiImageUrl from "./assets/mimi-poses.webp?url";
import boboImageUrl from "./assets/bobo-poses.webp?url";
import pipiImageUrl from "./assets/pipi-poses.webp?url";

const mascots = [
  {name:"써니 병아리",src:sunnyImageUrl},
  {name:"코코 고양이",src:cocoImageUrl},
  {name:"미미 토끼",src:mimiImageUrl},
  {name:"보보 강아지",src:boboImageUrl},
  {name:"피피 펭귄",src:pipiImageUrl},
];
export const mascotNames = mascots.map(mascot=>mascot.name);
export default function WeekdayMascot({day=1,completed=false,playing=false,className=""}:{day?:number;completed?:boolean;playing?:boolean;className?:string}) {
  const mascot=mascots[Math.max(0,Math.min(4,day-1))];
  return <span role="img" aria-label={`${mascot.name}${completed?", 학습 완료":""}`} className={`weekday-mascot ${completed?"is-completed":playing?"is-playing":""} ${className}`} style={{backgroundImage:`url("${mascot.src}")`}}/>;
}

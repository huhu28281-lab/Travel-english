"use client";
const mascots = [
  {name:"써니 병아리",file:"sunny"},
  {name:"코코 고양이",file:"coco"},
  {name:"미미 토끼",file:"mimi"},
  {name:"보보 강아지",file:"bobo"},
  {name:"피피 펭귄",file:"pipi"},
];
export const mascotNames = mascots.map(mascot=>mascot.name);
export default function WeekdayMascot({day=1,completed=false,playing=false,className=""}:{day?:number;completed?:boolean;playing?:boolean;className?:string}) {
  const mascot=mascots[Math.max(0,Math.min(4,day-1))];
  return <span role="img" aria-label={`${mascot.name}${completed?", 학습 완료":""}`} className={`weekday-mascot ${completed?"is-completed":playing?"is-playing":""} ${className}`} style={{backgroundImage:`url(/weekdays/${mascot.file}-poses.webp)`}}/>;
}

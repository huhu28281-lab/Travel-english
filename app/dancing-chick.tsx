"use client";
import { useEffect, useState } from "react";
import sunnyImageUrl from "./assets/travel-sunny.webp?url";
export default function DancingChick({variant="home",day=1}:{variant?:"home"|"empty";day?:number}){
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{if(!playing)return;const t=setTimeout(()=>setPlaying(false),2500);return()=>clearTimeout(t);},[playing]);
 return <button type="button" className={`chick-button travel-sunny ${playing?"sunny-playing":""} ${variant==="empty"?"chick-empty":""}`} onClick={()=>setPlaying(p=>!p)} aria-label="써니와 여행 인사하기" aria-pressed={playing}>{playing&&<span className="mascot-bubble" role="status">Let’s go!</span>}<img className="morning-mascot" src={sunnyImageUrl} width={128} height={128} alt="배낭을 멘 여행 병아리 써니"/></button>;
}

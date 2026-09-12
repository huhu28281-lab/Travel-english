"use client";
import { useRef, useState } from "react";
import { Mic, Square, Volume2, RotateCcw, AudioLines, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useSpeech } from "./use-speech";
import { useRecorder } from "./use-recorder";

const firstSentence = (text: string) => (text.match(/[^.!?]+[.!?]+|[^.!?]+$/)?.[0] || text).trim();

export default function Pronunciation({initialText, rate}: {initialText: string; rate: number}) {
  const [target, setTarget] = useState(firstSentence(initialText));
  const recorder = useRecorder();
  const speech = useSpeech(rate);
  const audio = useRef<HTMLAudioElement | null>(null);
  const wordCount = target.trim() ? target.trim().split(/\s+/).length : 0;
  const valid = wordCount > 0 && wordCount <= 35 && target.length <= 300 && /[a-z]/i.test(target);
  const locked = recorder.recording || recorder.starting;
  const play = () => { audio.current?.pause(); speech.play([{text: target}]); };
  const start = () => { speech.stop(); audio.current?.pause(); void recorder.start(); };

  return <div className="feature-page">
    <div className="page-heading"><div><p className="eyebrow">HEAR YOURSELF, SPEAK WITH CONFIDENCE</p><h1>발음 연습</h1><p className="heading-sub">예시 발음과 내 목소리를 비교해보세요.</p></div></div>
    <div className="feature-split">
      <section className="feature-panel recording-panel">
        <div className="feature-panel-top"><span className="eyebrow">01 · LISTEN & RECORD</span><span className="small-tag">미국 영어 · 최대 20초</span></div>
        <label className="input-label" htmlFor="pronunciation-target">연습할 영어 문장</label>
        <Textarea id="pronunciation-target" lang="en" value={target} onChange={e => { setTarget(e.target.value); recorder.clear(); }} maxLength={300} disabled={locked} rows={3}/>
        <div className="pronunciation-target-footer"><span className={wordCount > 35 ? "form-error" : "micro-note"}>{wordCount} / 35단어</span><button className="text-button" disabled={locked || !valid} onClick={() => speech.speaking ? speech.stop() : play()}><Volume2 size={17}/>{speech.speaking ? "재생 멈추기" : "예시 발음 듣기"}</button></div>
        <div className={`recording-center ${recorder.recording ? "is-recording" : ""}`}>
          <span className="recording-icon"><Mic size={36}/></span>
          <strong>{recorder.recording ? "편안한 속도로 읽어주세요." : recorder.starting ? "마이크 권한을 확인해 주세요." : recorder.url ? "내 목소리를 다시 들어보세요." : "준비되면 녹음을 시작하세요."}</strong>
          {recorder.recording && <p>{recorder.seconds.toFixed(0)}초 / 20초</p>}
          <Progress value={recorder.seconds / 20 * 100} aria-label="녹음 시간"/>
          <button className={`primary-button ${recorder.recording ? "record-stop" : ""}`} disabled={!recorder.supported || recorder.starting || !valid} onClick={recorder.recording ? recorder.stop : start}>{recorder.starting ? <Loader2 className="spin" size={19}/> : recorder.recording ? <Square size={18}/> : recorder.url ? <RotateCcw size={18}/> : <Mic size={18}/>} {recorder.recording ? "녹음 끝내기" : recorder.url ? "다시 녹음" : "녹음 시작"}</button>
        </div>
        {!recorder.supported && <p className="form-error">이 브라우저는 녹음을 지원하지 않아요. 마이크를 지원하는 최신 브라우저에서 열어주세요.</p>}
        {recorder.url && <div className="recording-playback"><label>내 녹음 다시 듣기</label><audio ref={audio} controls src={recorder.url} onPlay={() => speech.stop()} aria-label="내 영어 녹음"/></div>}
        {recorder.error && <p className="form-error" role="alert">{recorder.error}</p>}
        {speech.message && <p className="feature-status" role="status">{speech.message}</p>}
      </section>
      <section className="feature-panel assessment-panel">
        <span className="eyebrow">02 · NOTICE & TRY AGAIN</span><h2>듣고 비교하기</h2>
        <div className="assessment-empty"><AudioLines size={40}/><h3>강세와 끝소리를 들어보세요.</h3><p>예시와 내 녹음을 번갈아 들으며 차이를 찾아보세요.</p><ul><li>강세가 있는 단어가 또렷하게 들리나요?</li><li>단어의 끝소리가 빠지지 않았나요?</li><li>의미가 이어지는 부분을 묶어 읽었나요?</li></ul></div>
      </section>
    </div>
  </div>;
}

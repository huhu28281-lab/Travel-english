import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata:Metadata={title:"트래블 잉글리시 · 여행 기초 영어회화",description:"공항, 호텔, 식당과 길 찾기. 여행에서 바로 쓰는 기초 영어를 듣고 말하며 연습해요.",applicationName:"트래블 잉글리시",appleWebApp:{capable:true,title:"트래블 잉글리시",statusBarStyle:"default"},icons:{icon:"/favicon.svg",apple:[{url:"/icons/apple-touch-icon.png",sizes:"180x180",type:"image/png"}]}};
export const viewport:Viewport={themeColor:"#2152c7"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><head><link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials"/></head><body className="antialiased">{children}</body></html>;}

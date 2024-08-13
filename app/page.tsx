"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

import Timer from "@app/components/timer";

export default function Home() {
  const color_theme = useRef<HTMLDivElement>(null);
  const notification_sound = useRef<HTMLAudioElement>(null);

  return (
    <main
      ref={color_theme}
      className="flex min-h-svh select-none flex-col items-center justify-center gap-2 bg-gradient-to-b p-5 text-white"
    >
      <h1 className="text-center text-5xl font-bold">Pomodoro</h1>

      <Timer
        notification_sound={notification_sound}
        color_theme={color_theme}
      />

      {/* Link to repository hosted on GitHub */}
      <Link
        href={"https://github.com/lui5gl/pomodoro-web-timer"}
        target="_blank"
        className="absolute bottom-5 right-5 rounded-sm bg-white/25 p-2 transition-all duration-150 hover:shadow-box active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <Image src={"/icon/github.svg"} alt="GitHub" width={25} height={25} />
      </Link>

      {/* Notification end task */}
      <audio ref={notification_sound} src="/sound/alarm.wav" preload="auto" />
    </main>
  );
}

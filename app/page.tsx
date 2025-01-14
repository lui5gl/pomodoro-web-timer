"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);

  const [state, setState] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);

  const colorTheme = useRef<HTMLDivElement>(null);
  function handleChangeState(newState: string) {
    colorTheme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );
    colorTheme.current?.classList.add(newState);

    setIsRunning(false);

    if (newState === "pomodoro") setMinutes(25);
    else if (newState === "short-break") setMinutes(5);
    else if (newState === "long-break") setMinutes(15);
    setSeconds(0);
  }

  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) return;

      if (seconds > 0) setSeconds((prev) => prev - 1);
      else if (minutes > 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
      } else {
        notificationSoundRef.current?.play();
        setIsRunning(false);
      }
      document.title = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} - Pomodoro Web Timer`;
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, minutes, notificationSoundRef]);

  return (
    <main
      ref={colorTheme}
      className="pomodoro flex min-h-screen select-none flex-col items-center justify-center bg-gradient-to-b p-10 text-white"
    >
      <section className="flex flex-col -space-y-5 text-center text-9xl font-bold drop-shadow-hour">
        <span>{minutes.toString().padStart(2, "0")}</span>
        <span>{seconds.toString().padStart(2, "0")}</span>
      </section>

      <section className="flex w-full max-w-xs justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/25 transition-all"
        >
          <Image
            width={18}
            height={18}
            alt="Toggle start/stop"
            className="pointer-events-none"
            src={`icons/${isRunning ? "pause" : "play"}.svg`}
          />
        </button>
        <button
          onClick={() => handleChangeState(state ?? "pomodoro")}
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/25 transition-all"
        >
          <Image
            className="pointer-events-none"
            src={"icons/reset.svg"}
            alt="Reset timer"
            width={18}
            height={18}
          />
        </button>
        <select
          onChange={(e) => handleChangeState(e.target.value)}
          className="h-8 rounded-sm bg-white/25 px-2 font-bold text-white [&>option]:text-neutral-800"
        >
          <option value="pomodoro" defaultChecked>
            Pomodoro
          </option>
          <option value="short-break">Short Break</option>
          <option value="long-break">Long Break</option>
        </select>
      </section>

      <audio
        ref={notificationSoundRef}
        src="/sounds/alarm.wav"
        preload="auto"
      />
    </main>
  );
}

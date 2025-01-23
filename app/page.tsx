"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);

  const [isRunning, setIsRunning] = useState(false);

  const colorTheme = useRef<HTMLDivElement>(null);
  const selectStateRef = useRef<HTMLSelectElement>(null);

  function handleChangeState() {
    setIsRunning(false);
    document.title = "Pomodoro Web Timer";

    colorTheme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );

    let newState = selectStateRef.current?.value ?? "pomodoro";
    colorTheme.current?.classList.add(newState);

    if (newState === "pomodoro") setMinutes(25);
    else if (newState === "short-break") setMinutes(5);
    else if (newState === "long-break") setMinutes(15);
    setSeconds(0);
  }

  const notificationSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (seconds > 0) setSeconds((prev) => prev - 1);
        else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          notificationSoundRef.current?.play();
          setIsRunning(false);
        }
      }, 1000);
      document.title = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} - Pomodoro Web Timer`;
      return () => clearInterval(interval);
    }
  }, [isRunning, minutes, seconds, notificationSoundRef]);

  return (
    <main
      ref={colorTheme}
      className="pomodoro flex min-h-screen select-none flex-col items-center justify-center bg-linear-to-br p-10 text-white"
    >
      <section className="flex flex-col -space-y-5 text-center text-9xl font-bold drop-shadow-hour">
        <span>{minutes.toString().padStart(2, "0")}</span>
        <span>{seconds.toString().padStart(2, "0")}</span>
      </section>

      <section className="flex w-full max-w-xs justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 hover:shadow-box active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Image
            width={16}
            height={16}
            alt="Toggle start/stop"
            src={`icons/${isRunning ? "pause" : "play"}.svg`}
          />
        </button>
        <button
          onClick={handleChangeState}
          className="flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 hover:shadow-box active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Image
            src="icons/reset.svg"
            alt="Reset timer"
            width={16}
            height={16}
          />
        </button>
        <select
          ref={selectStateRef}
          onChange={handleChangeState}
          className="rounded-xs bg-white/25 px-2 transition-all duration-150 hover:shadow-box [&>option]:text-neutral-800"
        >
          <option value="pomodoro" defaultChecked>
            Pomodoro
          </option>
          <option value="short-break">Short Break</option>
          <option value="long-break">Long Break</option>
        </select>
      </section>

      <audio ref={notificationSoundRef} src="sounds/alarm.wav" preload="auto" />
    </main>
  );
}

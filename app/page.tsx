"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const colorTheme = useRef<HTMLDivElement>(null);
  const resetTimerBtn = useRef<HTMLButtonElement>(null);
  const notificationSoundRef = useRef<HTMLAudioElement>(null);

  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [state, setState] = useState<string>();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem("state") || "pomodoro";

    if (!localStorage.getItem("state")) localStorage.setItem("state", theme);

    handleChangeState(theme);
    colorTheme.current?.classList.add(theme);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const endTime = Date.now() + (minutes * 60 + seconds) * 1000;

      intervalRef.current = setInterval(() => {
        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
          notificationSoundRef.current?.play();
          setIsRunning(false);
          setMinutes(0);
          setSeconds(0);
          clearInterval(intervalRef.current!);
          return;
        }

        const newMinutes = Math.floor(remainingTime / 60000);
        const newSeconds = Math.floor((remainingTime % 60000) / 1000);
        document.title = `${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")} - Pomodoro Web Timer`;

        setMinutes(newMinutes);
        setSeconds(newSeconds);
      }, 1000);
    } else clearInterval(intervalRef.current!);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const handleReset = () => {
    handleChangeState(state ?? "pomodoro");
  };

  const handleToggleIsRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setStartTime(Date.now());
    }
  };

  const handleChangeState = (state: string) => {
    setState(state);
    localStorage.setItem("state", state);

    colorTheme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );

    colorTheme.current?.classList.add(state);

    let minutes: number;
    let seconds: number;

    switch (state) {
      case "pomodoro":
        minutes = 25;
        seconds = 0;
        break;
      case "short-break":
        minutes = 5;
        seconds = 0;
        break;
      case "long-break":
        minutes = 15;
        seconds = 0;
        break;
      default:
        minutes = 25;
        seconds = 0;
        break;
    }

    setIsRunning(false);
    setMinutes(minutes);
    setSeconds(seconds);
    setStartTime(null);
  };

  return (
    <main
      ref={colorTheme}
      className="flex min-h-screen select-none flex-col items-center justify-center bg-gradient-to-b p-10 text-white"
    >
      <section className="flex flex-col -space-y-5 text-center text-9xl font-bold drop-shadow-hour">
        <span>{minutes.toString().padStart(2, "0")}</span>
        <span>{seconds.toString().padStart(2, "0")}</span>
      </section>

      <section className="flex w-full max-w-xs justify-center gap-2">
        <button
          onClick={handleToggleIsRunning}
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/25 transition-all"
        >
          <Image
            width={18}
            height={18}
            alt="Toggle start/stop"
            className="pointer-events-none"
            src={`icon/${isRunning ? "pause" : "play"}.svg`}
          />
        </button>
        <button
          ref={resetTimerBtn}
          onClick={handleReset}
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/25 transition-all"
        >
          <Image
            className="pointer-events-none"
            src={"icon/reset.svg"}
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

      <audio ref={notificationSoundRef} src="/sound/alarm.wav" preload="auto" />
    </main>
  );
}

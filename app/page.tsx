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

        setMinutes(newMinutes);
        setSeconds(newSeconds);
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const handleReset = () => {
    handleChangeState(state ?? "pomodoro");
    resetTimerBtn.current?.classList.add("hidden");
  };

  const handleToggleIsRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setStartTime(Date.now());
    }
    resetTimerBtn.current?.classList.toggle("hidden");
  };

  const handleChangeState = (state: string) => {
    setState(state);
    localStorage.setItem("state", state);

    colorTheme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );

    resetTimerBtn.current?.classList.add("hidden");

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
      className="flex min-h-svh select-none flex-col items-center justify-center gap-2 bg-gradient-to-b p-5 text-white"
    >
      <h1 className="text-center text-5xl font-bold">Pomodoro</h1>
      <section className="grid w-full max-w-xl grid-cols-3 gap-2 rounded-sm bg-white/25 p-8">
        <div className="relative col-span-3 flex w-full items-center justify-center">
          <h2 className="text-center text-9xl font-bold drop-shadow-timer">
            {`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </h2>
          <button
            ref={resetTimerBtn}
            onClick={handleReset}
            className="absolute right-0 hidden place-self-center"
          >
            <Image src={"/icon/arrow.svg"} alt="reset" width={18} height={18} />
          </button>
        </div>

        <button onClick={handleToggleIsRunning} className="col-span-3">
          {isRunning ? "Stop" : "Start"}
        </button>

        <button
          id="button-pomodoro"
          onClick={() => handleChangeState("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          id="button-short-break"
          onClick={() => handleChangeState("short-break")}
        >
          Short Break
        </button>
        <button
          id="button-long-break"
          onClick={() => handleChangeState("long-break")}
        >
          Long Break
        </button>
      </section>
      <audio ref={notificationSoundRef} src="/sound/alarm.wav" preload="auto" />
    </main>
  );
}

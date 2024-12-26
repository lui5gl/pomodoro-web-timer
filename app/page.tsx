"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [state, setState] = useState<string>();
  const [isRunning, setIsRunning] = useState(true);

  const colorTheme = useRef<HTMLDivElement>(null);
  const resetTimerBtn = useRef<HTMLButtonElement>(null);
  const notificatonSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(intervalId);
            if (notificatonSoundRef.current) {
              notificatonSoundRef.current.play();
            }
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    document.title = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} - Pomodoro Web Timer`;
    return () => clearInterval(intervalId);
  }, [isRunning, minutes, seconds]);

  function handleToggleIsRunning() {
    setIsRunning(!isRunning);
    resetTimerBtn.current?.classList.remove("hidden");
  }

  function handleReset() {
    handleChangeState(state ?? "pomodoro");
    resetTimerBtn.current?.classList.add("hidden");
  }

  const handleChangeState = (state: string) => {
    setIsRunning(false);
    resetTimerBtn.current?.classList.add("hidden");

    setState(state);
    localStorage.setItem("state_timer", state);

    colorTheme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );

    colorTheme.current?.classList.add(state);

    switch (state) {
      case "pomodoro":
        setMinutes(25);
        setSeconds(0);
        break;

      case "short-break":
        setMinutes(5);
        setSeconds(0);
        break;

      case "long-break":
        setMinutes(15);
        setSeconds(0);
        break;
    }
  };

  useEffect(() => {
    const current_state = localStorage.getItem("state_timer");
    handleChangeState(current_state ?? "pomodoro");
  }, [state]);

  return (
    <main
      ref={colorTheme}
      className="flex min-h-svh select-none flex-col items-center justify-center gap-2 bg-gradient-to-b p-5 text-white"
    >
      <h1 className="text-center text-5xl font-bold">Pomodoro</h1>
      <section className="w-full max-w-xl rounded-sm bg-white/25 p-8">
        <div className="relative flex w-full items-center justify-center">
          <h2 className="text-center text-9xl font-bold drop-shadow-timer">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </h2>
          <button
            ref={resetTimerBtn}
            onClick={handleReset}
            className="absolute right-0 hidden place-self-center transition-all duration-150"
          >
            <Image src={"/icon/arrow.svg"} alt="reset" width={18} height={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
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
        </div>
      </section>

      <Link
        href={"https://github.com/lui5gl/pomodoro-web-timer"}
        target="_blank"
        className="absolute bottom-5 right-5 rounded-sm bg-white/25 p-2 transition-all duration-150 hover:shadow-box active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <Image src={"/icon/github.svg"} alt="GitHub" width={25} height={25} />
      </Link>

      <audio ref={notificatonSoundRef} src="/sound/alarm.wav" preload="auto" />
    </main>
  );
}

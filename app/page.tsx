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
      const playStarted = new Date().getTime();
      const endTimer = playStarted + minutes * 60 * 1000 + seconds * 1000;

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTimer - now;

        const newMinutes = Math.floor(
          (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
        );
        const newSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setMinutes(newMinutes);
        setSeconds(newSeconds);

        if (timeLeft <= 0) {
          notificationSoundRef.current?.play();
          setIsRunning(false);
        }

        document.title = `${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")} - Pomodoro Web Timer`;
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <main
      ref={colorTheme}
      className="pomodoro flex min-h-screen flex-col items-center justify-center bg-linear-to-br p-10 text-white select-none"
    >
      <section className="drop-shadow-hour flex flex-col -space-y-5 text-center text-9xl font-bold">
        <span>{minutes.toString().padStart(2, "0")}</span>
        <span>{seconds.toString().padStart(2, "0")}</span>
      </section>

      <section className="flex w-full max-w-xs justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="hover:shadow-box relative flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
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
          className="hover:shadow-box relative flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
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
          className="hover:shadow-box relative rounded-xs bg-white/25 px-2 transition-all duration-150 [&>option]:text-neutral-800"
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

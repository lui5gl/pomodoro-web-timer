"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);

  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const colorTheme = useRef<HTMLDivElement>(null);
  const selectStateRef = useRef<HTMLSelectElement>(null);

  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const timerIdRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const clearScheduledTick = useCallback(() => {
    if (timerIdRef.current !== null) {
      window.clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  function handleChangeState() {
    setIsRunning(false);
    clearScheduledTick();
    endTimeRef.current = null;
    setTargetTime(null);
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

  const handleToggleRunning = () => {
    setIsRunning((prev) => {
      if (prev) {
        clearScheduledTick();
        endTimeRef.current = null;
        setTargetTime(null);
        return false;
      }

      const totalSeconds = minutes * 60 + seconds;
      if (totalSeconds <= 0) return prev;

      const endTime = Date.now() + totalSeconds * 1000;
      endTimeRef.current = endTime;
      setTargetTime(endTime);

      return true;
    });
  };

  useEffect(() => {
    if (!isRunning || endTimeRef.current === null) {
      clearScheduledTick();
      return;
    }

    const runTick = () => {
      if (endTimeRef.current === null) return;

      const now = Date.now();
      const timeLeft = Math.max(0, endTimeRef.current - now);
      const totalSeconds = Math.ceil(timeLeft / 1000);

      setMinutes(Math.floor(totalSeconds / 60));
      setSeconds(totalSeconds % 60);

      if (timeLeft <= 0) {
        clearScheduledTick();
        endTimeRef.current = null;
        notificationSoundRef.current?.play();
        setIsRunning(false);
        setTargetTime(null);
        return;
      }

      const nextDelay = timeLeft % 1000 || 1000;
      timerIdRef.current = window.setTimeout(runTick, nextDelay);
    };

    clearScheduledTick();
    runTick();

    return clearScheduledTick;
  }, [clearScheduledTick, isRunning]);

  useEffect(() => {
    const currentMinute = minutes.toString().padStart(2, "0");
    const currentSecond = seconds.toString().padStart(2, "0");

    document.title = `${currentMinute}:${currentSecond} - Pomodoro Web Timer`;
  }, [minutes, seconds]);

  const showTargetTime = isRunning && targetTime !== null;

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
          onClick={handleToggleRunning}
          className="hover:shadow-box relative flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Image
            width={18}
            height={18}
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
            width={18}
            height={18}
          />
        </button>
        <select
          ref={selectStateRef}
          onChange={handleChangeState}
          className="hover:shadow-box relative rounded-xs bg-white/25 px-4 transition-all duration-150 [&>option]:text-neutral-800"
        >
          <option value="pomodoro" defaultChecked>
            Pomodoro
          </option>
          <option value="short-break">Short Break</option>
          <option value="long-break">Long Break</option>
        </select>
      </section>

      <div className="relative mt-10 h-6 w-full max-w-xs">
        <p
          aria-hidden={!showTargetTime}
          className={`pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/80 transition-opacity duration-500 ease-out ${
            showTargetTime ? "opacity-100" : "opacity-0"
          }`}
        >
          La alarma se activará a las{" "}
          {targetTime &&
            new Date(targetTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
        </p>
      </div>

      <audio ref={notificationSoundRef} src="sounds/alarm.wav" preload="auto" />
    </main>
  );
}

"use client";

import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { IconPlayerPauseFilled, IconPlayerStop } from "@tabler/icons-react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { IconPlayerStopFilled } from "@tabler/icons-react";

type TimerState = "pomodoro" | "short-break" | "long-break" | "custom";

export default function Home() {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [currentState, setCurrentState] = useState<TimerState>("pomodoro");
  const [customMinutes, setCustomMinutes] = useState<number>(45);

  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const colorTheme = useRef<HTMLDivElement>(null);

  const notificationSoundRef = useRef<HTMLAudioElement>(null);
  const timerIdRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const clearScheduledTick = useCallback(() => {
    if (timerIdRef.current !== null) {
      window.clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const applyState = useCallback(
    (state: TimerState, durationOverride?: number) => {
      setIsRunning(false);
      clearScheduledTick();
      endTimeRef.current = null;
      setTargetTime(null);
      document.title = "Pomodoro Web Timer";

      colorTheme.current?.classList.remove(
        "pomodoro",
        "short-break",
        "long-break",
        "custom",
      );

      colorTheme.current?.classList.add(state);

      let newMinutes = 25;

      if (state === "short-break") newMinutes = 5;
      else if (state === "long-break") newMinutes = 15;
      else if (state === "custom")
        newMinutes = Math.max(1, durationOverride ?? customMinutes);

      setMinutes(newMinutes);
      setSeconds(0);
    },
    [clearScheduledTick, customMinutes],
  );

  const handleResetClick = () => {
    applyState(currentState);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value as TimerState;
    setCurrentState(newState);
    applyState(newState);
  };

  const handleCustomMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Math.max(1, Number(event.target.value) || 1);
    setCustomMinutes(nextValue);

    if (currentState === "custom") {
      applyState("custom", nextValue);
    }
  };

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
          {isRunning ? (
            <IconPlayerPauseFilled size={18} />
          ) : (
            <IconPlayerPlayFilled size={18} />
          )}
        </button>
        <button
          onClick={handleResetClick}
          className="hover:shadow-box relative flex h-8 w-8 items-center justify-center rounded-xs bg-white/25 transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <IconPlayerStopFilled size={18} />
        </button>
        <select
          value={currentState}
          onChange={handleSelectChange}
          className="hover:shadow-box relative rounded-xs bg-white/25 px-4 transition-all duration-150 [&>option]:text-neutral-800"
        >
          <option value="pomodoro">Pomodoro</option>
          <option value="short-break">Short Break</option>
          <option value="long-break">Long Break</option>
          <option value="custom">Personalizado</option>
        </select>
      </section>

      {currentState === "custom" && (
        <label className="mt-4 flex w-full max-w-xs flex-col gap-1 text-sm text-white/80">
          Minutos personalizados
          <input
            type="number"
            min={1}
            value={customMinutes}
            onChange={handleCustomMinutesChange}
            className="rounded-xs border border-white/30 bg-white/20 px-3 py-2 text-base font-semibold text-white outline-none focus:border-white"
          />
        </label>
      )}

      <div className="relative mt-4 h-6 w-full max-w-xs">
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

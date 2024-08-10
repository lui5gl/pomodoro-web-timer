"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import "@app/components/pomodoro.css";

export default function Pomodoro() {
  const color_theme = useRef<HTMLDivElement>(null);
  const reset_button = useRef<HTMLButtonElement>(null);
  const notification_sound = useRef<HTMLAudioElement>(null);

  const [current_minute, setCurrentMinute] = useState(25);
  const [current_second, setCurrentSecond] = useState(0);

  const [is_running, setIsRunning] = useState(false);
  const [state_timer, setStateTimer] = useState("pomodoro");

  // Set the title of the page to the current time
  useEffect(() => {
    document.title = `${current_minute}:${current_second < 10 ? `0${current_second}` : current_second} - Pomodoro Web Timer`;
  }, [current_minute, current_second]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (is_running) {
      intervalId = setInterval(() => {
        if (current_second === 0) {
          if (current_minute === 0) {
            clearInterval(intervalId);
            if (notification_sound.current) {
              notification_sound.current;
            }
          } else {
            setCurrentMinute(current_minute - 1);
            setCurrentSecond(59);
          }
        } else {
          setCurrentSecond(current_second - 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [is_running, current_minute, current_second]);

  function handleIsRunningToggle() {
    setIsRunning(!is_running);
    reset_button.current?.classList.remove("hidden");
  }

  function reset() {
    setIsRunning(false);
    changeStatePomodoro(state_timer);
    reset_button.current?.classList.add("hidden");
  }

  function changeStatePomodoro(state: string) {
    setStateTimer(state);
    setIsRunning(false);

    color_theme.current?.classList.remove(
      "pomodoro",
      "short-break",
      "long-break",
    );

    color_theme.current?.classList.add(state);
    reset_button.current?.classList.add("hidden");

    switch (state) {
      case "pomodoro":
        setCurrentMinute(25);
        setCurrentSecond(0);
        break;

      case "short-break":
        setCurrentMinute(5);
        setCurrentSecond(0);
        break;

      case "long-break":
        setCurrentMinute(15);
        setCurrentSecond(0);
        break;
    }
  }

  return (
    <section
      ref={color_theme}
      className="pomodoro flex min-h-svh select-none flex-col items-center justify-center gap-2 bg-gradient-to-b p-5 text-white"
    >
      <h1 className="text-center text-5xl font-bold">Pomodoro</h1>
      <div className="w-full max-w-xl rounded-sm bg-white/25 p-8">
        <div className="relative flex w-full items-center justify-center">
          <h2 className="text-center text-9xl font-bold drop-shadow-timer">
            {`${current_minute}:${current_second < 10 ? `0${current_second}` : current_second}`}
          </h2>
          <button
            ref={reset_button}
            onClick={reset}
            className="absolute right-0 hidden place-self-center transition-all duration-150"
          >
            <Image src={"/icon/arrow.svg"} alt="reset" width={18} height={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="playButton"
            onClick={handleIsRunningToggle}
            className="col-span-3"
          >
            {is_running ? "Stop" : "Start"}
          </button>

          <button
            id="button-pomodoro"
            onClick={() => changeStatePomodoro("pomodoro")}
          >
            Pomodoro
          </button>
          <button
            id="button-short-break"
            onClick={() => changeStatePomodoro("short-break")}
          >
            Short Break
          </button>
          <button
            id="button-long-break"
            onClick={() => changeStatePomodoro("long-break")}
          >
            Long Break
          </button>
        </div>
      </div>
      {/* Notification end task */}
      <audio
        ref={notification_sound}
        id="audio"
        src="sound/alarm.wav"
        preload="auto"
      />

      <Link
        href={"https://github.com/lui5gl/pomodoro-web-timer"}
        target="_blank"
        className="absolute bottom-5 right-5 rounded-sm bg-white/25 p-2 hover:shadow-box active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        <Image src={"/icon/github.svg"} alt="reset" width={25} height={25} />
      </Link>
    </section>
  );
}

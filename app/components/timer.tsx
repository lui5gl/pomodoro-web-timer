import Image from "next/image";
import React, { useState, useEffect, useRef, RefObject } from "react";

import "@app/components/timer.css";

export default function Timer({
  notification_sound,
  color_theme,
}: {
  notification_sound: RefObject<HTMLAudioElement>;
  color_theme: RefObject<HTMLDivElement>;
}) {
  const reset_button = useRef<HTMLButtonElement>(null);

  const [current_minute, setCurrentMinute] = useState(25);
  const [current_second, setCurrentSecond] = useState(0);

  const [is_running, setIsRunning] = useState(false);
  const [state_timer, setStateTimer] = useState("pomodoro");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (is_running) {
      intervalId = setInterval(() => {
        if (current_second === 0) {
          if (current_minute === 0) {
            clearInterval(intervalId);
            if (notification_sound.current) {
              notification_sound.current.play();
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
    document.title = `${current_minute}:${current_second < 10 ? `0${current_second}` : current_second} - Pomodoro Web Timer`;
    return () => clearInterval(intervalId);
  }, [is_running, current_minute, current_second, notification_sound]);

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
    <section className="w-full max-w-xl rounded-sm bg-white/25 p-8">
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
    </section>
  );
}

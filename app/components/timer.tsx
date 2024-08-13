import Image from "next/image";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";

export default function Timer({
  notification_sound,
  color_theme,
}: {
  notification_sound: RefObject<HTMLAudioElement>;
  color_theme: RefObject<HTMLDivElement>;
}) {
  const [is_running, setIsRunning] = useState(false);
  const [current_minute, setCurrentMinute] = useState(0);
  const [current_second, setCurrentSecond] = useState(0);
  const reset_time_button = useRef<HTMLButtonElement>(null);

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
    reset_time_button.current?.classList.remove("hidden");
  }

  function handleReset() {
    setIsRunning(false);

    let current_status = localStorage.getItem("state_timer");

    if (current_status !== null) {
      handleChangeState(current_status);
    }
    reset_time_button.current?.classList.add("hidden");
  }

  const handleChangeState: any = useCallback(
    (state: string) => {
      reset_time_button.current?.classList.add("hidden");

      localStorage.setItem("state_timer", state);
      setIsRunning(false);

      color_theme.current?.classList.remove(
        "pomodoro",
        "short-break",
        "long-break",
      );

      color_theme.current?.classList.add(state);

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
    },
    [color_theme],
  );

  useEffect(() => {
    const theme_current = localStorage.getItem("state_timer");

    if (theme_current === null) {
      localStorage.setItem("state_timer", "pomodoro");
    }

    handleChangeState(theme_current ?? "pomodoro");
  }, [color_theme, handleChangeState]);

  return (
    <section className="w-full max-w-xl rounded-sm bg-white/25 p-8">
      <div className="relative flex w-full items-center justify-center">
        <h2 className="text-center text-9xl font-bold drop-shadow-timer">
          {`${current_minute}:${current_second < 10 ? `0${current_second}` : current_second}`}
        </h2>
        <button
          ref={reset_time_button}
          onClick={handleReset}
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
  );
}

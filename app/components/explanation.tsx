"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

export default function Explanation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`mt-6 cursor-pointer rounded-xs p-4 text-center text-sm text-white/90 transition-all duration-300 ${
        isOpen ? "bg-white/15" : "animate-pulse"
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col items-center justify-center">
        <IconChevronDown
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
        <span className={`mt-1 font-medium ${isOpen ? "hidden" : ""}`}>
          Learn more
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p>
          This Pomodoro Timer app is designed to help you boost your
          productivity by breaking your work into focused intervals, typically
          25 minutes long, followed by short breaks. It is based on the Pomodoro
          Technique developed by Francesco Cirillo.
        </p>
        <p className="mt-2">
          Use the timer to start a work session, and take breaks as recommended
          to maintain focus and avoid burnout. Customize the duration of your
          work and break intervals to suit your personal workflow.
        </p>
        <p className="mt-2">
          Stay consistent with your sessions, track your progress, and watch
          your productivity soar!
        </p>
      </div>
    </div>
  );
}

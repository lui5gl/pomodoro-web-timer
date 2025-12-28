import { IconChevronDown } from "@tabler/icons-react";

export default function Explanation() {
  return (
    <div className="group hover:shadow-box mt-6 rounded bg-neutral-50/20 p-4 text-center text-sm text-neutral-50 transition-all duration-300 dark:text-neutral-300">
      <div className="flex cursor-pointer flex-col items-center justify-center">
        <IconChevronDown className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
        <span className="mt-1 font-medium group-hover:hidden">Learn more</span>
      </div>

      <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-96 group-hover:opacity-100">
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

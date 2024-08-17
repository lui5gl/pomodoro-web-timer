import "./globals.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pomodoro Web Timer",
  authors: [{ name: "lui5gl", url: "https://github.com/lui5gl" }],
  description:
    "Maximize your productivity and manage your time effectively with Pomodoro Timer. Based on the Pomodoro Technique, our app helps you focus on your tasks by dividing your work into 25-minute intervals followed by short breaks. With an intuitive and user-friendly interface, Pomodoro Timer allows you to start work sessions with just one click and notifies you when it's time to take a break. Customize your work and break intervals according to your needs, and watch your productivity soar with session tracking and detailed statistics. Pomodoro Timer is your essential tool to achieve more in less time while maintaining a healthy balance between work and rest. Optimize your day with Pomodoro Timer and reach your goals efficiently and calmly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={onest.className}>{children}</body>
    </html>
  );
}

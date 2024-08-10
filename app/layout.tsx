import "./globals.css";
import type { Metadata } from "next";
import { Onest } from "next/font/google";

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pomodoro Web Timer",
  description:
    "Maximiza tu productividad y gestiona tu tiempo de manera efectiva con Pomodoro Timer. Basada en la técnica Pomodoro, nuestra aplicación te ayuda a concentrarte en tus tareas dividiendo tu trabajo en intervalos de 25 minutos seguidos de cortos descansos. Con una interfaz intuitiva y fácil de usar, Pomodoro Timer te permite iniciar sesiones de trabajo con un solo clic y te notifica cuando es momento de descansar. Personaliza tus intervalos de trabajo y descanso según tus necesidades, y observa cómo tu productividad se dispara con el seguimiento de sesiones y estadísticas detalladas. Pomodoro Timer es tu herramienta esencial para lograr más en menos tiempo, manteniendo un equilibrio saludable entre trabajo y descanso. ¡Optimiza tu día con Pomodoro Timer y alcanza tus metas de manera eficiente y tranquila! ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={onest.className}>{children}</body>
    </html>
  );
}

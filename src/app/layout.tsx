import "./globals.css";

export const metadata = { title: "ritmo. — planejamento diário", description: "Planejamento diário e tempo focado." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}

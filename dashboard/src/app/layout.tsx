import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Centro de Control de Parcheo",
  description: "Monitoreo de actualizaciones de servidores",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isAuth = !!session;
  const role = (session?.user as any)?.role;
  const username = session?.user?.name ?? undefined;

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100" style={{ zoom: "0.75" }}>
        <SessionProvider>
          {isAuth ? (
            <div className="flex min-h-screen">
              <Sidebar role={role} username={username} />
              <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
                {children}
              </main>
            </div>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}

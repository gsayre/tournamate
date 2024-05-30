import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import MainNav from "./_components/main-nav";
import { Toaster } from "@/components/ui/toaster";
import { getServerAuthSession } from "@/server/auth";

export const metadata = {
  title: "TournaMate",
  description: "Tournament management and participation made easy.",
  icons: [{ rel: "icon", url: "/WhiteLogo.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          {session && <MainNav />}
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import MainNav from "./_components/main-nav";

export const metadata = {
  title: "TournaMate",
  description: "Tournament management and participation made easy.",
  icons: [{ rel: "icon", url: "/WhiteLogo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <MainNav />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

// src/pages/_app.tsx
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { Toaster } from "@/components/ui/toaster";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);

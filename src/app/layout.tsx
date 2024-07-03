import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveMeet | Todas as reuniões da Livemode em um só lugar",
  description:
    "Aqui você encontra todas as reuniões da Livemode em um só lugar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className + ""}>
        <Header />
        <div className="min-h-[calc(100vh-128px)]">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

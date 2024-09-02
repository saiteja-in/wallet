import type { Metadata } from "next";
import { Noto_Sans_Sundanese } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/Theme";
import NavBar from "./components/NavBar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Footer from "./components/Footer";

const inter = Noto_Sans_Sundanese({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "wallet",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {/* <NavBar /> */}
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

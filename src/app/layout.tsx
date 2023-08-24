import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "./components/sidebar";
import ReduxProvider from "@/redux/provider";
import NextThemeProvider from "./providers/themeProvider/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <NextThemeProvider>
            {/* <ThemeProvider> */}
            <div className={"wrapper"}>
              <Sidebar />
              <div className={"wrapperRight"}>{children}</div>
            </div>
            {/* </ThemeProvider> */}
          </NextThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "반납일 리마인더",
  description: "책 반납일을 잊지 않도록 도와드려요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Management Application",
  description: "Curve Digital Solution Customer Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body
        className={`antialiased`}
      > 
          {children}
      </body>
    </html>
  );
}

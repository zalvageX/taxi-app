import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "De Vock Taxi",
  description: "A taxi booking platform in belgium",
};


 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Navbar />
          <main className="relative overflow-hidden">
            {children}
            <Toaster  
              position="top-center" 
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                  border: "1px solid #e53e3e",
                  boxShadow: "0 0 10px rgba(229, 62, 62, 0.7)",
                },
              }}
            />

          </main>
        <Footer />
      </body>
    </html>
  );
}

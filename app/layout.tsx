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
  title: "Taxi De Voc | Reliable Ride Booking in Belgium",
  description: "Book affordable and reliable taxi rides in Belgium: Brussels, Antwerp, Ghent with De Voc Taxi. Easy online scheduling, trusted drivers, and transparent rates for city travel.",
  openGraph: {
    title: "Taxi De Voc | Reliable Ride Booking in Belgium",
    description: "Book affordable and reliable taxi rides in Belgium with De Voc Taxi.",
    url: "https://www.taxidevoc.com",
    siteName: "De Voc Taxi",
    images: [
      {
        url: "/heroBg.png",
        width: 1200,
        height: 630,
        alt: "De Voc Taxi Belgium"
      }
    ],
    locale: "en_BE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi De Voc | Belgium Ride Booking",
    description: "Affordable, reliable taxi rides in Belgium:  Brussels, Antwerp, Ghent with trusted drivers.",
    images: ["/heroBg.png"],
  },
  other: {
    keywords: "Belgium taxi, book taxi Belgium, city rides Belgium, affordable taxi service, De Voc Taxi"
  }
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

import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicMeta from "@/components/DynamicMeta";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Food Trucks Maroc - Constructeur de Food Trucks au Maroc",
  description: "Constructeur de food trucks au Maroc. Solutions mobiles sur mesure pour votre entreprise culinaire. Qualité, innovation et service client exceptionnel.",
  keywords: "food truck, maroc, casablanca, constructeur, mobile, cuisine, restaurant",
  authors: [{ name: "Food Trucks Maroc" }],
  openGraph: {
    title: "Food Trucks Maroc - Constructeur de Food Trucks au Maroc",
    description: "Constructeur de food trucks au Maroc. Solutions mobiles sur mesure pour votre entreprise culinaire.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <DynamicMeta />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getCurrentUser } from "@/lib/dal";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamCar Rental Lucena PH — Premium Car Rental",
  description:
    "Premium, well-maintained car rental in Lucena City, Quezon Province. Sedans, SUVs, MPVs, and vans available with easy online booking.",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme') || 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default async function PublicRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header
            user={
              user
                ? {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role === "CUSTOMER" ? "CUSTOMER" : "ADMIN",
                  }
                : null
            }
          />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

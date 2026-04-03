import { Inter, Noto_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
})

const inter = Inter({
  subsets: ["latin"]
})

export const metadata = {
  title: "Clic-in : Doctor appointment app",
  description: "A free platform where real time Patient-Doctor appointments and meets are appointed",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
         baseTheme: dark,
      }}
    >
      <html
        lang="en"
        className={`${inter.className} no-scrollbar`}
        suppressHydrationWarning
        >
        {/* Header */}
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            // disableTransitionOnChange
          >
            <Header/>
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster richColors/>
            {/* Footer */}
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                Fun projects to create something new!💖
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  subsets: ["latin"]
})

export const metadata = {
  title: "Clic-in : Doctor appointment app",
  description: "A free platform where real time Patient-Doctor appointments and meets are appointed",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} no-scrollbar`}
    >
      {/* Header */}
      <body className="min-h-full flex flex-col">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          Fun projects to create something new!💖
        </div>
      </footer>
    </html>
  );
}

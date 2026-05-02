import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import AuthWrapper from "./components/AuthWrapper";
import { UserDataProvider } from "./lib/UserDataProvider"; // ✅ FIX PATH

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <UserDataProvider>

          <Header />

          <div className="pt-20">
            <PageTransition>{children}</PageTransition>
          </div>

          <Footer />

        </UserDataProvider>

      </body>
    </html>
  );
}
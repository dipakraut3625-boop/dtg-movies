import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import AuthWrapper from "./components/AuthWrapper"; // 👈 NEW

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <Header />

        <div className="mt-16">
          <PageTransition>{children}</PageTransition>
        </div>

        <Footer />

        {/* ✅ AUTH HANDLED HERE */}
        <AuthWrapper />

      </body>
    </html>
  );
}
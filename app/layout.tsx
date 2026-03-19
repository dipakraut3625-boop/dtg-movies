import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <Header />

        {/* ✅ ONLY ONE RENDER */}
        <div className="pt-16 bg-black min-h-screen flex flex-col">

  <div className="flex-1">
    {children}
  </div>

  <Footer />

</div>
      </body>
    </html>
  );
}
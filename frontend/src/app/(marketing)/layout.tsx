import Header from "@/components/landing-page/header/header";
import Footer from "@/components/landing-page/footer/footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

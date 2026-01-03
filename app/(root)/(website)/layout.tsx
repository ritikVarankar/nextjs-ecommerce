import Footer from "@/components/application/Website/Footer";
import Header from "@/components/application/Website/Header";
import { Kumbh_Sans } from "next/font/google";

const kumbhSansFont= Kumbh_Sans({
  weight:['400','500','600','700','800'],
  subsets:['latin'],
  display:'swap'
})
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div  className={`${kumbhSansFont.className}`}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}

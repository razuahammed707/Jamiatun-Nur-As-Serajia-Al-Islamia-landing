import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import Link from "next/link";
import OnudanContent from "@/components/OnudanContent";

export const metadata = {
  title: "অনুদান | জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়া",
  description:
    "জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়ার অনুদান সংক্রান্ত তথ্য ও সহায়তা।",
};

export default function OnudanPage() {
  return (
    <>
      <Header />
      <Navbar />
      <main>
        <section className="page-content-section" style={{ backgroundColor: "#f8f9fa", padding: "0" }}>
          <div className="onudan-container">
            <Link href="/" className="back-link" style={{ marginBottom: "24px" }}>
              ← হোম
            </Link>

            <OnudanContent />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSocial />
    </>
  );
}

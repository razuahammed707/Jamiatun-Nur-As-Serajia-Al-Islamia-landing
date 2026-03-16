import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import Link from "next/link";

export const metadata = {
  title: "ছাত্রদের কার্যক্রম | জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়া",
  description:
    "জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়ার ছাত্রদের বিভিন্ন কার্যক্রম, প্রশিক্ষণ ও সহশিক্ষা কার্যক্রমের তথ্য।",
};

export default function ChhatroKarjokromPage() {
  return (
    <>
      <Header />
      <Navbar />
      <main>
        <section className="page-content-section">
          <div className="container">
            <Link href="/" className="back-link">
              ← হোম
            </Link>
            <h1 className="page-title">ছাত্রদের কার্যক্রম</h1>
            <div className="porichiti-content">
              <p>
                ইনশা-আল্লাহ, এখানে ধীরে ধীরে জামিআ&apos;র ছাত্রদের বিভিন্ন
                কার্যক্রম, প্রশিক্ষণ, প্রতিযোগিতা এবং সহশিক্ষা কার্যক্রমের
                বিবরণ, ছবি ও ভিডিও সংযুক্ত করা হবে।
              </p>
              <p>
                ছাত্রদের কার্যক্রম সংক্রান্ত সাম্প্রতিক আপডেট দেখতে চাইলে আমাদের
                ফেসবুক পেজ ও অন্যান্য সামাজিক যোগাযোগ মাধ্যমগুলো অনুসরণ করতে
                পারেন।
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSocial />
    </>
  );
}


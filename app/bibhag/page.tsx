import Link from "next/link";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";

export const metadata = {
  title: "বিভাগসমূহ | জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়া",
  description:
    "জামিআ'তুন নূর আস সিরাজিয়া আল ইসলামিয়ার বিভিন্ন বিভাগ ও তাদের সংক্ষিপ্ত পরিচিতি।",
};

export default function BibhagPage() {
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
            <h1 className="page-title">বিভাগসমূহ</h1>
            <div className="porichiti-content">
              <p className="about-lead">
                জামিআ&apos;তুন নূর আস সিরাজিয়া আল ইসলামিয়ায় বর্তমানে নিম্নোক্ত বিভাগসমূহ চালু রয়েছে:
              </p>
              <ul className="about-list">
                <li>
                  <strong>Pre-School &amp; Care:</strong> বাচ্চাদের জন্য ভালোবাসা ও যত্নের পরিবেশে আলিফ-বা-তা,
                  বাংলা-ইংরেজি অক্ষর চেনা, ছোট ছোট দোআ, সূরা ও আদব-কায়দা শেখানোর প্রাথমিক দ্বীনি শিক্ষা কেন্দ্র।
                </li>
                <li>
                  <strong>আদর্শ নুরানী বিভাগ:</strong> নূরানী পদ্ধতিতে সঠিক তাজবীদসহ কুরআন শিক্ষার পাশাপাশি আকীদা, ফিকহের
                  প্রাথমিক মাসআলা, নামাজ-রোজা সম্পর্কিত জরুরি শিক্ষার সমন্বয়ে গঠিত ভিত্তি স্তর।
                </li>
                <li>
                  <strong>নাযেরা বিভাগ:</strong> যারা কুরআন শরীফ সাবলীল ও শুদ্ধভাবে তিলাওয়াত করতে চায় তাদের জন্য বিশেষ ব্যবস্থা;
                  প্রতিদিন সাবক, দূরস্ত ও সংশোধনের মাধ্যমে মিষ্টি কণ্ঠে সুশৃঙ্খল কিরআত গড়ে তোলা হয়।
                </li>
                <li>
                  <strong>হিফজুল কুরআন:</strong> কুরআন হিফজের উপযোগী শিক্ষার্থীদের জন্য পূর্ণকালীন হিফজ কোর্স; কড়া নজরদারিতে
                  সাবক, সাবাকি, মদ্‌রাইস ও বিভিন্ন পরীক্ষার মাধ্যমে হিফজকে মজবুত ও স্থায়ী করার চেষ্টা করা হয়।
                </li>
                <li>
                  <strong>কিতাব বিভাগ:</strong> প্রাথমিক কিতাব থেকে দাওরায়ে হাদীস পর্যন্ত দারুল উলূমের আদলে সাজানো পাঠ্যক্রম;
                  যেখানে কুরআন, হাদীস, ফিকহ, উসূল, আরবি ভাষা ও সমসাময়িক প্রয়োজনীয় জ্ঞান শেখানো হয় যোগ্য আলেম তৈরি করার
                  লক্ষ্যে।
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSocial />
    </>
  );
}


import { verifyToken } from "@/lib/auth";

export default async function Navbar() {
  const session = await verifyToken();

  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <div className="navbar-inner">
          {session ? (
            <a href="/admin/dashboard" className="nav-item home-btn active">
              🏠 ড্যাশবোর্ড
            </a>
          ) : (
            <a href="/admin/login" className="nav-item home-btn active">
              🏠 লগইন
            </a>
          )}

          {/* জামিয়া পরিচিতি + dropdown */}
          <div className="nav-dropdown-wrapper">
            <a href="/porichiti" className="nav-item has-dropdown">
              জামিয়া পরিচিতি
            </a>
            <div className="nav-dropdown">
              <a href="/porichiti" className="nav-dropdown-item">
                জামিয়া পরিচিতি
              </a>
              <a href="/laksho-uddesho" className="nav-dropdown-item">
                লক্ষ্য ও উদ্দেশ্য
              </a>
              <a href="/mulniti" className="nav-dropdown-item">
                মূলনীতি
              </a>

            </div>
          </div>

          {/* বিভাগসমূহ */}
          <a href="/bibhag" className="nav-item">
            বিভাগসমূহ
          </a>

          {/* অনুদান */}
          <a href="/onudan" className="nav-item">
            অনুদান
          </a>

          {/* ছাত্রদের কার্যক্রম */}
          <a href="/chhatro-karjokrom" className="nav-item">
            ছাত্রদের কার্যক্রম
          </a>

          <a href="/jogajog" className="nav-item">
            যোগাযোগ
          </a>
        </div>
      </div>
    </nav>
  );
}

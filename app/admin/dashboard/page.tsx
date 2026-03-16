"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminDonations from "@/components/AdminDonations";
import AdminVideos from "@/components/AdminVideos";

interface Post {
  id: string;
  title: string;
  content?: string | null;
  type: "NEWS" | "NOTICE";
  active: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"NEWS" | "NOTICE" | "DONATIONS" | "VIDEOS">("NEWS");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [totalNotice, setTotalNotice] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteModalPost, setDeleteModalPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const fetchPosts = useCallback(async (pageNum: number = page) => {
    if (activeTab === "DONATIONS" || activeTab === "VIDEOS") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts?all=true&type=${activeTab}&page=${pageNum}&limit=6`
      );
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotalPages(data.totalPages ?? 1);
      if (data.totalNews != null) setTotalNews(data.totalNews);
      if (data.totalNotice != null) setTotalNotice(data.totalNotice);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, router]);

  useEffect(() => {
    fetchPosts(page);
  }, [activeTab, page, fetchPosts]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim() || undefined,
          type: activeTab === "NEWS" || activeTab === "NOTICE" ? activeTab : "NEWS",
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed");

      setNewTitle("");
      setNewContent("");
      await fetchPosts();
      showSuccess(
        activeTab === "NEWS" ? "✅ সংবাদ যোগ হয়েছে!" : "✅ নোটিশ যোগ হয়েছে!"
      );
    } catch {
      alert("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      setDeleteModalPost(null);
      await fetchPosts();
      showSuccess("🗑️ মুছে ফেলা হয়েছে");
    } catch {
      showSuccess("মুছতে সমস্যা হয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim() || null,
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      await fetchPosts();
      showSuccess("✏️ সম্পাদনা হয়েছে");
    } catch {
      alert("সম্পাদনায় সমস্যা হয়েছে");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const newsCount = totalNews;
  const noticeCount = totalNotice;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && posts.length === 0 && activeTab !== "DONATIONS" && activeTab !== "VIDEOS") {
    return (
      <div className="admin-loading">
        <div className="admin-loader">
          <div className="admin-loader-ring admin-loader-ring-outer" />
          <div className="admin-loader-ring admin-loader-ring-inner" />
          <div className="admin-loader-icon">🕌</div>
        </div>
        <p className="admin-loading-text">লোড হচ্ছে...</p>
      </div>
    );
  }

  const toggleTab = (tab: "NEWS" | "NOTICE" | "DONATIONS" | "VIDEOS") => {
    setActiveTab(tab);
    setPage(1);
    setIsMenuOpen(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <span className="admin-topbar-icon">🕌</span>
            <h1>অ্যাডমিন প্যানেল</h1>
          </div>
          <div className="admin-topbar-right">
            <a href="/" className="admin-topbar-link desktop-only" target="_blank">
              🌐 ওয়েবসাইট দেখুন
            </a>
            <button onClick={handleLogout} className="admin-logout-btn desktop-only">
              🚪 লগআউট
            </button>
            <button 
              className="admin-mobile-menu-btn" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="admin-mobile-nav">
            <button className={`admin-mobile-nav-item ${activeTab === "NEWS" ? "active" : ""}`} onClick={() => toggleTab("NEWS")}>📰 সংবাদ</button>
            <button className={`admin-mobile-nav-item ${activeTab === "NOTICE" ? "active" : ""}`} onClick={() => toggleTab("NOTICE")}>📌 নোটিশ</button>
            <button className={`admin-mobile-nav-item ${activeTab === "DONATIONS" ? "active" : ""}`} onClick={() => toggleTab("DONATIONS")}>💰 অনুদান</button>
            <button className={`admin-mobile-nav-item ${activeTab === "VIDEOS" ? "active" : ""}`} onClick={() => toggleTab("VIDEOS")}>🎥 ভিডিও</button>
            <div style={{ padding: '10px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <a href="/" target="_blank" className="admin-mobile-nav-item">🌐 ওয়েবসাইট দেখুন</a>
              <button onClick={handleLogout} className="admin-mobile-nav-item" style={{ color: '#ff6b6b' }}>🚪 লগআউট</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Success Message */}
        {successMsg && (
          <div className="admin-success-toast">{successMsg}</div>
        )}

        {/* Stats Cards - Hidden on Mobile */}
        <div className="admin-stats">
          <div className="admin-stat-card stat-news" onClick={() => setActiveTab("NEWS")} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">📰</div>
            <div className="stat-info">
              <span className="stat-number">{newsCount}</span>
              <span className="stat-label">মোট সংবাদ</span>
            </div>
          </div>
          <div className="admin-stat-card stat-notice" onClick={() => setActiveTab("NOTICE")} style={{ cursor: 'pointer' }}>
            <div className="stat-icon">📌</div>
            <div className="stat-info">
              <span className="stat-number">{noticeCount}</span>
              <span className="stat-label">মোট নোটিশ</span>
            </div>
          </div>
          <div className="admin-stat-card stat-donations" onClick={() => setActiveTab("DONATIONS")} style={{ cursor: 'pointer', background: '#ebf8ff', borderColor: '#bee3f8' }}>
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-number" style={{ color: '#2b6cb0' }}>💰</span>
              <span className="stat-label">অনুদান মডারেট করুন</span>
            </div>
          </div>
          <div className="admin-stat-card stat-videos" onClick={() => setActiveTab("VIDEOS")} style={{ cursor: 'pointer', background: '#fff5f5', borderColor: '#fed7e2' }}>
            <div className="stat-icon">🎥</div>
            <div className="stat-info">
              <span className="stat-number" style={{ color: '#c53030' }}>🎥</span>
              <span className="stat-label">ভিডিও গ্যালারি</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher - Hidden on Mobile */}
        <div className="admin-tabs desktop-tabs">
          <button
            className={`admin-tab ${activeTab === "NEWS" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("NEWS");
              setPage(1);
            }}
          >
            📰 সংবাদ
          </button>
          <button
            className={`admin-tab ${activeTab === "NOTICE" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("NOTICE");
              setPage(1);
            }}
          >
            📌 নোটিশ
          </button>
          <button
            className={`admin-tab ${activeTab === "DONATIONS" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("DONATIONS");
              setPage(1);
            }}
          >
            💰 অনুদান
          </button>
          <button
            className={`admin-tab ${activeTab === "VIDEOS" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("VIDEOS");
              setPage(1);
            }}
          >
            🎥 ভিডিও
          </button>
        </div>

        {activeTab === "DONATIONS" ? (
          <AdminDonations />
        ) : activeTab === "VIDEOS" ? (
          <AdminVideos />
        ) : (
          <>
            {/* Add New Form */}
            <div className="admin-add-card">
              <h2>
                {activeTab === "NEWS" ? "📰 নতুন সংবাদ যোগ করুন" : "📌 নতুন নোটিশ যোগ করুন"}
              </h2>
              <form onSubmit={handleCreate} className="admin-add-form">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    activeTab === "NEWS"
                      ? "সংবাদের শিরোনাম লিখুন..."
                      : "নোটিশের শিরোনাম লিখুন..."
                  }
                  required
                  className="admin-add-input"
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="বিস্তারিত (ঐচ্ছিক)"
                  className="admin-add-textarea"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-add-btn"
                >
                  {submitting ? "⏳ যোগ হচ্ছে..." : "➕ যোগ করুন"}
                </button>
              </form>
            </div>

            {/* Posts List */}
            <div className="admin-posts-list">
              <h2>
                {activeTab === "NEWS"
                  ? `📰 সংবাদ তালিকা (${newsCount}টি)`
                  : `📌 নোটিশ তালিকা (${noticeCount}টি)`}
              </h2>

              {posts.length === 0 ? (
                <div className="admin-empty">
                  <span className="admin-empty-icon">📭</span>
                  <p>কোনো {activeTab === "NEWS" ? "সংবাদ" : "নোটিশ"} নেই</p>
                  <p className="admin-empty-hint">
                    উপরের ফর্ম থেকে নতুন যোগ করুন
                  </p>
                </div>
              ) : (
                <div className="admin-posts-cards">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`admin-post-card ${!post.active ? "inactive" : ""}`}
                    >
                      {editingId === post.id ? (
                        <div className="admin-edit-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="admin-edit-input"
                            autoFocus
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="বিস্তারিত (ঐচ্ছিক)"
                            className="admin-edit-textarea"
                            rows={3}
                          />
                          <div className="admin-edit-actions">
                            <button
                              onClick={() => handleEdit(post.id)}
                              className="admin-btn save"
                            >
                              ✅ সংরক্ষণ
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditTitle("");
                              }}
                              className="admin-btn cancel"
                            >
                              ❌ বাতিল
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="admin-post-content">
                            <div className="admin-post-header">
                              <span className="admin-post-date">
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                            <p className="admin-post-title admin-post-title-truncate">{post.title}</p>
                          {post.content && (
                            <p className="admin-post-content-preview">{post.content}</p>
                          )}
                          </div>
                          <div className="admin-post-actions">
                            <button
                              onClick={() => {
                                setEditingId(post.id);
                                setEditTitle(post.title);
                                setEditContent(post.content ?? "");
                              }}
                              className="admin-btn edit"
                            >
                              ✏️ এডিট করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModalPost(post)}
                              className="admin-btn delete"
                            >
                              🗑️ ডিলিট করুন
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {posts.length > 0 && totalPages > 1 && (
                <div className="admin-pagination">
                  <button
                    type="button"
                    className="admin-pagination-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← আগে
                  </button>
                  <span className="admin-pagination-info">
                    পৃষ্ঠা {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="admin-pagination-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    পরবর্তী →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteModalPost && (
        <div
          className="admin-modal-overlay"
          onClick={() => !deleting && setDeleteModalPost(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-delete-modal-title"
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="admin-delete-modal-title" className="admin-modal-title">
              মুছে ফেলুন
            </h3>
            <p className="admin-modal-message">
              আপনি কি নিশ্চিত মুছে ফেলতে চান?
            </p>
            <p className="admin-modal-post-title">{deleteModalPost.title}</p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-btn admin-modal-cancel"
                onClick={() => !deleting && setDeleteModalPost(null)}
                disabled={deleting}
              >
                বাতিল
              </button>
              <button
                type="button"
                className="admin-modal-btn admin-modal-confirm"
                onClick={() => handleDelete(deleteModalPost.id)}
                disabled={deleting}
              >
                {deleting ? "মুছছে..." : "মুছুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

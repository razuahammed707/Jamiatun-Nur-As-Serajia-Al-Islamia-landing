"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setVideos(data);
    } catch {
      console.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, youtubeId }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed");

      setTitle("");
      setYoutubeId("");
      await fetchVideos();
      showSuccess("✅ ভিডিও যোগ হয়েছে!");
    } catch {
      alert("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      await fetchVideos();
      showSuccess("🗑️ ভিডিও মুছে ফেলা হয়েছে");
    } catch {
      alert("মুছে ফেলতে সমস্যা হয়েছে");
    }
  };

  if (loading && videos.length === 0) {
    return <div className="admin-loading"><p>লোড হচ্ছে...</p></div>;
  }

  return (
    <div className="admin-videos">
      {successMsg && <div className="admin-success-toast">{successMsg}</div>}
      
      <div className="admin-add-card">
        <h2>🎥 নতুন ভিডিও যোগ করুন</h2>
        <form onSubmit={handleAdd} className="admin-add-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ভিডিওর শিরোনাম..."
            required
            className="admin-add-input"
          />
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="ইউটিউব ভিডিওID বা লিঙ্ক..."
            required
            className="admin-add-input"
          />
          <button type="submit" disabled={submitting} className="admin-add-btn">
            {submitting ? "⏳ যোগ হচ্ছে..." : "➕ যোগ করুন"}
          </button>
        </form>
      </div>

      <div className="admin-posts-list" style={{ marginTop: '30px' }}>
        <h2>🎥 ভিডিও তালিকা</h2>
        {videos.length === 0 ? (
          <div className="admin-empty"><p>কোনো ভিডিও নেই</p></div>
        ) : (
          <div className="admin-posts-cards">
            {videos.map((v) => (
              <div key={v.id} className="admin-post-card">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img 
                    src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} 
                    alt={v.title}
                    style={{ width: '120px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', margin: 0 }}>{v.title}</p>
                    <p style={{ fontSize: '0.8rem', color: '#718096' }}>ID: {v.youtubeId}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(v.id)} 
                    className="admin-btn delete"
                    style={{ padding: '8px 12px' }}
                  >
                    🗑️ মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

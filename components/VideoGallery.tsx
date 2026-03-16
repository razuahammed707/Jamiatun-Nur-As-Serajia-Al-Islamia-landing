"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
}

export default function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const data = await res.json();
          // If no videos in DB, we could show default ones or stay empty
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <section className="video-section">
        <div className="container">
          <div className="section-title-alt">ভিডিও গ্যালারি</div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>লোড হচ্ছে...</div>
        </div>
      </section>
    );
  }

  // If DB is empty, don't show the section or show a message
  if (videos.length === 0) return null;

  return (
    <section className="video-section" id="videos">
      <div className="container">
        <div className="section-title-alt">ভিডিও গ্যালারি</div>

        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-container" style={{ 
                borderRadius: "12px", 
                overflow: "hidden",
                position: "relative",
                paddingBottom: "56.25%", 
                height: 0,
                background: "#000",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}>
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="video-card-label" style={{ 
                marginTop: "12px", 
                fontWeight: "700", 
                color: "#2d3748",
                fontSize: "0.95rem"
              }}>
                {video.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

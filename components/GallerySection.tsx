"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function GallerySection() {
  const images = [
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0017_f3fc0v.jpg",
      alt: "Madrasa Activity 1",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0015_iva5oo.jpg",
      alt: "Madrasa Activity 2",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0014_p6ccyj.jpg",
      alt: "Madrasa Activity 3",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0003_yruoik.jpg",
      alt: "Madrasa Activity 4",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0013_b0j7q3.jpg",
      alt: "Madrasa Activity 5",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306741/IMG-20260312-WA0004_a9z871.jpg",
      alt: "Madrasa Activity 6",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306740/IMG-20260312-WA0002_gm4md9.jpg",
      alt: "Madrasa Activity 7",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306740/IMG-20260312-WA0008_p7sybi.jpg",
      alt: "Madrasa Activity 8",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306740/IMG-20260312-WA0016_todmsv.jpg",
      alt: "Madrasa Activity 9",
    },
    {
      url: "https://res.cloudinary.com/davcfmd78/image/upload/v1773306740/IMG-20260312-WA0007_smfscs.jpg",
      alt: "Madrasa Activity 10",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef<(HTMLDivElement | null)[]>([]);

  // For responsive Facebook Embedded Page plugin
  const [fbWidth, setFbWidth] = useState(340);
  const fbContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbnailsRef.current[activeIndex]) {
      thumbnailsRef.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (fbContainerRef.current) {
        const parentWidth = fbContainerRef.current.offsetWidth;
        // 32 is padding (16px on each side). FB min=180 max=500
        const calculatedWidth = Math.floor(parentWidth - 32);
        const newWidth = Math.min(Math.max(calculatedWidth, 180), 500);
        setFbWidth(newWidth);
      }
    };

    // Delay initial calculation slightly to ensure CSS grid has rendered
    const timeoutId = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-title">🖼️ ছবি গ্যালারি</div>

        <div className="gallery-grid" style={{ marginTop: 20 }}>
          {/* Photo Carousel */}
          <div className="gallery-carousel" style={{ 
            background: "transparent", 
            boxShadow: "none",
            display: "flex",
            flexDirection: "column"
          }}>
            <div
              className="gallery-main-img"
              style={{
                width: "100%",
                flex: 1, // Allow it to grow
                minHeight: "450px", // Baseline height
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                background: "transparent",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            {/* Thumbnails strip */}
            <div className="gallery-thumbnails" style={{ background: "transparent", padding: "12px 0 0 0", marginTop: "8px" }}>
              <button 
                className="gallery-thumb-nav" 
                aria-label="Previous"
                onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              >
                ‹
              </button>
              <div style={{ display: "flex", gap: "10px", overflowX: "auto", flex: 1, padding: "2px", scrollbarWidth: "none" }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    ref={(el) => { thumbnailsRef.current[idx] = el; }}
                    className={`gallery-thumb ${idx === activeIndex ? "active" : ""}`}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: 70,
                      height: 50,
                      position: "relative",
                      flexShrink: 0,
                      cursor: "pointer",
                      borderRadius: 6,
                      overflow: "hidden",
                      border: idx === activeIndex ? "3px solid var(--primary-green)" : "3px solid transparent",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              <button 
                className="gallery-thumb-nav" 
                aria-label="Next"
                onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              >
                ›
              </button>
            </div>
          </div>

          {/* Facebook Embed */}
          <div ref={fbContainerRef} style={{ 
            display: "flex", 
            flexDirection: "column",
            height: "100%",
            background: "linear-gradient(to bottom, #ffffff, #f0f2f5)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}>
            <div className="facebook-embed-header" style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #0d5bc5 0%, #0a4090 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontWeight: "600",
              fontSize: "1.05rem",
              boxShadow: "0 2px 10px rgba(24, 119, 242, 0.2)"
            }}>
              <span className="fb-icon" style={{ 
                background: "white", 
                borderRadius: "50%", 
                padding: "4px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#1877f2"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              আমাদের ফেসবুক পেজ
              <a 
                href="https://www.facebook.com/profile.php?id=61555232242818" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  marginLeft: "auto",
                  fontSize: "0.8rem",
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  color: "white",
                  textDecoration: "none",
                  transition: "background 0.2s"
                }}
              >
                Follow Page
              </a>
            </div>
            
            <div className="facebook-embed-body" style={{ 
              padding: "16px", 
              flex: 1, 
              display: "flex", 
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              overflowX: "hidden"
            }}>
              <div style={{
                width: `${fbWidth}px`,
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "center",
                transition: "width 0.3s ease",
              }}>
                <iframe
                  key={fbWidth} // Force reloading iframe when width changes for perfect alignment
                  src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61555232242818&tabs=timeline&width=${fbWidth}&height=550&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                  width={fbWidth}
                  height="550"
                  style={{ 
                    border: "none", 
                    overflow: "hidden",
                    display: "block"
                  }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


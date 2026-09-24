"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { JSX } from "react/jsx-runtime";

/** Simple gallery-only image list (no links) */
const IMAGES = [
  { id: 1, src: "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/9.jpeg?raw=true", alt: "" },
  { id: 2, src: "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/10.jpeg?raw=true", alt: "" },
  { id: 3, src: "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/11.jpeg?raw=true", alt: "" },
  { id: 4, src: "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/12.jpeg?raw=true", alt: "" },
  { id: 5, src: "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/13.jpeg?raw=true", alt: "" }
          
];

export function Project15(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  // touch handlers for swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setOpenIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setOpenIndex(null);
    document.body.style.overflow = "";
  }, []);

  const showNext = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % IMAGES.length;
    });
  }, []);

  const showPrev = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + IMAGES.length) % IMAGES.length;
    });
  }, []);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, closeLightbox, showNext, showPrev]);

  // focus management: focus the lightbox when opened
  useEffect(() => {
    if (openIndex !== null && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [openIndex]);

  // touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 50; // px
    if (dx > threshold) {
      showNext();
    } else if (dx < -threshold) {
      showPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="gallery-root" style={{ minHeight: "100vh", padding: "24px", boxSizing: "border-box", background: "var(--bg, #f8fafc)" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: "clamp(18px, 2.6vw, 28px)", color: "var(--text, #0b1220)" }}> </h2>

      {/* Responsive thumbnail grid */}
      <div
        className="thumb-grid"
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          alignItems: "stretch"
        }}
      >
        {IMAGES.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => openLightbox(idx)}
            className="thumb-button"
            aria-label={`فتح الصورة ${idx + 1}: ${img.alt}`}
            style={{
              display: "block",
              width: "100%",
              height: 0,
              paddingBottom: "66.66%", // 3:2 ratio
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: "0 8px 28px rgba(2,6,23,0.06)",
              background: "#fff",
              border: "1px solid rgba(12,20,40,0.04)",
              cursor: "pointer"
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform .45s cubic-bezier(.2,.8,.2,1), filter .35s",
                willChange: "transform"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
                (e.currentTarget as HTMLImageElement).style.filter = "brightness(0.98)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLImageElement).style.filter = "brightness(1)";
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`عرض الصورة ${openIndex + 1}`}
          tabIndex={-1}
          ref={lightboxRef}
          className="lightbox"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(2,6,23,0.72)",
            padding: 20
          }}
        >
          <div
            className="lightbox-inner"
            style={{
              width: "min(1200px, 100%)",
              maxHeight: "90vh",
              display: "flex",
              gap: 16,
              alignItems: "center"
            }}
          >
            {/* Prev button */}
            <button
              onClick={showPrev}
              aria-label="السابق"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "none",
                color: "#fff",
                width: 52,
                height: 52,
                borderRadius: 999,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 28,
                lineHeight: 1
              }}
            >
              ‹
            </button>

            {/* Image container */}
            <figure
              style={{
                flex: "1 1 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "90vh",
                margin: 0
              }}
            >
              <img
                src={IMAGES[openIndex].src}
                alt={IMAGES[openIndex].alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(2,6,23,0.6)"
                }}
              />
            </figure>

            {/* Right controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch", flexShrink: 0 }}>
              <button
                onClick={showNext}
                aria-label="التالي"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "none",
                  color: "#fff",
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 28
                }}
              >
                ›
              </button>

              <button
                onClick={closeLightbox}
                aria-label="إغلاق"
                style={{
                  marginTop: 6,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer"
                }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .thumb-button:focus {
          outline: 3px solid rgba(34,197,94,0.6);
          outline-offset: 4px;
        }
        .thumb-button img {
          transition: transform .45s cubic-bezier(.2,.8,.2,1);
        }
        @media (max-width: 640px) {
          .lightbox-inner {
            flex-direction: column;
          }
          .lightbox-inner > button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

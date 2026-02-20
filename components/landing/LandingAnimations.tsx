"use client";

import { useEffect } from "react";

export default function LandingAnimations() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <style jsx global>{`
      /* ====== ENTRANCE ANIMATIONS ====== */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }
      @keyframes floatDelayed {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }

      .animate-fade-in {
        animation: fadeIn 0.6s ease-out both;
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.7s ease-out both;
        animation-delay: 0.1s;
      }
      .animate-fade-in-up-delay {
        animation: fadeInUp 0.7s ease-out both;
        animation-delay: 0.25s;
      }
      .animate-fade-in-up-delay-2 {
        animation: fadeInUp 0.7s ease-out both;
        animation-delay: 0.4s;
      }
      .animate-fade-in-up-delay-3 {
        animation: fadeInUp 0.8s ease-out both;
        animation-delay: 0.55s;
      }
      .animate-float-slow {
        animation: floatSlow 5s ease-in-out infinite;
      }
      .animate-float-delayed {
        animation: floatDelayed 4s ease-in-out infinite;
        animation-delay: 1.5s;
      }

      /* ====== SCROLL ANIMATIONS ====== */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      .animate-on-scroll.animate-visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* ====== SMOOTH SCROLL ====== */
      html {
        scroll-behavior: smooth;
      }

      /* ====== DETAILS/SUMMARY ====== */
      details > summary::-webkit-details-marker,
      details > summary::marker {
        display: none;
        content: "";
      }
    `}</style>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function LargeTestimonial({
  reviews = null,
  autoplay = true,
  autoplayInterval = 4500,
}: {
  reviews?: any[] | null;
  autoplay?: boolean;
  autoplayInterval?: number;
}) {
  const fallback = [
    {
      id: 1,
      quote:
        "This is the first expense tracker I actually use every single day. It feels natural - no typing, no forms. Just telling it my expenses feels magical.",
      name: "Krishna",
      role: "Software Developer, CCC",
      avatar: "/images/guillermo-rauch.png",
    },
    {
      id: 2,
      quote:
        "Kharcha Mind is an AI-driven expense manager designed to make tracking your daily spending effortless. I’ve built this app to help you stay smarter with your money.",
      name: "Sadiq Raza",
      role: "Software Developer, CCC",
      avatar: "/images/sadiq-image.jpg",
    },
  ];

  const items = reviews && reviews.length > 0 ? reviews : fallback;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!autoplay) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, autoplayInterval);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [items.length, autoplay, autoplayInterval]);

  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
    resetTimer();
  }
  function next() {
    setIndex((i) => (i + 1) % items.length);
    resetTimer();
  }
  function goTo(i: number) {
    setIndex(i);
    resetTimer();
  }
  function resetTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      if (autoplay) {
        timerRef.current = window.setInterval(() => {
          setIndex((i) => (i + 1) % items.length);
        }, autoplayInterval);
      }
    }
  }

   return (
    <section
      className="w-full px-5 overflow-hidden flex justify-center items-center"
      style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
    >
      <div className="w-full max-w-[1100px] relative">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`transition-transform duration-500 ease-in-out transform ${
              i === index
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0 pointer-events-none absolute inset-0"
            }`}
            aria-hidden={i === index ? "false" : "true"}
            style={{ display: i === index ? "block" : "none" }}
          >
            <div className="px-4 py-12 md:px-6 md:py-16 lg:py-28 flex flex-col items-start gap-2">
              <div className="self-stretch flex justify-between items-center">
                {/* CARD */}
                <div
                  className="flex-1 px-4 py-8 md:px-12 lg:px-20 md:py-8 lg:py-10 rounded-lg flex flex-col justify-center items-center gap-8 backdrop-blur-md border"
                  style={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--card-foreground))",
                  }}
                >
                  {/* QUOTE */}
                  <div
                    className="w-full max-w-[1024px] text-center leading-7 md:leading-10 lg:leading-[64px] font-medium text-lg md:text-3xl lg:text-6xl"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {item.quote}
                  </div>
  
                  {/* AVATAR + NAME */}
                  <div className="flex justify-start items-center gap-5 mt-6">
                    <Image
                      src={item.avatar}
                      alt={`${item.name} avatar`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                      style={{ border: "1px solid hsl(var(--border))" }}
                    />
  
                    <div className="flex flex-col justify-start items-start">
                      <div
                        className="text-base font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {item.name}
                      </div>
  
                      <div
                        className="text-sm font-normal"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {item.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
  
        {/* LEFT ARROW */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur"
          style={{
            backgroundColor: "hsl(var(--muted) / 0.4)",
            color: "hsl(var(--foreground))",
          }}
        >
          ◀
        </button>
  
        {/* RIGHT ARROW */}
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur"
          style={{
            backgroundColor: "hsl(var(--muted) / 0.4)",
            color: "hsl(var(--foreground))",
          }}
        >
          ▶
        </button>
  
        {/* DOTS */}
        <div className="flex justify-center items-center gap-3 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all`}
              style={{
                backgroundColor:
                  i === index
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground-light))",
                transform: i === index ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
  
}

"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "professional" | "personal";

interface GalleryImage {
  src: string;
  caption: string;
  category: Category;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [category, setCategory] = useState<Category>("professional");
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setImages(data.images ?? []))
      .catch(() => setImages([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const visible = useMemo(
    () => images.filter((image) => image.category === category),
    [images, category]
  );

  if (images.length === 0) return null;

  return (
    <section className="w-full max-w-3xl mx-auto mt-20 pt-10 border-t border-white/20">
      <h2 className="text-2xl font-semibold tracking-tight text-center mb-6">
        Gallery
      </h2>

      <div className="flex justify-center gap-2 mb-6">
        {(["professional", "personal"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setCategory(option)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              category === option
                ? "bg-white/20 border-white/40"
                : "bg-transparent border-white/10 hover:bg-white/10"
            }`}
          >
            {option === "professional" ? "Professional" : "Personal"}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-sm text-white/60">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visible.map((image) => (
            <button
              key={image.src}
              onClick={() => setSelected(image)}
              className="aspect-square overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm
                         border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.caption || ""}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setSelected(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.src}
            alt={selected.caption || ""}
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
          />
          {selected.caption && (
            <p className="mt-4 text-sm text-white/90 max-w-md text-center">
              {selected.caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

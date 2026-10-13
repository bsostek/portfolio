"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const RESUME_URL = "/resume.docx";

export default function ResumePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        // docx-preview touches the DOM, so load it only in the browser.
        const [{ renderAsync }, res] = await Promise.all([
          import("docx-preview"),
          fetch(RESUME_URL),
        ]);
        if (!res.ok) throw new Error(`Failed to fetch resume: ${res.status}`);
        const blob = await res.blob();
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        await renderAsync(blob, containerRef.current, undefined, {
          className: "docx",
          inWrapper: false,
          ignoreLastRenderedPageBreak: true,
        });
        if (!cancelled) {
          setStatus("ready");
          fitToWidth();
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
      }
    }

    // The rendered document is a fixed-width letter page, so shrink it to fit narrow screens.
    function fitToWidth() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      const page = container?.querySelector<HTMLElement>("section.docx");
      if (!wrapper || !container || !page) return;
      container.style.zoom = String(Math.min(1, wrapper.clientWidth / page.offsetWidth));
    }

    render();
    window.addEventListener("resize", fitToWidth);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fitToWidth);
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-16 pb-16">
      <div className="w-full max-w-[850px] flex items-center justify-between mb-6">
        <Link href="/" className="text-sm hover:underline">
          ← Back home
        </Link>
        <a
          href={RESUME_URL}
          download="Brian-Sostek-Resume.docx"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Download
        </a>
      </div>

      {status === "loading" && <p className="text-sm opacity-80">Loading resume…</p>}
      {status === "error" && (
        <p className="text-sm">
          Couldn&apos;t display the resume here.{" "}
          <a href={RESUME_URL} download className="underline">
            Download it instead
          </a>
          .
        </p>
      )}

      <div ref={wrapperRef} className="w-full min-w-0 max-w-[850px] flex justify-center overflow-hidden">
        <div ref={containerRef} className="bg-white text-black shadow-lg" />
      </div>
    </main>
  );
}

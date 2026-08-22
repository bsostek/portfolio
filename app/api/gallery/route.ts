import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

type Category = "professional" | "personal";

interface CaptionEntry {
  caption?: string;
  category?: Category;
}

export async function GET() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  let files: string[] = [];
  try {
    files = await readdir(galleryDir);
  } catch {
    return NextResponse.json({ images: [] });
  }

  let entries: Record<string, CaptionEntry> = {};
  try {
    const raw = await readFile(path.join(galleryDir, "captions.json"), "utf-8");
    entries = JSON.parse(raw);
  } catch {
    entries = {};
  }

  const images = files
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const entry = entries[file] ?? {};
      return {
        src: `/gallery/${file}`,
        caption: entry.caption ?? "",
        category: entry.category === "personal" ? "personal" : "professional",
      };
    });

  return NextResponse.json({ images });
}

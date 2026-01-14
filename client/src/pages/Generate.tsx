import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SoftBackdrop from "../components/SoftBackdrop";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { dummyThumbnails } from "../assets/assets";
import type { IThumbnail } from "../assets/assets";
import axios from "axios";

type AspectRatio = "16:9" | "1:1" | "9:16";

const styles = [
  {
    id: "Bold & Graphic",
    title: "Bold & Graphic",
    desc: "High contrast, bold typography, striking visuals",
  },
  {
    id: "Minimalist",
    title: "Minimalist",
    desc: "Clean, simple, lots of white space",
  },
  {
    id: "Photorealistic",
    title: "Photorealistic",
    desc: "Photo-based, natural looking",
  },
  {
    id: "Illustrated",
    title: "Illustrated",
    desc: "Hand-drawn, artistic, creative",
  },
  {
    id: "Tech/Futuristic",
    title: "Tech / Futuristic",
    desc: "Modern, sleek, tech-inspired",
  },
];

/* 
  ✅ MAPPED COLORS TO SCHEMA 
  Hex codes are for UI, IDs are for Backend Schema
*/
const colors = [
  { hex: "#ec4899", id: "vibrant" },
  { hex: "#f97316", id: "sunset" },
  { hex: "#22c55e", id: "forest" },
  { hex: "#06b6d4", id: "ocean" }, // Changed from neon to ocean/neon based on what fits best
  { hex: "#6366f1", id: "purple" }, // Rough match
  { hex: "#a855f7", id: "neon" },   // Rough match
  { hex: "#64748b", id: "monochrome" },
  { hex: "#fde047", id: "pastel" },
];

export default function Generate() {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [ratio, setRatio] = useState<AspectRatio>("16:9");
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]); // store object
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);

  // ✅ LOAD REAL THUMBNAIL WHEN ID EXISTS
  useEffect(() => {
    if (!id) return;

    const fetchThumbnail = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3000/api/user/thumbnail/${id}`, {
          withCredentials: true,
        });
        const found = data.thumbnail; // Assuming API returns { thumbnail: ... }

        if (found) {
          setThumbnail(found);
          setTitle(found.title);
          setPrompt(found.user_prompt || "");
          setRatio(found.aspect_ratio || "16:9");
          setSelectedStyle(
            styles.find((s) => s.id === (found.style as string)) || styles[0]
          );
          // Try to find color, default to first
          setSelectedColor(colors.find(c => c.id === found.color_scheme) || colors[0]);
        }
      } catch (error) {
        console.error("Failed to load thumbnail details", error);
        // Fallback to dummy if API fails? No, better to show valid state or empty.
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [id]);

  const aspectClass =
    ratio === "1:1"
      ? "aspect-square"
      : ratio === "9:16"
        ? "aspect-[9/16]"
        : "aspect-video";

  const handleGenerateThumbnail = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/thumbnail/generate-thumbnail",
        {
          title,
          prompt,
          style: selectedStyle.id,
          aspect_ratio: ratio,
          color_scheme: selectedColor.id, // Send ID, not hex
        },
        {
          withCredentials: true,
        }
      );

      if (data.thumbnail) {
        setThumbnail(data.thumbnail);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SoftBackdrop />

      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
            {/* LEFT PANEL */}
            <div
              className={`space-y-6 ${id || loading ? "pointer-events-none opacity-80" : ""
                }`}
            >
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>

                {/* TITLE */}
                <div>
                  <label className="text-sm text-zinc-300">
                    Title or Topic
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="mt-2 w-full px-4 h-11 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-zinc-500 text-right mt-1">
                    {title.length}/100
                  </p>
                </div>

                {/* ASPECT RATIO */}
                <div>
                  <p className="text-sm text-zinc-300 mb-2">Aspect Ratio</p>
                  <div className="flex gap-3">
                    {(["16:9", "1:1", "9:16"] as AspectRatio[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRatio(r)}
                        className={`px-4 py-2 rounded-lg border text-sm transition
                          ${ratio === r
                            ? "bg-pink-500/20 border-pink-500 text-white"
                            : "bg-white/5 border-white/10 text-zinc-300"
                          }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* STYLE DROPDOWN */}
                <div className="relative">
                  <p className="text-sm text-zinc-300 mb-2">
                    Thumbnail Style
                  </p>

                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="text-left">
                      <p className="text-white font-medium">
                        {selectedStyle.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {selectedStyle.desc}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition ${open ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {open && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl bg-zinc-900 border border-white/10">
                      {styles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style);
                            setOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-white/10
                            ${selectedStyle.id === style.id
                              ? "bg-white/10"
                              : ""
                            }`}
                        >
                          <p className="text-white font-medium">
                            {style.title}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {style.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* COLOR SCHEME */}
                <div>
                  <p className="text-sm text-zinc-300 mb-2">Color Scheme</p>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c.hex }}
                        className={`h-8 w-8 rounded-md border
                          ${selectedColor.id === c.id
                            ? "border-white scale-110"
                            : "border-white/20"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* PROMPT */}
                <div>
                  <label className="text-sm text-zinc-300">
                    Additional Prompts (optional)
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none resize-none"
                  />
                </div>

                {!id && (
                  <button
                    onClick={handleGenerateThumbnail}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      "Generate Thumbnail"
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* PREVIEW PANEL */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-zinc-200 font-medium mb-3">Preview</h3>

              <div
                className={`rounded-xl border border-dashed border-white/20 flex items-center justify-center ${aspectClass}`}
              >
                {!thumbnail && (
                  <div className="text-center text-zinc-400">
                    <p className="text-sm font-medium">
                      Generate your first thumbnail
                    </p>
                    <p className="text-xs mt-1">
                      Fill out the form and click Generate
                    </p>
                  </div>
                )}

                {thumbnail?.image_url && (
                  <img
                    src={thumbnail.image_url}
                    alt={thumbnail.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>

              {thumbnail?.image_url && (
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = thumbnail.image_url!;
                    a.download = `${thumbnail.title}.jpg`;
                    a.click();
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <Download size={18} />
                  Download Thumbnail
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

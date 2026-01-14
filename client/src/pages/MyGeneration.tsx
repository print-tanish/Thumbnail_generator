import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoftBackdrop from "../components/SoftBackdrop";
import type { IThumbnail } from "../assets/assets";
import { Trash2, Download, ArrowUpRight, Loader2 } from "lucide-react";
import axios from "axios";

const aspectRatioClassMap: Record<string, string> = {
  "16:9": "aspect-video",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
};

const MyGenerations = () => {
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThumbnails = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/user/thumbnails", { withCredentials: true });
      setThumbnails(data.thumbnail);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchThumbnails();
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/thumbnail/${id}`, { withCredentials: true });
      setThumbnails((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      alert("Failed to delete thumbnail");
    }
  };

  return (
    <>
      <SoftBackdrop />

      <div className="mt-32 min-h-screen px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-zinc-200">
            My Generations
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            View and manage all your AI-generated thumbnails
          </p>

          {loading ? (
            <div className="flex justify-center mt-20">
              <Loader2 className="animate-spin text-pink-500" size={40} />
            </div>
          ) : thumbnails.length === 0 ? (
            <div className="text-center mt-20 text-zinc-500">
              <p>No generations found. Create your first thumbnail!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {thumbnails.map((thumb) => {
                const aspectClass =
                  aspectRatioClassMap[thumb.aspect_ratio || "16:9"];

                return (
                  <div
                    key={thumb._id}
                    onClick={() => navigate(`/generate/${thumb._id}`)}
                    className="group cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:scale-[1.02] transition"
                  >
                    {/* IMAGE */}
                    <div className={`relative ${aspectClass} bg-black`}>
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* ICONS */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-2 right-2 hidden group-hover:flex gap-2"
                      >
                        <Trash2
                          onClick={() => handleDelete(thumb._id)}
                          className="size-6 p-1 bg-black/60 rounded hover:bg-pink-600 transition"
                        />

                        <a href={thumb.image_url} download>
                          <Download className="size-6 p-1 bg-black/60 rounded hover:bg-pink-600 transition" />
                        </a>

                        {/* ✅ YT PREVIEW */}
                        <ArrowUpRight
                          onClick={() => navigate(`/preview/${thumb._id}`)}
                          className="size-6 p-1 bg-black/60 rounded hover:bg-pink-600 transition"
                        />
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-white line-clamp-2">
                        {thumb.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          {thumb.style}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          {thumb.color_scheme}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10">
                          {thumb.aspect_ratio}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500">
                        {new Date(
                          thumb.createdAt as string
                        ).toDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyGenerations;

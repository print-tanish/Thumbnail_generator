import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IThumbnail } from "../assets/assets";
import { Trash2, Download, ArrowUpRight, Loader2, ImageIcon } from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui";
import { motion, AnimatePresence } from "motion/react";

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
      if (data.thumbnail) setThumbnails(data.thumbnail);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchThumbnails();
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this thumbnail?")) return;

    try {
      // Assuming there is a delete endpoint, if not this might fail or need implementation
      await axios.delete(`http://localhost:3000/api/thumbnail/${id}`, { withCredentials: true });
      setThumbnails((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete error", error);
      alert("Failed to delete thumbnail");
    }
  };

  const handleDownload = (url: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.jpg`;
    a.click();
  }

  return (
    <div className="pt-28 min-h-screen px-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Generations</h1>
          <p className="text-zinc-400">Manage your library of AI-generated thumbnails.</p>
        </div>
        <Button onClick={() => navigate("/generate")} leftIcon={<ImageIcon size={18} />}>
          Generate New
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="animate-spin text-pink-500 mb-4" size={40} />
          <p className="text-zinc-500 animate-pulse">Loading your gallery...</p>
        </div>
      ) : thumbnails.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-zinc-500" size={32} />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No thumbnails yet</h3>
          <p className="text-zinc-400 mb-6">Create your first AI thumbnail to get started.</p>
          <Button onClick={() => navigate("/generate")}>Start Creating</Button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {thumbnails.map((thumb) => {
              const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || "16:9"];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 cursor-pointer hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10"
                >
                  <div className={`relative ${aspectClass} w-full bg-zinc-800`}>
                    <img
                      src={thumb.image_url}
                      alt={thumb.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4 bg-zinc-900">
                    <h3 className="text-white font-medium line-clamp-1 mb-2" title={thumb.title}>{thumb.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">{thumb.aspect_ratio}</span>
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5 uppercase">{thumb.style}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => handleDelete(thumb._id, e)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDownload(thumb.image_url!, thumb.title, e)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/preview/${thumb._id}`)
                        }}
                        className="text-xs font-medium text-pink-500 hover:text-pink-400 flex items-center gap-1 transition-colors"
                      >
                        Preview <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyGenerations;

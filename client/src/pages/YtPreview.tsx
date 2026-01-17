import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { yt_html } from "../assets/assets";
import type { IThumbnail } from "../assets/assets";
import axios from "axios";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui";

export default function YtPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchThumbnail = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/thumbnail/${id}`, {
          withCredentials: true
        });
        const found = data.thumbnail;

        if (found) {
          setThumbnail(found);
          // Inject thumbnail + title into yt_html
          let injectedHtml = yt_html
            .replaceAll("%%THUMBNAIL_URL%%", found.image_url || "")
            .replaceAll("%%TITLE%%", found.title);
          setHtml(injectedHtml);
        }
      } catch (error) {
        console.error("Failed to fetch thumbnail for preview", error);
      } finally {
        setLoading(false);
      }
    }

    fetchThumbnail();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-pink-500 mb-4" size={40} />
        <p className="text-zinc-500 animate-pulse">Generating Preview...</p>
      </div>
    );
  }

  if (!thumbnail) {
    return (
      <div className="pt-32 text-center text-zinc-400 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Preview not found</p>
        <Button variant="outline" onClick={() => navigate('/my-generations')}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0f0f0f]">
      <div className="max-w-[1800px] mx-auto">
        <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5 bg-[#0f0f0f]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
          <h1 className="text-sm font-medium text-white">YouTube Preview Mode</h1>
        </div>

        <div className="w-full h-[calc(100vh-8rem)] bg-[#0f0f0f]">
          <iframe
            title="YouTube Preview"
            srcDoc={html}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SoftBackdrop from "../components/SoftBackdrop";
import { yt_html } from "../assets/assets";
import type { IThumbnail } from "../assets/assets";
import axios from "axios";

export default function YtPreview() {
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchThumbnail = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:3000/api/user/thumbnail/${id}`, {
          withCredentials: true
        });
        const found = data.thumbnail;

        if (found) {
          setThumbnail(found);

          // ✅ Inject thumbnail + title into yt_html
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

  if (!thumbnail) {
    return (
      <>
        <SoftBackdrop />
        <div className="pt-32 text-center text-zinc-400">
          Preview not found
        </div>
      </>
    );
  }

  return (
    <>
      <SoftBackdrop />

      <div className="pt-20 min-h-screen">
        {/* FULL YOUTUBE-LIKE SCREEN */}
        <iframe
          title="YouTube Preview"
          srcDoc={html}
          className="w-full h-[calc(100vh-5rem)] border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  );
}

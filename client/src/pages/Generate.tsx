import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, Download, Loader2, Wand2, RefreshCw, Sparkles, UploadCloud, X } from "lucide-react";
import type { IThumbnail } from "../assets/assets";
// import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Button, Input, Card } from "../components/ui";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";

type AspectRatio = "16:9" | "1:1" | "9:16";

const styles = [
  { id: "Bold & Graphic", title: "Bold & Graphic", desc: "High contrast, bold typography" },
  { id: "Minimalist", title: "Minimalist", desc: "Clean, simple, lots of white space" },
  { id: "Photorealistic", title: "Photorealistic", desc: "Photo-based, natural looking" },
  { id: "Illustrated", title: "Illustrated", desc: "Hand-drawn, artistic, creative" },
  { id: "Tech/Futuristic", title: "Tech / Futuristic", desc: "Modern, sleek, tech-inspired" },
];

const colors = [
  { hex: "#ec4899", id: "vibrant" },
  { hex: "#f97316", id: "sunset" },
  { hex: "#22c55e", id: "forest" },
  { hex: "#06b6d4", id: "ocean" },
  { hex: "#6366f1", id: "purple" },
  { hex: "#a855f7", id: "neon" },
  { hex: "#64748b", id: "monochrome" },
  { hex: "#fde047", id: "pastel" },
];

const templatePacks = [
  { id: "None", title: "Standard (No Style Pack)", desc: "Use default style settings" },
  { id: "MrBeast", title: "MrBeast Style", desc: "High drama, viral aesthetics, red arrows" },
  { id: "Podcast", title: "Professional Podcast", desc: "Studio look, split screen, high quality" },
  { id: "Gaming", title: "Gaming / Esports", desc: "High energy, glitch effects, action packed" },
  { id: "Finance", title: "Finance & Crypto", desc: "Charts, green arrows, serious tone" },
];

export default function Generate() {
  const { id } = useParams<{ id: string }>();
  // ...
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ratio, setRatio] = useState<AspectRatio>("16:9");

  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [selectedPack, setSelectedPack] = useState(templatePacks[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // UI State
  const [styleOpen, setStyleOpen] = useState(false);
  const [packOpen, setPackOpen] = useState(false);

  // Dropzone Configuration
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false
  });

  useEffect(() => {
    if (!id) return;
    const fetchThumbnail = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/thumbnail/${id}`, { withCredentials: true });
        if (data.thumbnail) {
          const found = data.thumbnail;
          setThumbnail(found);
          setTitle(found.title);
          setPrompt(found.user_prompt || "");
          setRatio(found.aspect_ratio || "16:9");
          setSelectedStyle(styles.find((s) => s.id === found.style) || styles[0]);
          setSelectedColor(colors.find(c => c.id === found.color_scheme) || colors[0]);
          if (found.templatePack) {
            setSelectedPack(templatePacks.find(p => p.id === found.templatePack) || templatePacks[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load thumbnail details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThumbnail();
  }, [id]);

  const handleGenerateThumbnail = async () => {
    if (!title) return alert("Please enter a title");

    setLoading(true);
    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("prompt", prompt);
      formData.append("style", selectedStyle.id);
      formData.append("aspect_ratio", ratio);
      formData.append("color_scheme", selectedColor.id);

      if (selectedPack.id !== "None") {
        formData.append("templatePack", selectedPack.id);
      }

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/thumbnail/generate-thumbnail`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      if (data.thumbnail) setThumbnail(data.thumbnail);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Something went wrong";

      if (error.response?.status === 403 && error.response?.data?.error === 'insufficient_credits') {
        if (window.confirm("You have insufficient credits (0). Would you like to buy more?")) {
          navigate("/#pricing");
          setTimeout(() => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen px-4 pb-20 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8">
        {/* Input Panel */}
        <motion.div
          // ... existing motion.div props
          className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Card className="p-6 space-y-6 bg-zinc-900/50 backdrop-blur-md border-white/5">
            {/* Header ... */}
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wand2 className="text-pink-500" size={20} />
                Create Thumbnail
              </h2>
              <p className="text-zinc-400 text-sm mt-1">Configure your generation settings</p>
            </div>

            <div className="space-y-4">
              <Input
                label="Video Title"
                placeholder="e.g. How to get 10k subscribers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />

              {/* Aspect Ratio ... */}
              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["16:9", "1:1", "9:16"] as AspectRatio[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRatio(r)}
                      className={`py-2 rounded-lg text-sm border transition-all ${ratio === r
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* FACE UPLOAD DROPZONE */}
              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Your Photo (Optional)</label>
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? "border-pink-500 bg-pink-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="text-zinc-400 mb-2" size={24} />
                    <p className="text-xs text-zinc-400">
                      {isDragActive ? "Drop photo here..." : "Drag & drop your photo, or click to select"}
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Preview"
                      className="w-full h-32 object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <p className="text-white text-sm font-medium truncate px-4">{uploadedFile.name}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>


              {/* TEMPLATE PACK DROPDOWN */}
              <div className="relative">
                {/* ... existing template pack code ... */}
                <label className="text-sm text-yellow-500 font-medium mb-2 block flex items-center gap-2">
                  <Sparkles size={14} /> Template Pack (Optional)
                </label>
                <button
                  onClick={() => { setPackOpen(!packOpen); setStyleOpen(false); }}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{selectedPack.title}</p>
                    <p className="text-xs text-zinc-500">{selectedPack.desc}</p>
                  </div>
                  <ChevronDown size={16} className={`text-zinc-400 transition-transform ${packOpen ? 'rotate-180' : ''}`} />
                </button>

                {packOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl max-h-60 overflow-y-auto">
                    {templatePacks.map((pack) => (
                      <button
                        key={pack.id}
                        onClick={() => { setSelectedPack(pack); setPackOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <p className="text-sm font-medium text-white">{pack.title}</p>
                        <p className="text-xs text-zinc-500">{pack.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* VISUAL STYLE */}
              <div className="relative">
                {/* ... existing visual style code ... */}
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Visual Style</label>
                <button
                  onClick={() => { setStyleOpen(!styleOpen); setPackOpen(false); }}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{selectedStyle.title}</p>
                    <p className="text-xs text-zinc-500">{selectedStyle.desc}</p>
                  </div>
                  <ChevronDown size={16} className={`text-zinc-400 transition-transform ${styleOpen ? 'rotate-180' : ''}`} />
                </button>

                {styleOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => { setSelectedStyle(style); setStyleOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <p className="text-sm font-medium text-white">{style.title}</p>
                        <p className="text-xs text-zinc-500">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* COLOR VIBE */}
              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Color Vibe</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-8 h-8 rounded-full transition-transform ${selectedColor.id === c.id ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-900 shadow-lg" : "hover:scale-110 opacity-70 hover:opacity-100"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* ADDITIONAL CONTEXT */}
              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Additional Context (Optional)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe specific elements you want..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 min-h-[100px] text-sm resize-none"
                />
              </div>

              {!id && (
                <Button
                  onClick={handleGenerateThumbnail}
                  isLoading={loading}
                  className="w-full h-12 text-base shadow-pink-500/20 shadow-lg"
                  leftIcon={<Wand2 size={18} />}
                >
                  Generate (1 Credit)
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className={`relative w-full rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden flex items-center justify-center ${ratio === '1:1' ? 'aspect-square max-w-[600px]' : ratio === '9:16' ? 'aspect-[9/16] max-w-[400px]' : 'aspect-video'
            } mx-auto transition-all duration-300`}>

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
                <p className="text-zinc-400 font-medium animate-pulse">Generating Magic...</p>
              </div>
            )}

            {!thumbnail ? (
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="text-zinc-600" size={32} />
                </div>
                <h3 className="text-zinc-300 font-medium mb-2">Ready to Create</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Fill in the details on the left and hit generate to see your AI masterpiece here.</p>
              </div>
            ) : (
              <img
                src={thumbnail.image_url}
                alt={thumbnail.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {thumbnail?.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex gap-4 justify-center"
            >
              <Button
                variant="outline"
                onClick={() => {
                  setThumbnail(null);
                  setTitle("");
                  setPrompt("");
                }}
              >
                <RefreshCw size={18} className="mr-2" />
                Create New
              </Button>
              <Button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = thumbnail.image_url!;
                  a.download = `${thumbnail.title}.jpg`;
                  a.click();
                }}
                className="shadow-lg shadow-pink-500/20"
              >
                <Download size={18} className="mr-2" />
                Download HD
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

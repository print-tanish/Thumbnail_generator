'use client';

import { CheckIcon, PlayCircle, Sparkles } from "lucide-react";
import TiltedImage from "../components/TiltImage";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const specialFeatures = [
    "No design skills needed",
    "Fast generations",
    "High CTR templates",
  ];

  const { user } = useAuth();


  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-pink-600/20 blur-[120px] rounded-full -z-10 mix-blend-screen animate-pulse" />

      <motion.div
        className="flex flex-col items-center text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition cursor-default"
        >
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-zinc-200">AI-Powered Thumbnail Generation</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Create Viral Thumbnails <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient bg-300%">
            in Seconds
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Stop wasting hours on design. Let our AI generate high-converting thumbnails for your videos instantly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to={user ? "/generate" : "/login"}>
            <Button size="lg" className="shadow-pink-500/25 shadow-lg">
              {user ? "Generate Now" : "Start For Free"}
            </Button>
          </Link>
          <Link to="/my-generation">
            <Button variant="outline" size="lg" icon={<PlayCircle size={18} />}>
              My Generations
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-zinc-500 font-medium">
          {specialFeatures.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="flex items-center gap-2"
            >
              <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                <CheckIcon size={12} />
              </div>
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-16 w-full max-w-6xl perspective-1000">
        <TiltedImage />
      </div>
    </section>
  );
}



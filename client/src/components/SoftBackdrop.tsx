import React from "react";

export default function SoftBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Center glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-pink-600/20 rounded-full blur-[120px]" />

      {/* Secondary purple glow */}
      <div className="absolute left-1/3 top-1/3 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[140px]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
    </div>
  );
}

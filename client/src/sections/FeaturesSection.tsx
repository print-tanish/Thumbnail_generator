'use client'
import { Zap, Layout, Sliders, Smartphone, Image as ImageIcon, MousePointerClick } from "lucide-react";
import { motion } from "motion/react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Zap className="text-yellow-400" size={32} />,
            title: "Lightning Fast",
            desc: "Generate professional thumbnails in under 5 seconds with our optimized AI models.",
            className: "md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-900/50",
        },
        {
            icon: <Layout className="text-pink-400" size={32} />,
            title: "Smart Layouts",
            desc: "AI automatically positions text and elements for maximum readability.",
            className: "bg-zinc-900/50",
        },
        {
            icon: <ImageIcon className="text-blue-400" size={32} />,
            title: "High Quality",
            desc: "Crystal clear 4K exports ready for YouTube.",
            className: "bg-zinc-900/50",
        },
        {
            icon: <Sliders className="text-purple-400" size={32} />,
            title: "Fully Customizable",
            desc: "Adjust colors, fonts, and styles to match your brand identity perfectly.",
            className: "md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-900/50",
        },
        {
            icon: <Smartphone className="text-green-400" size={32} />,
            title: "Mobile Optimized",
            desc: "Thumbnails looked great on any device size.",
            className: "bg-zinc-900/50",
        },
        {
            icon: <MousePointerClick className="text-red-400" size={32} />,
            title: "High CTR Support",
            desc: "Designed to boost your Click-Through Rate.",
            className: "bg-zinc-900/50",
        },
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6"
                >
                    Everything you need to go viral
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-400 max-w-2xl mx-auto"
                >
                    Stop wrestling with complex design tools. Thumblify gives you professional results without the learning curve.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-8 rounded-3xl border border-white/5 hover:border-white/10 transition duration-300 group hover:shadow-2xl hover:shadow-pink-500/10 ${feature.className}`}
                    >
                        <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-zinc-100">{feature.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
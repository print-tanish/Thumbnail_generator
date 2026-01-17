'use client';

import { CheckIcon, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui";

const creditPacks = [
    {
        credits: 10,
        price: 9,
        label: "Starter",
        popular: false,
        features: ["10 High-Quality Thumbnails", "Basic Styles", "Standard Support"],
    },
    {
        credits: 50,
        price: 39,
        label: "Creator",
        popular: true,
        features: [
            "50 High-Quality Thumbnails",
            "All Styles Unlocked",
            "Priority Generation",
            "Commercial Usage",
        ],
    },
    {
        credits: 100,
        price: 69,
        label: "Agency",
        popular: false,
        features: [
            "100 High-Quality Thumbnails",
            "All Styles Unlocked",
            "Instant Generation",
            "Premium Support",
            "API Access",
        ],
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full -z-10" />

            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6"
                >
                    Simple Credit Pricing
                </motion.h2>
                <p className="text-zinc-400 max-w-lg mx-auto text-lg">
                    Pay as you go. No hidden fees or subscriptions.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
                {creditPacks.map((pack, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative flex-1 min-w-[300px] max-w-[350px] p-8 rounded-3xl border transition-all duration-300 ${pack.popular
                                ? "bg-white/10 border-pink-500/50 shadow-2xl shadow-pink-500/10 scale-105 z-10"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                    >
                        {pack.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                <Sparkles size={10} fill="currentColor" />
                                Most Popular
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-zinc-300 font-medium tracking-wide uppercase text-sm mb-2">{pack.label}</h3>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-bold text-white">${pack.price}</span>
                            </div>
                            <p className="text-zinc-400 mt-2 font-medium">{pack.credits} Credits</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {pack.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className={`p-1 rounded-full ${pack.popular ? 'bg-pink-500/20 text-pink-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                        <CheckIcon size={12} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={pack.popular ? "primary" : "outline"}
                            className="w-full"
                        >
                            Buy {pack.credits} Credits
                        </Button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
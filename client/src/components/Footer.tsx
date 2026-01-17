import { DribbbleIcon, LinkedinIcon, TwitterIcon, YoutubeIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-zinc-950 pt-20 pb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
                    <div className="max-w-sm">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <Sparkles className="text-pink-500" />
                            <span className="font-bold text-2xl tracking-tight text-white">ClickNail AI</span>
                        </Link>
                        <p className="text-zinc-400 leading-relaxed">
                            AI-powered thumbnails that drive clicks. Stop wasting time on design and start creating content.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                        <div>
                            <h4 className="font-bold text-white mb-6">Product</h4>
                            <ul className="space-y-4 text-zinc-400">
                                <li><Link to="/generate" className="hover:text-pink-500 transition-colors">Generator</Link></li>
                                <li><Link to="#pricing" className="hover:text-pink-500 transition-colors">Pricing</Link></li>
                                <li><Link to="#features" className="hover:text-pink-500 transition-colors">Features</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Company</h4>
                            <ul className="space-y-4 text-zinc-400">
                                <li><Link to="/about" className="hover:text-pink-500 transition-colors">About</Link></li>
                                <li><Link to="/blog" className="hover:text-pink-500 transition-colors">Blog</Link></li>
                                <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-zinc-400">
                                <li><Link to="/privacy" className="hover:text-pink-500 transition-colors">Privacy</Link></li>
                                <li><Link to="/terms" className="hover:text-pink-500 transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-zinc-500 text-sm">
                        &copy; {new Date().getFullYear()} ClickNail AI. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-zinc-400 hover:text-pink-500 transition-colors"><TwitterIcon size={20} /></a>
                        <a href="#" className="text-zinc-400 hover:text-pink-500 transition-colors"><LinkedinIcon size={20} /></a>
                        <a href="#" className="text-zinc-400 hover:text-pink-500 transition-colors"><DribbbleIcon size={20} /></a>
                        <a href="#" className="text-zinc-400 hover:text-pink-500 transition-colors"><YoutubeIcon size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
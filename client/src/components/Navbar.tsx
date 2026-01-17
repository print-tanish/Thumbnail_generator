import { MenuIcon, XIcon, Star, Sparkles, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui";
import FeedbackModal from "./FeedbackModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Generate", path: "/generate" },
    { name: "My Generations", path: "/my-generation" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent ${scrolled ? "bg-black/50 backdrop-blur-xl border-white/5" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <Sparkles className="relative text-pink-500" />
            </div>
            <span className="font-bold text-xl tracking-tight">ClickNail AI</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-pink-400 ${location.pathname === link.path ? "text-white" : "text-zinc-400"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-sm font-medium text-zinc-400 hover:text-pink-400 transition-colors"
            >
              Feedback
            </button>
          </div>

          {/* Auth / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                  <Star size={12} fill="currentColor" />
                  <span>{user.credits ?? 0} Credits</span>
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <span className="text-sm text-zinc-300">{user.name.split(' ')[0]}</span>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-zinc-300 hover:text-white"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-medium text-zinc-300 hover:text-pink-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => { setFeedbackOpen(true); setIsOpen(false); }}
                  className="text-2xl font-medium text-zinc-300 hover:text-pink-500 transition-colors text-left"
                >
                  Feedback
                </button>
              </div>

              <div className="mt-auto space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 text-zinc-200">
                      <span>Credits</span>
                      <span className="font-bold text-yellow-500">{user.credits ?? 0}</span>
                    </div>
                    <Button className="w-full" onClick={() => { logout(); setIsOpen(false); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}

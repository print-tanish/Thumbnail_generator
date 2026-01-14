import { MenuIcon, XIcon, UserCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { navlinks } from "../data/navlinks";
import type { INavLink } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        {/* Logo */}
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-8.5 w-auto" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to="/" className="hover:text-pink-300 transition">
            Home
          </Link>
          <Link to="/generate" className="hover:text-pink-300 transition">
            Generate
          </Link>
          <Link to="/my-generation" className="hover:text-pink-300 transition">
            My Generations
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-pink-300">
                <UserCircle size={20} />
                <span className="text-sm">{user.email}</span>
              </div>
              <button onClick={logout} className="hover:text-pink-300 transition text-sm">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="#" className="hover:text-pink-300 transition">
                My Contact
              </Link>
              <Link to="/login" className="hover:text-pink-300 transition">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Get Started Button → /login */}
        {/* Get Started Button → /login (Only if not logged in) */}
        {!user && (
          <Link
            to="/login"
            className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white text-center cursor-pointer"
          >
            Get started
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className="md:hidden">
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {navlinks.map((link: INavLink) => (
          <NavLink
            key={link.name}
            to={link.href}
            onClick={() => setIsOpen(false)}
            className="hover:text-pink-300 transition"
          >
            {link.name}
          </NavLink>
        ))}

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex"
        >
          <XIcon />
        </button>
      </div>
    </>
  );
}

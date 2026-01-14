import React, { useState } from "react";
import SoftBackdrop from "./SoftBackdrop";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [state, setState] = useState<"login" | "register">("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login, register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (state === "login") {
        await login(formData);
      } else {
        await register(formData);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <SoftBackdrop />

      <div className="relative z-10 min-h-screen flex items-center justify-center pt-24">
        <form
          onSubmit={handleSubmit}
          className="
            w-[22rem]
            rounded-2xl
            bg-white/5 backdrop-blur-xl
            border border-white/10
            px-8
            text-center
            shadow-[0_0_80px_rgba(236,72,153,0.15)]
          "
        >
          <h1 className="text-white text-2xl mt-10 font-semibold">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Please sign in to continue
          </p>

          {state === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="mt-6 w-full h-11 rounded-full bg-white/5 border border-white/10 px-5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/60"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="mt-4 w-full h-11 rounded-full bg-white/5 border border-white/10 px-5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/60"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="mt-4 w-full h-11 rounded-full bg-white/5 border border-white/10 px-5 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-pink-500/60"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="mt-4 text-left">
            <button
              type="button"
              className="text-sm text-pink-400 hover:underline"
            >
              Forget password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 w-full h-11 rounded-full bg-pink-600 hover:bg-pink-500 transition text-white font-medium"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-gray-400 text-sm mt-4 mb-10 cursor-pointer"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="text-pink-400 hover:underline ml-1">
              Click here
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

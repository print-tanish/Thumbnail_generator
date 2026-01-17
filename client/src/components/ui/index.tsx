import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", isLoading, icon, leftIcon, children, ...props }, ref) => {
        const renderIcon = icon || leftIcon;

        const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

        const variants = {
            primary: "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]",
            secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-white/10",
            outline: "bg-transparent border border-white/20 text-zinc-100 hover:bg-white/5 hover:border-white/40",
            ghost: "bg-transparent text-zinc-300 hover:text-white hover:bg-white/5",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {/* Shine effect on hover for primary */}
                {variant === 'primary' && (
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}

                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : renderIcon ? (
                    <span className="mr-2">{renderIcon}</span>
                ) : null}
                <span className="relative z-10">{children}</span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`glass-card p-6 rounded-2xl ${className}`}>
            {children}
        </div>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur-sm pointer-events-none" />
                    <input
                        ref={ref}
                        className={`relative w-full bg-zinc-900/90 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:bg-zinc-900 transition-all placeholder:text-zinc-600 ${className}`}
                        {...props}
                    />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

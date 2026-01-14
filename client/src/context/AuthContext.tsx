import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type User = {
    _id: string;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/api/auth/verify", {
                withCredentials: true,
            });
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (userData: any) => {
        const { data } = await axios.post(
            "http://localhost:3000/api/auth/login",
            userData,
            { withCredentials: true }
        );
        setUser(data.user);
        navigate("/");
    };

    const register = async (userData: any) => {
        const { data } = await axios.post(
            "http://localhost:3000/api/auth/register",
            userData,
            { withCredentials: true }
        );
        setUser(data.user);
        navigate("/");
    };

    const logout = async () => {
        await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout,
                checkAuth,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

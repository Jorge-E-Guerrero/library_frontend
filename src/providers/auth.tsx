"use client";

import { useState, createContext, useEffect } from "react";

import { getStorage, requestToApi, setStorage } from "../helpers/middleware";

export const AuthContext = createContext<{
    isAuth?: boolean;
    setIsAuth?: any;
    user: { [key: string]: any };
    setUser?: any;
}>({ user: {} });

export function AuthProvider({ children, authHeader, noAuthHeader }: { children: React.ReactNode, authHeader?: React.ReactNode, noAuthHeader?: React.ReactNode }) {

    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [user, setUser] = useState<{ id: string; name: string } | {}>({});

    const validateToken = async () => {
        try {

            const hasToken = getStorage({ type: "local", key: "token" });
            if (!hasToken) {
                setIsAuth(false);
                setUser({});
                return;
            }

            const response = await requestToApi({ method: "get", path: "/auth/validate" });
            if (response.status !== 200) {
                setIsAuth(false);
                setUser({});
                setStorage({ type: "local", key: "token", value: "" });
                return
            }

            setIsAuth(true);
            setUser(response.data);

        } catch (error) {
            setIsAuth(false);
            setUser({});
        }
    }

    // Authentication
    useEffect(() => {
        validateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            {isAuth ? authHeader : noAuthHeader }
            {children}
        </AuthContext.Provider>
    );
}
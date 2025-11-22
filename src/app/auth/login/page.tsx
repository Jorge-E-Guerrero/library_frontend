"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";

import {
    TextField,
    Button
} from "@mui/material";


import { requestToApi, setStorage } from "@/src/helpers/middleware";
import { AuthContext } from "@/src/providers/auth";
import { sleep } from "@/src/helpers/general";

export default function LoginPage() {

    const router = useRouter();

    const { setIsAuth, setUser } = useContext(AuthContext);

    const [form, setForm] = useState({
        userName: "",
        password: ""
    });

    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }


    const handleLogin = async () => {
        const payload = {
            user: form.userName,
            password: form.password
        }

        const response = await requestToApi({ method: "post", path: "/auth/login", payload });
        if (response.status !== 200) return window.alert("Login failed. Please check your credentials.");
        console.log("Login Response:", response);

        const userData = response.data;
        const token = response.token;

        if (!token) return window.alert("Login failed. No token received.");
        setStorage({ type: "local", key: "token", value: token });

        window.alert("Login successful!");

        setIsAuth && setIsAuth(true);
        setUser && setUser(userData.data);

        router.push("/");

    }

    return (
        <div className="auth-container">

            <div className="form-container">

                <div className="form-field">
                    <label htmlFor="memberId" className="form-label">Username</label>
                    <TextField
                        name="userName"
                        type="text"
                        value={form.userName}
                        onChange={updateForm}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="memberId" className="form-label">Password</label>
                    <TextField
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={updateForm}
                    />
                </div>
            </div>
            <div className="form-actions">
                <Button variant="contained" color="primary" onClick={handleLogin}>Log In</Button>
            </div>
        </div>
    )
}
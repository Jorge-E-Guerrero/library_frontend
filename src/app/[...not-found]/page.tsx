"use client";

import "./not-found.css";

import Button from '@mui/material/Button';
import { redirect } from 'next/navigation'

export default function Page() {
    const redirectToHome = () => {
        redirect('/');
    };

    return (
        <div className="not-found-container">
            <h1>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Button variant="contained" onClick={redirectToHome}>
                Go Home
            </Button>
        </div>
    );
}

"use client";

import { IconButton } from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

import { useRouter } from "next/navigation";

export default function DetailHeader({ title }: { title?: string }) {

    const router = useRouter();

    const goBack = () => {
        router.back();
    }

    return (
        <div className="detail-title-container">
            <IconButton className="back-button" onClick={goBack} color="primary" aria-label="back to list">
                <ArrowBackIcon />
            </IconButton>
            <h2 className="detail-title">{title}</h2>
        </div>
    )
}
"use client";

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useRouter, useParams } from 'next/navigation'
import { requestToApi } from '../../../helpers/middleware';

export default function UserPage() {

    const params = useParams<{ id: string }>()

    const router = useRouter();

    const backToList = () => {
        router.back();
    }

    const [data, setData] = useState<any>({});

    useEffect(() => {
        const handleRequest = async () => {
            if (!params.id) return;
            const path = `/user/${params.id}`;
            const request = await requestToApi({ method: "get", path });
            const requestData = request.data ?? [];
            setData(requestData);
        }
        handleRequest();

    }, []);

    return (
        <div className="detail-container">
            <div className="detail-buttons-container">
                <Button variant="contained" onClick={backToList}>Back to List</Button>
            </div>
            <h1>User ID: {params.id}</h1>
            <div className="detail-info">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="detail-row">
                        <strong>{key}:</strong> {String(value)}
                    </div>
                ))}
            </div>
        </div>
    );
}

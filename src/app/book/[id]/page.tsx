"use client";

import "./detail.css";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'

import {
    Button,
    CardMedia,
} from '@mui/material';

import { requestToApi } from '@/src/helpers/middleware';

const model = "book";

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
            const path = `/${model}/${params.id}`;
            const request = await requestToApi({ method: "get", path });
            const requestData = request.data ?? [];
            setData(requestData);
        }
        handleRequest();

    }, []);

    return (
        <div className="detail-container">
            <div className="detail-header">
                <div className="detail-actions">
                    <Button variant="contained" color="primary" onClick={backToList}>Back to List</Button>
                </div>
            </div>
            <div className="detail-content">
                <div className="detail-info">
                    {Object.entries(data).map(([key, value]: [string, any]) => (
                        <div key={key} className="detail-info-item">
                            <strong>{key}:</strong> {value}
                        </div>
                    ))}
                </div>
                <div className="detail-image-container">
                    <CardMedia className='detail-image'
                    component="img"
                    image={data.bo_coverImageUrl ?? "/image/no_book.jpg"}
                    alt={`${data.bo_name} cover`}
                />
                </div>
            </div>
            <div className="detail-footer">
            </div>
        </div>
    );
}

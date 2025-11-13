"use client";

import "./detail.css";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'

import {
    Button,
    CardMedia,
} from '@mui/material';

import DetailHeader from '@/src/components/detail/header';

import { requestToApi } from '@/src/helpers/middleware';
import { fullname } from '@/src/helpers/general';
import { formatDate } from "@/src/helpers/format";

const model = "book";

/// TODO: Agregar ubicacion de estanterías del libro

const detailFields: { [key: string]: { label?: string; render?: (label: string, value: any) => React.ReactElement } } = {
    "bo_bookId": { label: "ID", },
    "bo_name": { label: "Título" },
    "authors": {
        label: "Autores",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {value.map((author: any) => fullname(author.person?.pe_firstName, author.person?.pe_lastName)).join(", ")}</p>
    },
    "bo_isbn": { label: "ISBN" },
    "bo_damageFee": { label: "Tarifa por Daño" },
    "bo_published": {
        label: "Año de Publicación",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {formatDate({ date: new Date(value) })}</p>
    },
    "bo_publisher": { label: "Editorial" },
}

const defaultRender = (key: string, value: any) => <p><strong>{key}:</strong> {value}</p>

export default function DetailPage({ isModal }: { isModal?: string }) {

    const params = useParams<{ id: string }>()

    const router = useRouter();

    const backToList = () => {
        router.back();
    }

    const [data, setData] = useState<any>({});

    const buildField = (key: string, value: any) => {
        const fieldConfig: { label?: string; render?: (label: string, value: any) => React.ReactElement } = detailFields[key];

        if (!fieldConfig) return null;

        if (!fieldConfig.render) fieldConfig.render = defaultRender;

        return (
            <div key={key} className="detail-info-item">
                {fieldConfig.render(fieldConfig.label || key, value)}
            </div>
        );
    }

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
                {isModal !== "true" && <DetailHeader title="Book Details" />}
                <div className="detail-actions">
                    <Button variant="contained" color="primary" onClick={backToList}>Realizar un préstamo</Button>
                </div>
            </div>
            <div className="detail-content">
                <div className="detail-info">
                    {Object.entries(data).map(([key, value]) => buildField(key, value))}
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

"use client";

import "./detail.css";
import React, { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation'

import {
    Button,
    CardMedia,
} from '@mui/material';

import DetailHeader from '@/src/components/detail/header';

import { requestToApi } from '@/src/helpers/middleware';
import { fullname } from '@/src/helpers/general';
import { formatDate } from "@/src/helpers/format";
import { AuthContext } from "@/src/providers/auth";

const model = "book";

const availableStatuses = [1]; // 1: Available

/// TODO: Agregar ubicacion de estanterías del libro

const detailFields: { [key: string]: { label?: string; render?: (label: string, value: any) => React.ReactElement } } = {
    "bo_bookId": { label: "ID", },
    "bo_name": { label: "Título" },
    "authors": {
        label: "Autores",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {value.map((author: any) => fullname(author.person?.pe_firstName, author.person?.pe_lastName)).join(", ")}</p>
    },
    "publisher": {
        label: "Editorial",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {value?.pu_publisherName}</p>
    },
    "bo_published": {
        label: "Año de Publicación",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {formatDate({ date: new Date(value) })}</p>
    },
    "bo_language": { label: "Idioma" },
    "bo_pages": { label: "Número de páginas" },
    "bo_shelfLocation": { label: "Estantería" },
    
    "bo_publisher": { label: "Editorial" },
    "bo_damageFee": { label: "Tarifa por Daño" },
    "bo_lateReturnFee": { label: "Tarifa por Retraso" },
    "inventory": {
        label: "Disponibles",
        render: (label: string, value: any) => <p><strong>{label}:</strong> {value?.filter((item: any) => availableStatuses.includes(item.in_stateId)).length ?? 0} copias</p>
    },
}

const defaultRender = (key: string, value: any) => <p><strong>{key}:</strong> {value}</p>

export default function DetailPage({ isModal, setRedirect }: { isModal?: string, setRedirect?: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { user, isAuth } = useContext(AuthContext);

    const params = useParams<{ id: string }>()

    const router = useRouter();

    const backToList = () => {
        router.back();
    }

    const loanBook = () => {
        setRedirect && setRedirect(true);
        router.replace(`/book/${params.id}/loan`);
    }

    const [data, setData] = useState<any>({});

    const [isAvailable, setIsAvailable] = useState(false);

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
            setIsAvailable(requestData.inventory?.some((item: any) => availableStatuses.includes(item.in_stateId)) ?? false);
        }
        handleRequest();

    }, []);

    return (
        <div className="detail-container">
            <div className="detail-header">
                {isModal !== "true" && <DetailHeader title="Book Details" />}
                <div className="detail-actions">
                    {(isAuth && isAvailable) && <Button variant="contained" color="primary" onClick={loanBook}>Realizar un préstamo</Button>}
                </div>
            </div>
            <div className="detail-content">
                <div className="detail-info">
                    {Object.entries(data).map(([key, value]) => buildField(key, value))}
                </div>
                <div className="detail-image-container">
                    <CardMedia className='detail-image'
                        component="img"
                        image={data.bo_image ?? "/image/no_book.jpg"}
                        alt={`${data.bo_name} cover`}
                    />
                </div>
            </div>
            <div className="detail-footer">
            </div>
        </div>
    );
}

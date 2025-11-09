"use client";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

import './book.css';

import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    List,
} from '@mui/material';

import { requestToApi } from '../../helpers/middleware';

const model = "book";

export default function Page() {


    const router = useRouter();

    const [data, setData] = useState([]);

    const refreshData = async () => {
        const request = await requestToApi({ method: "get", path: "/book" });
        const requestData = request.data ?? [];
        setData(requestData);

        console.log("Book data:", requestData);
    }

    const handleSuccess = () => {
        refreshData();
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="page-container">
            <div className="header-container">
                <div className="title-container">
                    <h1>Book Catalog</h1>
                </div>
            </div>
            <div className="catalog-container">
                {data.map((card: any, index) => (
                    <Card key={index} className='book-card-container'>
                        <CardActionArea
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                            onClick={() => router.push(`/book/${card.bo_bookId}`)}
                        >
                            <CardHeader
                                className='book-card-header'
                                title={card.bo_name}
                                subheader={card.bo_author ?? "Autor desconocido"}
                                classes={{ title: "book-card-title", subheader: "book-card-subtitle" }}
                            />
                            <CardMedia className='book-card-media'
                                component="img"
                                image={card.bo_coverImageUrl ?? "/image/no_book.jpg"}
                                alt={`${card.bo_name} cover`}
                            />
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    )
}
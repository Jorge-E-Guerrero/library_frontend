"use client";

import { useRouter, useSearchParams } from 'next/navigation'
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
    Toolbar,
    ListItem,
    Checkbox
} from '@mui/material';

import {
    Search as SearchIcon,
} from "@mui/icons-material";

import Search from '../../components/utils/search';
import { requestToApi } from '../../helpers/middleware';
import { fullname } from '@/src/helpers/general';

const model = "book";

export default function Page() {

    const searchParams = useSearchParams()

    const router = useRouter();

    // Search Bar
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");

    // Models
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState<{ [key: number]: boolean }>({});

    const getBooks = async () => {
        const request = await requestToApi({ method: "get", path: "/book" });
        const requestData = request.data ?? [];
        setBooks(requestData);
    }

    const getCategories = async () => {
        const request = await requestToApi({ method: "get", path: "/genre" });
        const requestData = request.data ?? [];

        const allGenres: { [key: number]: boolean } = {};
        requestData.forEach((genre: any) => {
            allGenres[genre.ge_genreId] = false;
        });

        setGenres(requestData);
        setSelectedGenres(allGenres);
    }

    const refreshData = async () => {

        const promises = [
            getBooks(),
            getCategories(),
        ];

        await Promise.all(promises);

    }

    const checkCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGenres((prev) => ({
            ...prev,
            [parseInt(event.target.name)]: event.target.checked,
        }));
    }

    useEffect(() => {
        if (Object.keys(selectedGenres).length) searchBooks(searchQuery);
    }, [selectedGenres]);

    const searchBooks = async (query: string = "") => {

        setSearchQuery(query);

        const availableGenres = Object.entries(selectedGenres)
            .filter(([key, value]) => value)
            .map(([key]) => parseInt(key));

        const filtered = books
            .filter((book: any) =>
                availableGenres.length === 0
                    ? true
                    : book.genres.some((genre: any) => availableGenres.includes(genre.ge_genreId))
            )
            .filter((book: any) =>
                (query === "") ||
                (
                    (
                        book.bo_name.toLowerCase().includes(query.toLowerCase())
                    ) ||
                    (
                        book.authors &&
                        book.authors.some((author: any) => fullname(author.person?.pe_firstName, author.person?.pe_lastName).toLowerCase().includes(query.toLowerCase()))
                    )
                )
            );

        //console.log("All books:", books);
        //console.log("Filtered books:", filtered);

        setFilteredBooks(filtered);

        const url = new URL(window.location.href);

        if (query) url.searchParams.set("search", query);
        else url.searchParams.delete("search");

        window.history.replaceState(null, "", url.toString());

    }

    const handleSuccess = () => {
        refreshData();
    }

    // Initialize books and genres with url params
    useEffect(() => {
        const searchQuery = searchParams.get("search") ?? "";
        refreshData().then(() => searchBooks(searchQuery));
    }, [books.length]);

    return (
        <div className="page-container">
            <div className="page-header-container">
                <Toolbar className="header-toolbar">
                    <Search value={searchQuery} onInput={searchBooks} />
                </Toolbar>
            </div>

            <div className="main-content-container">
                <div className='genres-container'>
                    <div className='genres-header'>
                        <Typography className="genres-title" variant="h6">Genres</Typography>
                    </div>
                    <div className='genres-list'>
                        <List className='genres-list-content'>
                            {genres.map((genre: any) => <ListItem key={genre.ge_genreId}>
                                {genre.ge_genreName}
                                <Checkbox
                                    name={genre.ge_genreId.toString()}
                                    checked={selectedGenres[genre.ge_genreId]}
                                    onChange={checkCategory}
                                />
                            </ListItem>)}
                        </List>
                    </div>

                </div>
                <div className="catalog-container">
                    {filteredBooks.map((card: any, index) => (
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
                                    subheader={card.authors.map((author: any) => fullname(author.person?.pe_firstName, author.person?.pe_lastName)).join(", ") ?? "Autor desconocido"}
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
        </div>
    )
}
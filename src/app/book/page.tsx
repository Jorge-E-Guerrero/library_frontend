"use client";

import { useRouter, useSearchParams, useSelectedLayoutSegment } from 'next/navigation'
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

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
    AutoStories as AutoStoriesIcon,
    Business as BusinessIcon,
    EventAvailable as EventAvailableIcon,
} from "@mui/icons-material";

import Search from '../../components/utils/search';
import { requestToApi } from '../../helpers/middleware';
import { fullname } from '@/src/helpers/general';
import Collapse from '@/src/components/utils/collapse';

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

    const [publishers, setPublishers] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState<{ [key: number]: boolean }>({});

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

    const getPublishers = async () => {
        const request = await requestToApi({ method: "get", path: "/publisher" });
        const requestData = request.data ?? [];

        const allPublishers: { [key: number]: boolean } = {};
        requestData.forEach((publisher: any) => {
            allPublishers[publisher.pu_publisherId] = false;
        });

        setPublishers(requestData);
        setSelectedPublishers(allPublishers);
    }

    const refreshData = async () => {

        const promises = [
            getBooks(),
            getCategories(),
            getPublishers(),
        ];

        await Promise.all(promises);

    }

    const checkCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedGenres((prev) => ({
            ...prev,
            [parseInt(event.target.name)]: event.target.checked,
        }));
    }

    const checkPublisher = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPublishers((prev) => ({
            ...prev,
            [parseInt(event.target.name)]: event.target.checked,
        }));
    }

    useEffect(() => {
        if (Object.keys(selectedGenres).length) searchBooks(searchQuery);
    }, [selectedGenres]);

    useEffect(() => {
        if (Object.keys(selectedPublishers).length) searchBooks(searchQuery);
    }, [selectedPublishers]);

    const searchBooks = async (query: string = "") => {

        // Update search query state also if debounced
        setSearchQuery(query);

        debounce(() => {

            // Genre filtering
            const availableGenres = Object.entries(selectedGenres)
                .filter(([key, value]) => value)
                .map(([key]) => parseInt(key));

            // Publisher filtering
            const availablePublishers = Object.entries(selectedPublishers)
                .filter(([key, value]) => value)
                .map(([key]) => parseInt(key));

            // Book filtering
            const filtered = books
                .filter((book: any) =>
                    availablePublishers.length === 0
                        ? true
                        : availablePublishers.includes(book.publisher?.pu_publisherId)
                )
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

            // Update filtered books state
            setFilteredBooks(filtered);

            // Update URL search params
            const url = new URL(window.location.href);

            // Set or delete search param
            if (query) url.searchParams.set("search", query);
            else url.searchParams.delete("search");

            // Replace state without reloading
            window.history.replaceState(null, "", url.toString());

        }, 300)();

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
                <div className='filters-container'>
                    <Collapse name="Genres" icon={<AutoStoriesIcon />}>
                        {genres.map((genre: any) => <ListItem className="filter-item" key={genre.ge_genreId}>
                            <Typography className="filter-name" variant="body1">{genre.ge_genreName}</Typography>
                            <Checkbox
                                className="filter-checkbox"
                                name={genre.ge_genreId.toString()}
                                checked={selectedGenres[genre.ge_genreId]}
                                onChange={checkCategory}
                            />
                        </ListItem>)}
                    </Collapse>
                    <Collapse name="Publishers" icon={<BusinessIcon />}>
                        {publishers.map((publisher: any) => <ListItem className="filter-item" key={publisher.pu_publisherId}>
                            <Typography className="filter-name" variant="body1">{publisher.pu_publisherName}</Typography>
                            <Checkbox
                                className="filter-checkbox"
                                name={publisher.pu_publisherId.toString()}
                                checked={selectedPublishers[publisher.pu_publisherId]}
                                onChange={checkPublisher}
                            />
                        </ListItem>)}
                    </Collapse>
                    <Collapse name="Availability" icon={<EventAvailableIcon />}>
                        {publishers.map((publisher: any) => <ListItem className="filter-item" key={publisher.pu_publisherId}>
                            <Typography className="filter-name" variant="body1">{publisher.pu_publisherName}</Typography>
                            <Checkbox
                                className="filter-checkbox"
                                name={publisher.pu_publisherId.toString()}
                                checked={selectedPublishers[publisher.pu_publisherId]}
                                onChange={checkPublisher}
                            />
                        </ListItem>)}
                    </Collapse>
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
import React, { useEffect, useState } from 'react';
import { getBooks, getAuthorDetails } from '../services/openLibraryService';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Typography,
    Button,
    CircularProgress
} from '@mui/material';
import { CSVLink } from "react-csv";
import { useTheme } from '@mui/material/styles';

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, [page, rowsPerPage]);

    const theme = useTheme();

    const fetchBooks = async () => {
        setLoading(true);
        const data = await getBooks(page + 1, rowsPerPage);
        setTotalBooks(data.numFound);
        const bookDetails = await Promise.all(
            data.docs.map(async (book) => {
                const author = await getAuthorDetails(book.author_key[0]);
                return {
                    title: book.title,
                    author_name: author.name,
                    ratings_average: book.ratings_average,
                    first_publish_year: book.first_publish_year,
                    subject: book.subject ? book.subject[0] : 'N/A',
                    author_birth_date: author.birth_date,
                    author_top_work: author.top_work
                };
            })
        );
        setBooks(bookDetails);
        setLoading(false);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Book List
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'title'}
                                        direction={orderBy === 'title' ? order : 'asc'}
                                        onClick={createSortHandler('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'author_name'}
                                        direction={orderBy === 'author_name' ? order : 'asc'}
                                        onClick={createSortHandler('author_name')}
                                    >
                                        Author Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Ratings Average</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'first_publish_year'}
                                        direction={orderBy === 'first_publish_year' ? order : 'asc'}
                                        onClick={createSortHandler('first_publish_year')}
                                    >
                                        First Publish Year
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Author Birth Date</TableCell>
                                <TableCell>Author Top Work</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book, index) => (
                                <TableRow key={index}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author_name}</TableCell>
                                    <TableCell>{book.ratings_average}</TableCell>
                                    <TableCell>{book.first_publish_year}</TableCell>
                                    <TableCell>{book.subject}</TableCell>
                                    <TableCell>{book.author_birth_date}</TableCell>
                                    <TableCell>{book.author_top_work}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 50, 100]}
                    component="div"
                    count={totalBooks}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                    <CSVLink data={books} filename={"books.csv"} style={{ textDecoration: 'none', color: 'inherit' }}>
                        Download CSV
                    </CSVLink>
                </Button>
            </Paper>
        </Container>
    );
};

export default BookTable;

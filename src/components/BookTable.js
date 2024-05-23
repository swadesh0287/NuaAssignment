import React, { useEffect, useState } from 'react';
import { getBooksByAuthor,getBooks, getAuthorDetails } from '../services/openLibraryService';
import { useNavigate } from 'react-router-dom';
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
    CircularProgress,
    TextField, // Import TextField for the search input field
    IconButton // Import IconButton for search button
} from '@mui/material';
import { CSVLink } from "react-csv";
import { Search } from '@mui/icons-material'; // Import Search icon for the search button
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false); // Add state for fetching additional data
    const [authorQuery, setAuthorQuery] = useState(''); // State to store the author search query

    useEffect(() => {
        fetchBooks();
    }, [page, rowsPerPage, authorQuery]); // Include authorQuery in the dependency array to trigger fetchBooks when the authorQuery changes


    const theme = useTheme();
    const navigate = useNavigate();

    const fetchBooks = async () => {
        setLoading(true);
        setFetching(true);
        try {
            let data;
            if (authorQuery) {
                // Fetch books filtered by author if authorQuery is not empty
                data = await getBooksByAuthor(authorQuery, page + 1, rowsPerPage);
            } else {
                // Fetch all books if authorQuery is empty
                data = await getBooks(page + 1, rowsPerPage);
            }
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
                        author_top_work: author.top_work?author.top_work[0] :'N/a'
                    };
                })
            );
            // Clear previous data when performing a new search
            if (authorQuery && page === 0) {
                setBooks(bookDetails);
            } else {
                // Append new data to existing data when fetching additional pages
                setBooks((prevBooks) => [...prevBooks, ...bookDetails]);
            }
            setLoading(false);
            setFetching(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
            setFetching(false);
        }
    };

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    
    function getComparator(order, property) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, property)
            : (a, b) => -descendingComparator(a, b, property);
    }
    
    function descendingComparator(a, b, property) {
        if (b[property] < a[property]) {
            return -1;
        }
        if (b[property] > a[property]) {
            return 1;
        }
        return 0;
    }

    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Update books array based on the sorting order
    const sortedBooks = stableSort([...books], getComparator(order, property));
    setBooks(sortedBooks);
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
    
    const { logout } = useAuth();
    
    const handleLogout = () => {
        logout(); 
        navigate('/login'); // Now you can use navigate here
    };

    const handleSearch = () => {
        setPage(0); // Reset page number when performing a new search
        fetchBooks(); // Fetch books based on the author search query
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
                <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
                    Logout
                </Button>
                <TextField
                    label="Search by Author"
                    value={authorQuery}
                    onChange={(e) => setAuthorQuery(e.target.value)}
                    variant="outlined"
                    style={{ marginBottom: '1rem' }}
                />
                <IconButton onClick={handleSearch} aria-label="search">
                    <Search />
                </IconButton>
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
                                <TableCell>
                                <TableSortLabel
                                        active={orderBy === 'ratings_average'}
                                        direction={orderBy === 'ratings_average' ? order : 'asc'}
                                        onClick={createSortHandler('ratings_average')}
                                    >
                                        Ratings Average
                                        </TableSortLabel>
                                        </TableCell>
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
                                <TableCell>
                                
                                <TableSortLabel
                                        active={orderBy === 'author_birth_date'}
                                        direction={orderBy === 'author_birth_date' ? order : 'asc'}
                                        onClick={createSortHandler('author_birth_date')}
                                    >
                                    Author Birth Date
                                    </TableSortLabel>
                                    </TableCell>
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

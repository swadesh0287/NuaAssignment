import React, { useEffect, useState, useRef } from 'react';
import { getBooksByAuthor, getBooks, getAuthorDetails } from '../services/openLibraryService';
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
    TextField,
    IconButton
} from '@mui/material';
import { CSVLink } from "react-csv";
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0); // Start with page 0
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [authorQuery, setAuthorQuery] = useState('');
    const [fetching, setFetching] = useState(false);
    const [editingBooks, setEditingBooks] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null); // Ref for the container element
    
    useEffect(() => {
        fetchBooks();
    }, [page, rowsPerPage, authorQuery]);

    const handleScroll = () => {
        // Check if user has scrolled to the bottom of the container
        if (
            containerRef.current.scrollTop + containerRef.current.clientHeight >=
            containerRef.current.scrollHeight - 20
        ) {
            // Fetch more books if not already fetching and there are more books to fetch
            if (!fetching && books.length < totalBooks) {
                setPage(prevPage => prevPage + 1); // Increment page
                setFetching(true);
            }
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            let data;
            if (authorQuery) {
                data = await getBooksByAuthor(authorQuery, page + 1, rowsPerPage);
            } else {
                data = await getBooks(page + 1, rowsPerPage);
            }
            setTotalBooks(data.numFound);
            const bookDetails = await Promise.all(
                data.docs.map(async (book) => {
                    const author = await getAuthorDetails(book.author_key[0]);
                    return {
                        id: book.key, // Assuming each book has a unique identifier
                        title: book.title,
                        author_name: author.name,
                        ratings_average: book.ratings_average,
                        first_publish_year: book.first_publish_year,
                        subject: book.subject ? book.subject[0] : 'N/A',
                        author_birth_date: author.birth_date,
                        author_top_work: author.top_work ? author.top_work[0] : 'N/A',
                        isEditing: editingBooks.includes(book.key)
                    };
                })
            );
            if (page === 0) {
                setBooks(bookDetails);
            } else {
                setBooks(prevBooks => [...prevBooks, ...bookDetails]);
            }
            setLoading(false);
            setFetching(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
            setFetching(false);
        }
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };
    
    const getComparator = (order, property) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, property)
            : (a, b) => -descendingComparator(a, b, property);
    };
    
    const descendingComparator = (a, b, property) => {
        if (b[property] < a[property]) {
            return -1;
        }
        if (b[property] > a[property]) {
            return 1;
        }
        return 0;
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedBooks = stableSort([...books], getComparator(order, property));
        setBooks(sortedBooks);
    };

    const createSortHandler = (property) => () => {
        handleRequestSort(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page number when rows per page changes
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            let searchData;
            if (authorQuery) {
                searchData = await getBooksByAuthor(authorQuery, 1, rowsPerPage);
            } else {
                searchData = await getBooks(1, rowsPerPage);
            }
            setTotalBooks(searchData.numFound);
            const searchResults = await Promise.all(
                searchData.docs.map(async (book) => {
                    const author = await getAuthorDetails(book.author_key[0]);
                    return {
                        id: book.key,
                        title: book.title,
                        author_name: author.name,
                        ratings_average: book.ratings_average,
                        first_publish_year: book.first_publish_year,
                        subject: book.subject ? book.subject[0] : 'N/A',
                        author_birth_date: author.birth_date,
                        author_top_work: author.top_work ? author.top_work[0] : 'N/A',
                        isEditing: editingBooks.includes(book.key)
                    };
                })
            );
            setBooks(searchResults);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setLoading(false);
        }
    };

    const handleSearchInputChange = (event) => {
        setAuthorQuery(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const { logout } = useAuth(); 

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    variant="outlined"
                    style={{ marginBottom: '1rem' }}
                />
                <IconButton onClick={handleSearch} aria-label="search">
                    <Search />
                </IconButton>
               
                <TableContainer ref={containerRef}>
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
                    page={page} // Adjust page number for zero-based index
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

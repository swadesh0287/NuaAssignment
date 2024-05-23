import axios from 'axios';

const API_URL = 'https://openlibrary.org/';

const getBooks = async (page, limit) => {
    const response = await axios.get(`${API_URL}search.json`, {
        params: {
            q: 'books',
            page: page,
            limit: limit
        }
    });
    return response.data;
};
const getBooksByAuthor = async (authorName, page, limit) => {
    try {
        const response = await axios.get(`${API_URL}search.json`, {
            params: {
                q: `author:${authorName}`,
                page: page,
                limit: limit
            }
        });
        console.log('API URL:', response.config.url); // Log the constructed URL
        console.log('API Response:', response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error fetching books by author:', error);
        throw error;
    }
};

const getAuthorDetails = async (authorKey) => {
    const response = await axios.get(`${API_URL}authors/${authorKey}.json`);
    return response.data;
};

export { getBooks,getBooksByAuthor, getAuthorDetails };

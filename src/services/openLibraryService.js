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

const getAuthorDetails = async (authorKey) => {
    const response = await axios.get(`${API_URL}authors/${authorKey}.json`);
    return response.data;
};

export { getBooks, getAuthorDetails };

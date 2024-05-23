import React from 'react';
import { useAuth } from '../src/context/AuthContext';
import BookTable from './components/BookTable';

import Login from './components/Login';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
      
        <div>
             <Router>
          <Navbar/>
            {isAuthenticated ? <BookTable /> : <Login />}
            </Router>
        </div>
    );
};

export default App;

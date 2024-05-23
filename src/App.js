import React from 'react';
import { useAuth } from '../src/context/AuthContext';
import BookTable from './components/BookTable';

import Login from './components/Login';
import Navbar from './components/Navbar';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
      
        <div>
          <Navbar/>
            {isAuthenticated ? <BookTable /> : <Login />}
        </div>
    );
};

export default App;

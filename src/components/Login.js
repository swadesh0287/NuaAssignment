import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Paper, Typography, CssBaseline } from '@mui/material';
import { styled } from '@mui/system'; 

const StyledPaper = styled(Paper)({
  padding: '2rem',
  maxWidth: '400px', 
  margin: 'auto', 
  marginTop: '100px',
  
});

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        login(username, password);
    };

    return (
        <>
            <CssBaseline />
            <StyledPaper elevation={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        Login
                    </Button>
                </form>
            </StyledPaper>
        </>
    );
};

export default Login;

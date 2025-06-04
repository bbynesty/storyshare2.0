import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import StoriesPage from './pages/StoriesPage';
import SearchPage from './pages/SearchPage';
import CreateStoryPage from './pages/CreateStoryPage';
import AuthPage from './pages/AuthPage';
import Footer from './components/Footer';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffb6c1',
            light: '#ffc0cb',
            dark: '#ffa4b5',
        },
        secondary: {
            main: '#ffc0cb',
            light: '#ffd1dc',
            dark: '#ffb6c1',
        },
        background: {
            default: '#fff0f5',
            paper: '#ffffff',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(45deg, #ffb6c1 30%, #ffc0cb 90%)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    '&:hover': {
                        backgroundColor: '#ffc0cb',
                    },
                },
            },
        },
    },
});

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user ? children : <Navigate to="/auth" />;
};

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth');
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 182, 193, 0.9)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        StoryShare
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/')}>Главная</Button>
                    <Button color="inherit" onClick={() => navigate('/stories')}>Истории</Button>
                    <Button color="inherit" onClick={() => navigate('/search')}>Поиск</Button>
                    {user ? (
                        <>
                            <Button color="inherit" onClick={() => navigate('/create')}>Создать</Button>
                            <Button color="inherit" onClick={handleLogout}>Выйти</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/auth')}>Войти</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/stories" element={<StoriesPage />} />
                    <Route path="/story/:id" element={<StoryPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route 
                        path="/create" 
                        element={
                            <PrivateRoute>
                                <CreateStoryPage />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/auth" 
                        element={user ? <Navigate to="/" /> : <AuthPage />} 
                    />
                </Routes>
            </Box>

            <Footer />
        </Box>
    );
}

// Обертка для использования хуков навигации
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper; 
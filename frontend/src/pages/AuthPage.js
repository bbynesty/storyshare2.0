import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Tab,
    Tabs,
    Alert
} from '@mui/material';
import { login, register } from '../api';

function AuthPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setFormData({ username: '', email: '', password: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (activeTab === 0) {
                // Вход
                response = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Регистрация
                response = await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });
            }
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            // Отправляем событие обновления пользователя
            window.dispatchEvent(new Event('userUpdated'));
            // Полная перезагрузка
            window.location.href = '/';
        } catch (error) {
            console.error('Auth error:', error);
            const errorMessage = error.message || (activeTab === 0 ? 'Неправильный email или пароль' : 'Не удалось зарегистрироваться');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                        StoryShare
                    </Typography>
                    
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Вход" />
                        <Tab label="Регистрация" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        {activeTab === 1 && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Имя пользователя"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : (activeTab === 0 ? 'Войти' : 'Зарегистрироваться')}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default AuthPage;
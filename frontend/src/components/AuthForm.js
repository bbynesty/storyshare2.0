import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    Typography,
    Paper,
    Tabs,
    Tab
} from '@mui/material';

const AuthForm = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(formData);
        } else {
            onRegister(formData);
        }
    };

    return (
        <Paper sx={{ p: 3, m: 2, maxWidth: 400, mx: 'auto' }}>
            <Tabs
                value={isLogin ? 0 : 1}
                onChange={(e, newValue) => setIsLogin(newValue === 0)}
                sx={{ mb: 3 }}
            >
                <Tab label="Вход" />
                <Tab label="Регистрация" />
            </Tabs>

            <Typography variant="h5" gutterBottom>
                {isLogin ? 'Вход в систему' : 'Регистрация'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Имя пользователя"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Пароль"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>
            </Box>
        </Paper>
    );
};

export default AuthForm; 
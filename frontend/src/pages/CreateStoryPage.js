import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper } from '@mui/material';
import { createStory } from '../api';

const CreateStoryPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('Необходимо войти в систему');
            return;
        }

        try {
            await createStory({
                ...formData,
                authorId: user.id
            });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Произошла ошибка при создании истории');
            console.error('Create story error:', err);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" align="center">
                        Необходимо войти в систему для создания историй
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Создать новую историю
                    </Typography>

                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Заголовок"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Содержание"
                            name="content"
                            multiline
                            rows={6}
                            value={formData.content}
                            onChange={handleChange}
                        />
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Создать
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default CreateStoryPage; 
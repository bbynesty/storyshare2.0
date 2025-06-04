import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    Typography,
    Paper
} from '@mui/material';

const StoryForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        content: ''
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
        onSubmit(formData);
        setFormData({ title: '', author: '', content: '' });
    };

    return (
        <Paper sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" gutterBottom>
                Добавить новую историю
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Название"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Автор"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Содержание"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    margin="normal"
                    required
                    multiline
                    rows={6}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Опубликовать
                </Button>
            </Box>
        </Paper>
    );
};

export default StoryForm; 
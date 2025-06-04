import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    CardActionArea,
    CircularProgress,
    Grid,
    TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchStories } from '../api';

const SearchPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setStories([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await searchStories(query);
            setStories(data.stories || []);
        } catch (err) {
            console.error('Error searching stories:', err);
            setError('Не удалось выполнить поиск');
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQueryChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        handleSearch(query);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Поиск историй
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Введите текст для поиска..."
                    value={searchQuery}
                    onChange={handleQueryChange}
                    sx={{ 
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(255, 182, 193, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress color="primary" />
                    </Box>
                )}

                {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && stories.length === 0 && searchQuery && (
                    <Typography align="center" color="text.secondary">
                        Ничего не найдено
                    </Typography>
                )}

                {!loading && !error && stories.length > 0 && (
                    <Grid container spacing={3}>
                        {stories.map((story) => (
                            <Grid item xs={12} md={6} key={story.id}>
                                <Card 
                                    sx={{ 
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(255, 182, 193, 0.3)',
                                        },
                                        border: '1px solid rgba(255, 182, 193, 0.3)',
                                        backgroundColor: 'rgba(255, 240, 245, 0.5)',
                                    }}
                                >
                                    <CardActionArea onClick={() => navigate(`/story/${story.id}`)}>
                                        <CardContent>
                                            <Typography 
                                                variant="h6" 
                                                component="div" 
                                                gutterBottom
                                                sx={{ 
                                                    color: 'primary.main',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {story.title}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {story.content}
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" color="primary.main">
                                                    Автор ID: {story.authorId}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(story.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default SearchPage; 
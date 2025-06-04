import React, { useState, useEffect } from 'react';
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
import { fetchAllStories } from '../api';

const StoriesPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadStories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAllStories();
                setStories(data.stories || []);
            } catch (err) {
                setError('Не удалось загрузить истории');
                console.error('Error loading stories:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStories();
    }, []);

    const filteredStories = stories.filter(story => 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4 }}>
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Все истории
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Поиск историй..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {filteredStories.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        Истории не найдены
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredStories.map((story) => (
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

export default StoriesPage; 
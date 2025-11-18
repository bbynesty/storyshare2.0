import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper, Button, CircularProgress } from '@mui/material';
import { fetchStory } from '../api';
import CommentsSection from '../components/CommentsSection';
import FavoriteButton from '../components/FavoriteButton';

const StoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStory = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchStory(id);
                setStory(data || null);
            } catch (err) {
                setError('Не удалось загрузить историю');
                console.error('Error loading story:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStory();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!story) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography align="center">
                        История не найдена
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
                            {story?.title || ''}
                        </Typography>
                        <FavoriteButton storyId={story?.id} />
                    </Box>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                        {story?.content || ''}
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Автор ID: {story.authorId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Создано: {(() => { const d = story?.createdAt ? new Date(story.createdAt) : null; return d && !isNaN(d) ? d.toLocaleString() : ''; })()}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={() => navigate('/')}>
                            Назад
                        </Button>
                    </Box>
                </Paper>

                <CommentsSection storyId={story?.id} />
            </Box>
        </Container>
    );
};

export default StoryPage; 
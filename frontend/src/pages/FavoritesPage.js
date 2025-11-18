import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    CardActionArea,
    Grid
} from '@mui/material';
import { fetchAllStories } from '../api';

const FavoritesPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    });

    // Отслеживаем изменения пользователя
    useEffect(() => {
        const checkUser = () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
                if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
                    setUser(currentUser);
                }
            } catch {
                setUser(null);
            }
        };
        
        checkUser();
        const interval = setInterval(checkUser, 1000); // Проверяем каждую секунду
        
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        // Загружаем избранное при монтировании или смене пользователя
        if (user) {
            loadFavorites();
        } else {
            setStories([]);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Обновляем при изменении localStorage
        const handleStorageChange = () => {
            if (user) {
                loadFavorites();
            }
        };
        
        // Обновляем при возврате на страницу
        const handleFocus = () => {
            if (user) {
                loadFavorites();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favoritesUpdated', handleStorageChange);
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesUpdated', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [user]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                setStories([]);
                setLoading(false);
                return;
            }
            
            const allStoriesData = await fetchAllStories();
            const allStories = allStoriesData.stories || [];
            
            // Убеждаемся, что user.id - это число
            const userId = Number(user.id);
            if (isNaN(userId) || userId <= 0) {
                console.error('Invalid user.id:', user.id);
                setStories([]);
                setLoading(false);
                return;
            }
            
            const favoritesKey = `favorites_${userId}`;
            const favoriteIds = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
            console.log('Favorite IDs from localStorage for user', userId, ':', favoriteIds);
            console.log('All stories:', allStories);
            
            // Преобразуем все ID в числа для корректного сравнения
            const favoriteIdsNum = favoriteIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            console.log('Favorite IDs as numbers:', favoriteIdsNum);
            
            const favoriteStories = allStories.filter(story => {
                const storyIdNum = parseInt(story.id, 10);
                const isFavorite = !isNaN(storyIdNum) && favoriteIdsNum.includes(storyIdNum);
                if (isFavorite) {
                    console.log('Found favorite story:', story.id, story.title);
                }
                return isFavorite;
            });
            
            console.log('Filtered favorite stories:', favoriteStories);
            setStories(favoriteStories);
        } catch (err) {
            setError('Не удалось загрузить избранное');
            console.error('Error loading favorites:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Избранное
                    </Typography>
                    <Typography align="center" color="text.secondary">
                        Войдите в систему, чтобы просматривать избранное
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Typography>Загрузка...</Typography>
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
                    Избранное ({stories.length})
                </Typography>

                {stories.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        У вас пока нет избранных историй
                    </Typography>
                ) : (
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

export default FavoritesPage;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    CardActionArea,
    Grid,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchUserStories, updateStory } from '../api';

const MyStoriesPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStory, setEditingStory] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', content: '' });
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const isClosingRef = useRef(false);
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
        const interval = setInterval(checkUser, 1000);
        
        return () => clearInterval(interval);
    }, [user]);

    const loadStories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading stories for user:', user.id);
            const data = await fetchUserStories(user.id);
            console.log('Stories data received:', data);
            
            // Обрабатываем разные форматы ответа
            let storiesArray = [];
            if (Array.isArray(data)) {
                storiesArray = data;
            } else if (data && Array.isArray(data.stories)) {
                storiesArray = data.stories;
            }
            
            console.log('Stories array:', storiesArray);
            setStories(storiesArray);
        } catch (err) {
            console.error('Error loading user stories:', err);
            setError('Не удалось загрузить ваши истории: ' + (err.message || 'Неизвестная ошибка'));
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadStories();
        } else {
            setStories([]);
            setLoading(false);
        }
    }, [user, loadStories]);

    const handleEdit = (story) => {
        if (!story || !story.id) {
            console.error('Invalid story for editing:', story);
            setError('Неверные данные истории для редактирования');
            return;
        }
        
        setEditingStory(story);
        setEditForm({
            title: story.title || '',
            content: story.content || ''
        });
        setError(null);
        setDialogOpen(true);
    };

    const handleSaveEdit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (!editingStory || !editForm.title.trim() || !editForm.content.trim() || saving) {
            return;
        }

        try {
            setSaving(true);
            setError(null);
            
            // Проверяем, что у истории есть ID и authorId
            if (!editingStory.id) {
                throw new Error('Неверный ID истории');
            }
            
            if (!editingStory.authorId) {
                throw new Error('Неверный ID автора');
            }
            
            console.log('Updating story:', editingStory.id, editForm);
            
            const result = await updateStory(editingStory.id, {
                title: editForm.title.trim(),
                content: editForm.content.trim(),
                authorId: Number(editingStory.authorId)
            });
            
            console.log('Story updated:', result);
            
            // Закрываем диалог, очистка произойдет в onExited
            isClosingRef.current = true;
            setDialogOpen(false);
            setError(null);
            
            // НЕ обновляем список сразу - это может вызвать конфликт с закрытием Dialog
            // Список обновится когда пользователь вернется на страницу или обновит ее
        } catch (err) {
            console.error('Error updating story:', err);
            let errorMessage = 'Неизвестная ошибка';
            
            if (err && err.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && err.toString) {
                errorMessage = err.toString();
            }
            
            setError('Не удалось обновить историю: ' + errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (saving) {
            return; // Не позволяем закрыть диалог во время сохранения
        }
        // Просто закрываем диалог, очистка произойдет в onExited
        isClosingRef.current = true;
        setDialogOpen(false);
    };

    if (!user) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Мои истории
                    </Typography>
                    <Typography align="center" color="text.secondary">
                        Войдите в систему, чтобы просматривать свои истории
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error && stories.length === 0) {
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
                    Мои истории ({stories.length})
                </Typography>

                {error && (
                    <Typography color="error" align="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {stories.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        У вас пока нет опубликованных историй
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
                                        position: 'relative',
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(story);
                                            }}
                                            color="primary"
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                    <CardActionArea onClick={() => navigate(`/story/${story.id}`)}>
                                        <CardContent>
                                            <Typography 
                                                variant="h6" 
                                                component="div" 
                                                gutterBottom
                                                sx={{ 
                                                    color: 'primary.main',
                                                    fontWeight: 'bold',
                                                    pr: 4,
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

            {/* Диалог редактирования */}
            {editingStory && (
                <Dialog 
                    open={dialogOpen} 
                    onClose={(e, reason) => {
                        // Разрешаем закрытие только если не идет сохранение
                        if (!saving) {
                            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                                handleCancelEdit();
                            }
                        }
                    }} 
                    maxWidth="md" 
                    fullWidth
                    disableEscapeKeyDown={saving}
                    TransitionProps={{
                        unmountOnExit: true,
                        onExited: () => {
                            // Очищаем данные только после полного закрытия и размонтирования
                            // Используем двойной requestAnimationFrame для гарантии завершения всех операций
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    if (!saving && isClosingRef.current) {
                                        // Обновляем список после полного закрытия
                                        loadStories();
                                        // Очищаем состояние
                                        setEditingStory(null);
                                        setEditForm({ title: '', content: '' });
                                        setError(null);
                                        isClosingRef.current = false;
                                    }
                                });
                            });
                        }
                    }}
                >
                    <form onSubmit={handleSaveEdit} noValidate>
                        <DialogTitle>Редактировать историю</DialogTitle>
                        <DialogContent>
                            {error && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Заголовок"
                                fullWidth
                                variant="outlined"
                                value={editForm.title || ''}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                disabled={saving}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Содержание"
                                fullWidth
                                multiline
                                rows={6}
                                variant="outlined"
                                value={editForm.content || ''}
                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                disabled={saving}
                                required
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                type="button"
                                onClick={handleCancelEdit} 
                                disabled={saving}
                            >
                                Отмена
                            </Button>
                            <Button 
                                type="submit"
                                variant="contained" 
                                disabled={!editForm.title?.trim() || !editForm.content?.trim() || saving}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Сохранить'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </Container>
    );
};

export default MyStoriesPage;

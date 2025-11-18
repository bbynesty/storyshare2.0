import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert
} from '@mui/material';
import { fetchComments, createComment } from '../api';

const CommentsSection = ({ storyId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const loadComments = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchComments(storyId);
            console.log('Comments data received:', data);
            
            // Обрабатываем разные форматы ответа
            let commentsArray = [];
            if (Array.isArray(data)) {
                commentsArray = data;
            } else if (data && Array.isArray(data.comments)) {
                commentsArray = data.comments;
            } else if (data && data.stories) {
                commentsArray = data.stories;
            }
            
            console.log('Comments array:', commentsArray);
            setComments(commentsArray);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Не удалось загрузить комментарии');
        } finally {
            setLoading(false);
        }
    }, [storyId]);

    useEffect(() => {
        if (storyId) {
            loadComments();
        }
    }, [storyId, loadComments]);

    // Отслеживаем изменения комментариев для отладки
    useEffect(() => {
        console.log('Comments updated, count:', comments.length, 'comments:', comments);
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user || submitting) return;

        try {
            setError('');
            setSubmitting(true);
            const result = await createComment(storyId, {
                userId: user.id,
                content: newComment.trim()
            });
            console.log('Comment created:', result);
            setNewComment('');
            
            // Небольшая задержка перед перезагрузкой, чтобы сервер успел обработать
            await new Promise(resolve => setTimeout(resolve, 100));
            await loadComments();
        } catch (err) {
            console.error('Error creating comment:', err);
            setError('Не удалось добавить комментарий');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Комментарии
                </Typography>
                <Typography color="text.secondary">
                    Войдите в систему, чтобы оставлять комментарии
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Комментарии ({comments.length})
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 2, mb: 2 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Напишите комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={submitting}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!newComment.trim() || submitting}
                    >
                        Отправить
                    </Button>
                </form>
            </Paper>

            {comments.length === 0 ? (
                <Typography color="text.secondary">
                    Пока нет комментариев. Будьте первым!
                </Typography>
            ) : (
                <List>
                    {comments.map((comment, index) => (
                        <React.Fragment key={comment.id || index}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Пользователь ID: {comment.userId}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            {comment.content}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < comments.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default CommentsSection;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import FavoriteButton from './FavoriteButton';

const QuoteCard = ({ quote }) => {
    const navigate = useNavigate();
    
    if (!quote) return null;
    
    const handleClick = () => {
        if (quote?.id) {
            navigate(`/story/${quote.id}`);
        }
    };
    
    return (
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
                <FavoriteButton storyId={quote?.id} />
            </Box>
            <CardActionArea onClick={handleClick}>
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
                        {quote?.title || ''}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{
                            fontStyle: 'italic',
                            mb: 2,
                        }}
                    >
                        "{quote?.content || ''}"
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="primary.main">
                            Автор ID: {quote.authorId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {(() => { const d = quote?.createdAt ? new Date(quote.createdAt) : null; return d && !isNaN(d) ? d.toLocaleString() : ''; })()}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default QuoteCard; 
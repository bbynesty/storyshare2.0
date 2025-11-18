import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';
import QuoteCard from '../components/QuoteCard';
import { fetchRandomQuote } from '../api';

function HomePage() {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadQuote = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRandomQuote();
            setQuote(data);
        } catch (error) {
            console.error('Error loading quote:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuote();
    }, []);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Добро пожаловать в StoryShare
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : error ? (
                    <Box sx={{ width: '100%', maxWidth: 600 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={loadQuote}
                            sx={{ mt: 2 }}
                        >
                            Попробовать снова
                        </Button>
                    </Box>
                ) : quote ? (
                    <>
                        <QuoteCard quote={quote} />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={loadQuote}
                            sx={{ mt: 2 }}
                        >
                            Другая цитата
                        </Button>
                    </>
                ) : null}
            </Box>
        </Container>
    );
}

export default HomePage; 
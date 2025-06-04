import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: 'rgba(255, 182, 193, 0.1)',
                borderTop: '1px solid rgba(255, 182, 193, 0.3)',
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="h6" color="primary" gutterBottom align="center">
                    Участники проекта
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" paragraph>
                    Ксения Калугина, Лейла Аббасова, Анастасия Гришанина
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Link 
                        href="mailto:nancy2207@mail.ru" 
                        color="primary"
                        sx={{ 
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        nancy2207@mail.ru
                    </Link>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer; 
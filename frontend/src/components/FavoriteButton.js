import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FavoriteButton = ({ storyId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
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

    // Функция для проверки, в избранном ли история
    const checkFavorite = () => {
        if (!user || !user.id || !storyId) {
            return false;
        }
        
        try {
            // Убеждаемся, что user.id - это число
            const userId = Number(user.id);
            if (isNaN(userId) || userId <= 0) {
                console.warn('Invalid user.id in checkFavorite:', user.id);
                return false;
            }
            
            const favoritesKey = `favorites_${userId}`;
            const favoritesStr = localStorage.getItem(favoritesKey);
            
            if (!favoritesStr || favoritesStr === 'null' || favoritesStr === 'undefined') {
                return false;
            }
            
            const favorites = JSON.parse(favoritesStr);
            
            if (!Array.isArray(favorites) || favorites.length === 0) {
                return false;
            }
            
            const storyIdNum = parseInt(storyId, 10);
            
            if (isNaN(storyIdNum) || storyIdNum <= 0) {
                return false;
            }
            
            const isFav = favorites.some(id => {
                const idNum = parseInt(id, 10);
                return !isNaN(idNum) && idNum > 0 && idNum === storyIdNum;
            });
            
            return isFav;
        } catch (e) {
            console.error('Error in checkFavorite:', e);
            return false;
        }
    };

    useEffect(() => {
        setIsFavorite(checkFavorite());
        
        // Слушаем изменения в localStorage и события обновления избранного
        const handleStorageChange = () => {
            setIsFavorite(checkFavorite());
        };
        
        const handleFavoritesUpdated = () => {
            setIsFavorite(checkFavorite());
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favoritesUpdated', handleFavoritesUpdated);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdated);
        };
    }, [user, storyId]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user || !user.id) {
            console.error('No user or user.id:', user);
            return;
        }
        
        if (!storyId) {
            console.error('No storyId:', storyId);
            return;
        }
        
        try {
            // Убеждаемся, что user.id - это число
            const userId = Number(user.id);
            if (isNaN(userId) || userId <= 0) {
                console.error('Invalid user.id:', user.id);
                return;
            }
            
            const favoritesKey = `favorites_${userId}`;
            const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
            const storyIdNum = parseInt(storyId, 10);
            
            if (isNaN(storyIdNum) || storyIdNum <= 0) {
                console.error('Invalid storyId:', storyId);
                return;
            }
            
            const currentIndex = favorites.findIndex(id => {
                const idNum = parseInt(id, 10);
                return !isNaN(idNum) && idNum > 0 && idNum === storyIdNum;
            });
            
            if (currentIndex >= 0) {
                // Удаляем из избранного
                favorites.splice(currentIndex, 1);
                setIsFavorite(false);
            } else {
                // Добавляем в избранное
                favorites.push(storyIdNum);
                setIsFavorite(true);
            }
            
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            console.log(`Updated favorites for user ${userId}:`, favorites);
            window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (e) {
            console.error('Error toggling favorite:', e);
        }
    };

    if (!user || !storyId) {
        return null;
    }

    return (
        <Tooltip title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
            <IconButton
                onClick={handleToggle}
                color={isFavorite ? 'error' : 'default'}
                sx={{ ml: 1 }}
            >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default FavoriteButton;

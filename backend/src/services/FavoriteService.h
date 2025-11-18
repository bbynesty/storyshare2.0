#pragma once
#include "../models/Favorite.h"
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <crow/json.h>
#include <optional>

class FavoriteService {
private:
    std::vector<Favorite> favorites;
    int next_id = 1;

    std::string getCurrentTime() {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }

public:
    // Получение всех избранных
    std::vector<Favorite> getAllFavorites() const {
        return favorites;
    }

    // Получение избранных по ID пользователя
    std::vector<Favorite> getFavoritesByUserId(int userId) const {
        std::vector<Favorite> result;
        for (const auto& favorite : favorites) {
            if (favorite.userId == userId) {
                result.push_back(favorite);
            }
        }
        return result;
    }

    // Получение избранного по ID
    std::optional<Favorite> getFavoriteById(int id) const {
        auto it = std::find_if(favorites.begin(), favorites.end(),
            [id](const Favorite& f) { return f.id == id; });
        return it != favorites.end() ? std::optional<Favorite>(*it) : std::nullopt;
    }

    // Проверка, добавлена ли история в избранное
    bool isFavorite(int userId, int storyId) const {
        auto it = std::find_if(favorites.begin(), favorites.end(),
            [userId, storyId](const Favorite& f) { 
                return f.userId == userId && f.storyId == storyId; 
            });
        return it != favorites.end();
    }

    // Добавление в избранное
    Favorite addToFavorites(int userId, int storyId) {
        Favorite favorite;
        favorite.id = next_id++;
        favorite.userId = userId;
        favorite.storyId = storyId;
        favorite.createdAt = getCurrentTime();
        favorites.push_back(favorite);
        return favorite;
    }

    // Удаление из избранного
    bool removeFromFavorites(int userId, int storyId) {
        auto it = std::find_if(favorites.begin(), favorites.end(),
            [userId, storyId](const Favorite& f) { 
                return f.userId == userId && f.storyId == storyId; 
            });
        if (it != favorites.end()) {
            favorites.erase(it);
            return true;
        }
        return false;
    }
};

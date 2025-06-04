#pragma once
#include "../models/User.h"
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <crow/json.h>
#include <optional>

class UserService {
private:
    std::vector<User> users;
    int next_id = 1;

    std::string getCurrentTime() {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }

public:
    // Получение всех пользователей
    std::vector<User> getAllUsers() const {
        return users;
    }

    // Получение пользователя по ID
    std::optional<User> getUserById(int id) const {
        auto it = std::find_if(users.begin(), users.end(),
            [id](const User& u) { return u.id == id; });
        return it != users.end() ? std::optional<User>(*it) : std::nullopt;
    }

    // Создание нового пользователя
    User createUser(const User& user) {
        User newUser = user;
        newUser.id = next_id++;
        newUser.createdAt = getCurrentTime();
        newUser.updatedAt = newUser.createdAt;
        users.push_back(newUser);
        return newUser;
    }

    // Обновление пользователя
    std::optional<User> updateUser(const User& user) {
        auto it = std::find_if(users.begin(), users.end(),
            [&user](const User& u) { return u.id == user.id; });
        if (it != users.end()) {
            *it = user;
            it->updatedAt = getCurrentTime();
            return std::optional<User>(*it);
        }
        return std::nullopt;
    }

    // Удаление пользователя
    bool deleteUser(int id) {
        auto it = std::find_if(users.begin(), users.end(),
            [id](const User& u) { return u.id == id; });
        if (it != users.end()) {
            users.erase(it);
            return true;
        }
        return false;
    }
}; 
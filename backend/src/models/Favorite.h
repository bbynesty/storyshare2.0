#pragma once
#include <string>
#include <crow/json.h>

struct Favorite {
    int id;
    int userId;
    int storyId;
    std::string createdAt;

    // Конвертация в JSON
    crow::json::wvalue toJson() const {
        crow::json::wvalue json;
        json["id"] = id;
        json["userId"] = userId;
        json["storyId"] = storyId;
        json["createdAt"] = createdAt;
        return json;
    }

    // Создание из JSON
    static Favorite fromJson(const crow::json::rvalue& json) {
        Favorite favorite;
        favorite.id = json["id"].i();
        favorite.userId = json["userId"].i();
        favorite.storyId = json["storyId"].i();
        favorite.createdAt = json["createdAt"].s();
        return favorite;
    }
};

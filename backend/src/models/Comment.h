#pragma once
#include <string>
#include <crow/json.h>

struct Comment {
    int id;
    int storyId;
    int userId;
    std::string content;
    std::string createdAt;
    std::string updatedAt;

    // Конвертация в JSON
    crow::json::wvalue toJson() const {
        crow::json::wvalue json;
        json["id"] = id;
        json["storyId"] = storyId;
        json["userId"] = userId;
        json["content"] = content;
        json["createdAt"] = createdAt;
        json["updatedAt"] = updatedAt;
        return json;
    }

    // Создание из JSON
    static Comment fromJson(const crow::json::rvalue& json) {
        Comment comment;
        comment.id = json["id"].i();
        comment.storyId = json["storyId"].i();
        comment.userId = json["userId"].i();
        comment.content = json["content"].s();
        comment.createdAt = json["createdAt"].s();
        comment.updatedAt = json["updatedAt"].s();
        return comment;
    }
};

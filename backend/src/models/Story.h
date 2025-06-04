#pragma once
#include <string>
#include <vector>
#include <crow/json.h>

struct Story {
    int id;
    std::string title;
    std::string content;
    int authorId;
    std::string createdAt;
    std::string updatedAt;

    // Конвертация в JSON
    crow::json::wvalue toJson() const {
        crow::json::wvalue json;
        json["id"] = id;
        json["title"] = title;
        json["content"] = content;
        json["authorId"] = authorId;
        json["createdAt"] = createdAt;
        json["updatedAt"] = updatedAt;
        return json;
    }

    // Создание из JSON
    static Story fromJson(const crow::json::rvalue& json) {
        Story story;
        story.id = json["id"].i();
        story.title = json["title"].s();
        story.content = json["content"].s();
        story.authorId = json["authorId"].i();
        story.createdAt = json["createdAt"].s();
        story.updatedAt = json["updatedAt"].s();
        return story;
    }
}; 
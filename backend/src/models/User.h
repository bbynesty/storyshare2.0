#pragma once
#include <string>
#include <crow/json.h>

struct User {
    int id;
    std::string username;
    std::string email;
    // Храним пароль в учебных целях (в проде нужен хэш)
    std::string password;
    std::string createdAt;
    std::string updatedAt;

    crow::json::wvalue toJson() const {
        crow::json::wvalue json;
        json["id"] = id;
        json["username"] = username;
        json["email"] = email;
        // Пароль не сериализуем в ответ
        json["createdAt"] = createdAt;
        json["updatedAt"] = updatedAt;
        return json;
    }

    static User fromJson(const crow::json::rvalue& json) {
        User user;
        user.id = json["id"].i();
        user.username = json["username"].s();
        user.email = json["email"].s();
        if (json.has("password")) {
            user.password = json["password"].s();
        }
        user.createdAt = json["createdAt"].s();
        user.updatedAt = json["updatedAt"].s();
        return user;
    }
}; 
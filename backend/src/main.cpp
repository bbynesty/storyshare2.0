#define _WIN32_WINNT 0x0601
#include "crow_config.h"
#include "crow.h"
#include "models/Story.h"
#include "models/User.h"
#include "models/Comment.h"
#include "models/Favorite.h"
#include "services/StoryService.h"
#include "services/UserService.h"
#include "services/CommentService.h"
#include "services/FavoriteService.h"
#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include <random>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <memory>
#include <map>
#include <cstdlib>

// Глобальные сервисы
std::unique_ptr<StoryService> storyService;
std::unique_ptr<UserService> userService;
std::unique_ptr<CommentService> commentService;
std::unique_ptr<FavoriteService> favoriteService;

// Временное хранилище историй (в реальном приложении здесь будет база данных)
std::vector<Story> stories;
int next_id = 1;

// Временное хранилище токенов (в реальном приложении здесь будет база данных)
std::map<std::string, int> userTokens;

// Вспомогательная функция для получения текущего времени в формате ISO 8601
std::string getCurrentTime() {
    auto now = std::chrono::system_clock::now();
    auto now_time_t = std::chrono::system_clock::to_time_t(now);
    auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()) % 1000;
    
    std::tm tm;
#ifdef _WIN32
    gmtime_s(&tm, &now_time_t);
#else
    gmtime_r(&now_time_t, &tm);
#endif
    
    std::ostringstream oss;
    oss << std::put_time(&tm, "%Y-%m-%dT%H:%M:%S");
    oss << '.' << std::setfill('0') << std::setw(3) << now_ms.count();
    oss << 'Z';
    return oss.str();
}

// Функция для генерации случайной цитаты
Story getRandomQuote() {
    static Story lastSuccessfulQuote;  // Сохраняем последнюю успешную цитату
    static bool hasLastQuote = false;  // Флаг наличия последней цитаты

    try {
        auto stories = storyService->getAllStories();
        if (stories.empty()) {
            if (hasLastQuote) {
                return lastSuccessfulQuote;  // Возвращаем последнюю успешную цитату
            }
            Story emptyStory;
            emptyStory.id = 1;  // Используем ID 1 вместо 0
            emptyStory.title = "Нет доступных историй";
            emptyStory.content = "Пока нет доступных историй. Будьте первым, кто поделится своей историей!";
            emptyStory.authorId = 1;
            emptyStory.createdAt = getCurrentTime();
            emptyStory.updatedAt = emptyStory.createdAt;
            return emptyStory;
        }

        // Выбираем случайную историю
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> dis(0, stories.size() - 1);
        auto story = stories[dis(gen)];

        // Проверяем, что история не пустая
        if (story.content.empty()) {
            if (hasLastQuote) {
                return lastSuccessfulQuote;
            }
            return story;
        }

        // Разбиваем текст на предложения
        std::vector<std::string> sentences;
        std::string current;
        
        for (size_t i = 0; i < story.content.length(); i++) {
            char c = story.content[i];
            current += c;
            
            if (c == '.' || c == '!' || c == '?') {
                // Убираем лишние пробелы
                std::string trimmed = current;
                trimmed = trimmed.substr(trimmed.find_first_not_of(" \t\n\r"));
                trimmed = trimmed.substr(0, trimmed.find_last_not_of(" \t\n\r") + 1);
                
                if (!trimmed.empty()) {
                    sentences.push_back(trimmed);
                }
                current.clear();
            }
        }

        // Добавляем последнее предложение, если оно есть
        if (!current.empty()) {
            std::string trimmed = current;
            trimmed = trimmed.substr(trimmed.find_first_not_of(" \t\n\r"));
            trimmed = trimmed.substr(0, trimmed.find_last_not_of(" \t\n\r") + 1);
            if (!trimmed.empty()) {
                sentences.push_back(trimmed);
            }
        }

        // Если нет предложений, возвращаем всю историю
        if (sentences.empty()) {
            if (hasLastQuote) {
                return lastSuccessfulQuote;
            }
            return story;
        }

        // Выбираем случайное предложение
        std::uniform_int_distribution<> sentence_dis(0, sentences.size() - 1);
        std::string quote = sentences[sentence_dis(gen)];

        // Создаем новую историю с одним предложением
        Story quoteStory;
        quoteStory.id = story.id;
        quoteStory.title = story.title;
        quoteStory.content = quote;
        quoteStory.authorId = story.authorId;
        quoteStory.createdAt = story.createdAt;
        quoteStory.updatedAt = story.updatedAt;

        // Сохраняем успешную цитату
        lastSuccessfulQuote = quoteStory;
        hasLastQuote = true;

        return quoteStory;
    } catch (const std::exception& e) {
        // В случае ошибки возвращаем последнюю успешную цитату или создаем новую
        if (hasLastQuote) {
            return lastSuccessfulQuote;
        }
        
        Story errorStory;
        errorStory.id = 1;  // Используем ID 1 вместо 0
        errorStory.title = "Ошибка";
        errorStory.content = "Произошла ошибка при получении цитаты. Попробуйте еще раз.";
        errorStory.authorId = 1;
        errorStory.createdAt = getCurrentTime();
        errorStory.updatedAt = errorStory.createdAt;
        return errorStory;
    }
}

// Middleware для CORS
struct CORSMiddleware {
    struct context {};

    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        // Устанавливаем CORS заголовки для всех запросов
        res.set_header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Max-Age", "86400");

        // Обработка preflight запросов
        if (req.method == "OPTIONS"_method) {
            res.code = 200;  // OK
            res.end();
            return;
        }
    }

    void after_handle(crow::request& req, crow::response& res, context& ctx) {
        // Убеждаемся, что CORS заголовки установлены и для ответов
        if (!res.get_header_value("Access-Control-Allow-Origin").empty()) {
            return;
        }
        res.set_header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
};

int main() {
    try {
        // Инициализация сервисов
        storyService = std::make_unique<StoryService>();
        userService = std::make_unique<UserService>();
        commentService = std::make_unique<CommentService>();
        favoriteService = std::make_unique<FavoriteService>();

        // Создание приложения Crow с CORS middleware
        crow::App<CORSMiddleware> app;

        // Регистрация пользователя
        CROW_ROUTE(app, "/auth/register")
        .methods("POST"_method)
        ([&](const crow::request& req) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                // Проверяем наличие всех необходимых полей
                if (!x.has("username") || !x.has("email") || !x.has("password")) {
                    res.code = 400;
                    res.write("{\"error\": \"Missing required fields\"}");
                    return res;
                }

                // Проверяем, не существует ли уже пользователь с таким email
                if (auto existing = userService->getUserByEmail(x["email"].s()); existing.has_value()) {
                    res.code = 400;
                    res.write("{\"error\": \"User with this email already exists\"}");
                    return res;
                }

                // Создаем нового пользователя
                User user;
                user.username = x["username"].s();
                user.email = x["email"].s();
                user.password = x["password"].s();
                user.createdAt = getCurrentTime();
                user.updatedAt = user.createdAt;

                auto createdUser = userService->createUser(user);

                // Генерируем токен (в реальном приложении здесь будет JWT)
                std::string token = "token_" + std::to_string(createdUser.id);
                userTokens[token] = createdUser.id;

                // Возвращаем данные пользователя и токен
                crow::json::wvalue response;
                response["user"] = createdUser.toJson();
                response["token"] = token;
                res.write(response.dump());
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Вход пользователя
        CROW_ROUTE(app, "/auth/login")
        .methods("POST"_method)
        ([&](const crow::request& req) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                // Проверяем наличие всех необходимых полей
                if (!x.has("email") || !x.has("password")) {
                    res.code = 400;
                    res.write("{\"error\": \"Missing required fields\"}");
                    return res;
                }

                // Ищем пользователя по email
                auto found = userService->getUserByEmail(x["email"].s());
                if (found.has_value()) {
                    // Проверяем пароль (в проде — сравнение хеша)
                    if (found->password != x["password"].s()) {
                        res.code = 401;
                        res.write("{\"error\": \"Invalid email or password\"}");
                        return res;
                    }

                    // Генерируем токен
                    std::string token = "token_" + std::to_string(found->id);
                    userTokens[token] = found->id;

                    // Возвращаем данные пользователя и токен
                    crow::json::wvalue response;
                    response["user"] = found->toJson();
                    response["token"] = token;
                    res.write(response.dump());
                    return res;
                }

                // Если пользователь не найден
                res.code = 401;
                res.write("{\"error\": \"Invalid email or password\"}");
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Получение всех историй
        CROW_ROUTE(app, "/api/stories")
        .methods("GET"_method)
        ([&](const crow::request&) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto stories = storyService->getAllStories();
            crow::json::wvalue response;
            response["stories"] = crow::json::wvalue::list();
            for (size_t i = 0; i < stories.size(); i++) {
                response["stories"][i] = stories[i].toJson();
            }
            res.write(response.dump());
            return res;
        });

        // Получение случайной цитаты
        CROW_ROUTE(app, "/api/quotes/random")
        .methods("GET"_method)
        ([&](const crow::request&) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto quote = getRandomQuote();
            res.write(quote.toJson().dump());
            return res;
        });

        // Получение истории по ID
        CROW_ROUTE(app, "/api/stories/<int>")
        .methods("GET"_method)
        ([&](const crow::request&, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto story = storyService->getStoryById(id);
            if (story) {
                res.write(story->toJson().dump());
            } else {
                res.code = 404;
                res.write("{\"error\": \"Story not found\"}");
            }
            return res;
        });

        // Создание новой истории
        CROW_ROUTE(app, "/api/stories")
        .methods("POST"_method)
        ([&](const crow::request& req) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                Story story;
                story.title = x["title"].s();
                story.content = x["content"].s();
                story.authorId = x["authorId"].i();
                story.createdAt = getCurrentTime();
                story.updatedAt = story.createdAt;

                auto createdStory = storyService->createStory(story);
                res.write(createdStory.toJson().dump());
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Обновление истории
        CROW_ROUTE(app, "/api/stories/<int>")
        .methods("PUT"_method)
        ([&](const crow::request& req, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                // Получаем существующую историю для сохранения createdAt
                auto existingStory = storyService->getStoryById(id);
                if (!existingStory) {
                    res.code = 404;
                    res.write("{\"error\": \"Story not found\"}");
                    return res;
                }

                Story story;
                story.id = id;
                story.title = x["title"].s();
                story.content = x["content"].s();
                story.authorId = x["authorId"].i();
                story.createdAt = existingStory->createdAt; // Сохраняем оригинальную дату создания
                story.updatedAt = getCurrentTime();

                auto updatedStory = storyService->updateStory(story);
                if (updatedStory) {
                    res.write(updatedStory->toJson().dump());
                } else {
                    res.code = 404;
                    res.write("{\"error\": \"Story not found\"}");
                }
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Удаление истории
        CROW_ROUTE(app, "/api/stories/<int>")
        .methods("DELETE"_method)
        ([&](const crow::request&, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            if (storyService->deleteStory(id)) {
                res.write("{\"message\": \"Story deleted successfully\"}");
            } else {
                res.code = 404;
                res.write("{\"error\": \"Story not found\"}");
            }
            return res;
        });

        // Получение всех пользователей
        CROW_ROUTE(app, "/api/users")
        .methods("GET"_method)
        ([&](const crow::request&) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto users = userService->getAllUsers();
            crow::json::wvalue response;
            response["users"] = crow::json::wvalue::list();
            for (size_t i = 0; i < users.size(); i++) {
                response["users"][i] = users[i].toJson();
            }
            res.write(response.dump());
            return res;
        });

        // Получение пользователя по ID
        CROW_ROUTE(app, "/api/users/<int>")
        .methods("GET"_method)
        ([&](const crow::request&, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto user = userService->getUserById(id);
            if (user) {
                res.write(user->toJson().dump());
            } else {
                res.code = 404;
                res.write("{\"error\": \"User not found\"}");
            }
            return res;
        });

        // Создание нового пользователя
        CROW_ROUTE(app, "/api/users")
        .methods("POST"_method)
        ([&](const crow::request& req) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                User user;
                user.username = x["username"].s();
                user.email = x["email"].s();
                user.createdAt = getCurrentTime();
                user.updatedAt = user.createdAt;

                auto createdUser = userService->createUser(user);
                res.write(createdUser.toJson().dump());
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Обновление пользователя
        CROW_ROUTE(app, "/api/users/<int>")
        .methods("PUT"_method)
        ([&](const crow::request& req, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                User user;
                user.id = id;
                user.username = x["username"].s();
                user.email = x["email"].s();
                user.updatedAt = getCurrentTime();

                auto updatedUser = userService->updateUser(user);
                if (updatedUser) {
                    res.write(updatedUser->toJson().dump());
                } else {
                    res.code = 404;
                    res.write("{\"error\": \"User not found\"}");
                }
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Удаление пользователя
        CROW_ROUTE(app, "/api/users/<int>")
        .methods("DELETE"_method)
        ([&](const crow::request&, int id) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            if (userService->deleteUser(id)) {
                res.write("{\"message\": \"User deleted successfully\"}");
            } else {
                res.code = 404;
                res.write("{\"error\": \"User not found\"}");
            }
            return res;
        });

        // Добавляем тестовые данные
        {
        Story testStory1;
        testStory1.title = "Первая история";
        testStory1.content = "Это первая тестовая история. Она содержит несколько предложений. Каждое предложение заканчивается точкой.";
        testStory1.authorId = 1;
        testStory1.createdAt = getCurrentTime();
        testStory1.updatedAt = testStory1.createdAt;
        storyService->createStory(testStory1);

        Story testStory2;
        testStory2.title = "Вторая история";
        testStory2.content = "Это вторая тестовая история! Она тоже содержит несколько предложений. И даже восклицательный знак.";
        testStory2.authorId = 1;
        testStory2.createdAt = getCurrentTime();
        testStory2.updatedAt = testStory2.createdAt;
        storyService->createStory(testStory2);

        User testUser;
        testUser.username = "testuser";
        testUser.email = "test@example.com";
        testUser.createdAt = getCurrentTime();
        testUser.updatedAt = testUser.createdAt;
        userService->createUser(testUser);
        }

        // Поиск историй
        CROW_ROUTE(app, "/api/stories/search")
        .methods("GET"_method)
        ([&](const crow::request& req) {
            auto query = req.url_params.get("q");
            if (!query) {
                return crow::response(400, "Query parameter 'q' is required");
            }

            auto stories = storyService->getAllStories();
            std::vector<Story> results;
            
            for (const auto& story : stories) {
                if (story.title.find(query) != std::string::npos || 
                    story.content.find(query) != std::string::npos) {
                    results.push_back(story);
                }
            }

            crow::json::wvalue response;
            response["stories"] = crow::json::wvalue::list();
            for (size_t i = 0; i < results.size(); i++) {
                response["stories"][i]["id"] = results[i].id;
                response["stories"][i]["title"] = results[i].title;
                response["stories"][i]["content"] = results[i].content;
                response["stories"][i]["authorId"] = results[i].authorId;
                response["stories"][i]["createdAt"] = results[i].createdAt;
            }

            return crow::response(200, response);
        });

        // Получение историй пользователя
        CROW_ROUTE(app, "/api/users/<int>/stories")
        .methods("GET"_method)
        ([&](const crow::request&, int userId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto allStories = storyService->getAllStories();
            std::vector<Story> userStories;
            
            for (const auto& story : allStories) {
                if (story.authorId == userId) {
                    userStories.push_back(story);
                }
            }
            
            crow::json::wvalue response;
            response["stories"] = crow::json::wvalue::list();
            for (size_t i = 0; i < userStories.size(); i++) {
                response["stories"][i] = userStories[i].toJson();
            }
            res.write(response.dump());
            return res;
        });

        // === КОММЕНТАРИИ ===
        
        // Получение комментариев к истории
        CROW_ROUTE(app, "/api/stories/<int>/comments")
        .methods("GET"_method)
        ([&](const crow::request&, int storyId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto comments = commentService->getCommentsByStoryId(storyId);
            crow::json::wvalue response;
            response["comments"] = crow::json::wvalue::list();
            for (size_t i = 0; i < comments.size(); i++) {
                response["comments"][i] = comments[i].toJson();
            }
            res.write(response.dump());
            return res;
        });

        // Создание комментария
        CROW_ROUTE(app, "/api/stories/<int>/comments")
        .methods("POST"_method)
        ([&](const crow::request& req, int storyId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                Comment comment;
                comment.storyId = storyId;
                comment.userId = x["userId"].i();
                comment.content = x["content"].s();
                comment.createdAt = getCurrentTime();
                comment.updatedAt = comment.createdAt;

                auto createdComment = commentService->createComment(comment);
                res.write(createdComment.toJson().dump());
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // === ИЗБРАННОЕ ===
        
        // Получение избранных историй пользователя
        CROW_ROUTE(app, "/api/users/<int>/favorites")
        .methods("GET"_method)
        ([&](const crow::request&, int userId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            auto favorites = favoriteService->getFavoritesByUserId(userId);
            crow::json::wvalue response;
            response["favorites"] = crow::json::wvalue::list();
            for (size_t i = 0; i < favorites.size(); i++) {
                response["favorites"][i] = favorites[i].toJson();
            }
            res.write(response.dump());
            return res;
        });

        // Добавление в избранное
        CROW_ROUTE(app, "/api/stories/<int>/favorite")
        .methods("POST"_method)
        ([&](const crow::request& req, int storyId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                int userId = x["userId"].i();
                
                // Проверяем, не добавлена ли уже история в избранное
                if (favoriteService->isFavorite(userId, storyId)) {
                    res.code = 400;
                    res.write("{\"error\": \"Story already in favorites\"}");
                    return res;
                }

                auto favorite = favoriteService->addToFavorites(userId, storyId);
                res.write(favorite.toJson().dump());
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Удаление из избранного
        CROW_ROUTE(app, "/api/stories/<int>/favorite")
        .methods("DELETE"_method)
        ([&](const crow::request& req, int storyId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            try {
                auto x = crow::json::load(req.body);
                if (!x) {
                    res.code = 400;
                    res.write("{\"error\": \"Invalid JSON\"}");
                    return res;
                }

                int userId = x["userId"].i();
                
                if (favoriteService->removeFromFavorites(userId, storyId)) {
                    res.write("{\"message\": \"Removed from favorites\"}");
                } else {
                    res.code = 404;
                    res.write("{\"error\": \"Favorite not found\"}");
                }
            } catch (const std::exception& e) {
                res.code = 500;
                res.write("{\"error\": \"" + std::string(e.what()) + "\"}");
            }
            return res;
        });

        // Проверка, добавлена ли история в избранное
        CROW_ROUTE(app, "/api/stories/<int>/favorite/<int>")
        .methods("GET"_method)
        ([&](const crow::request&, int storyId, int userId) {
            crow::response res;
            res.set_header("Content-Type", "application/json");
            
            bool isFav = favoriteService->isFavorite(userId, storyId);
            crow::json::wvalue response;
            response["isFavorite"] = isFav;
            res.write(response.dump());
            return res;
        });

        // Запуск сервера
        // Используем переменную окружения PORT для Railway, иначе 8080
        int port = 8080;
        const char* port_env = std::getenv("PORT");
        if (port_env != nullptr) {
            port = std::atoi(port_env);
        }
        app.port(port).multithreaded().run();
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
} 
#pragma once
#include "../models/Comment.h"
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <crow/json.h>
#include <optional>

class CommentService {
private:
    std::vector<Comment> comments;
    int next_id = 1;

    std::string getCurrentTime() {
        auto now = std::chrono::system_clock::now();
        auto time = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&time), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }

public:
    // Получение всех комментариев
    std::vector<Comment> getAllComments() const {
        return comments;
    }

    // Получение комментариев по ID истории
    std::vector<Comment> getCommentsByStoryId(int storyId) const {
        std::vector<Comment> result;
        for (const auto& comment : comments) {
            if (comment.storyId == storyId) {
                result.push_back(comment);
            }
        }
        return result;
    }

    // Получение комментария по ID
    std::optional<Comment> getCommentById(int id) const {
        auto it = std::find_if(comments.begin(), comments.end(),
            [id](const Comment& c) { return c.id == id; });
        return it != comments.end() ? std::optional<Comment>(*it) : std::nullopt;
    }

    // Создание нового комментария
    Comment createComment(const Comment& comment) {
        Comment newComment = comment;
        newComment.id = next_id++;
        newComment.createdAt = getCurrentTime();
        newComment.updatedAt = newComment.createdAt;
        comments.push_back(newComment);
        return newComment;
    }

    // Обновление комментария
    std::optional<Comment> updateComment(const Comment& comment) {
        auto it = std::find_if(comments.begin(), comments.end(),
            [&comment](const Comment& c) { return c.id == comment.id; });
        if (it != comments.end()) {
            *it = comment;
            it->updatedAt = getCurrentTime();
            return std::optional<Comment>(*it);
        }
        return std::nullopt;
    }

    // Удаление комментария
    bool deleteComment(int id) {
        auto it = std::find_if(comments.begin(), comments.end(),
            [id](const Comment& c) { return c.id == id; });
        if (it != comments.end()) {
            comments.erase(it);
            return true;
        }
        return false;
    }
};

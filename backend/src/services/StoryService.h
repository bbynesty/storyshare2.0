#pragma once
#include "../models/Story.h"
#include <vector>
#include <string>
#include <random>
#include <algorithm>
#include <sstream>
#include <crow/json.h>
#include <optional>

class StoryService {
private:
    std::vector<Story> stories;
    int next_id = 1;

    // Вспомогательная функция для разделения текста на предложения
    std::vector<std::string> splitIntoSentences(const std::string& text) {
        std::vector<std::string> sentences;
        std::stringstream ss(text);
        std::string sentence;
        
        while (std::getline(ss, sentence, '.')) {
            if (!sentence.empty()) {
                sentences.push_back(sentence + ".");
            }
        }
        return sentences;
    }

public:
    // Получение всех историй
    std::vector<Story> getAllStories() const {
        return stories;
    }

    // Получение истории по ID
    std::optional<Story> getStoryById(int id) const {
        auto it = std::find_if(stories.begin(), stories.end(),
            [id](const Story& s) { return s.id == id; });
        return it != stories.end() ? std::optional<Story>(*it) : std::nullopt;
    }

    // Создание новой истории
    Story createStory(const Story& story) {
        Story newStory = story;
        newStory.id = next_id++;
        stories.push_back(newStory);
        return newStory;
    }

    // Обновление истории
    std::optional<Story> updateStory(const Story& story) {
        auto it = std::find_if(stories.begin(), stories.end(),
            [&story](const Story& s) { return s.id == story.id; });
        if (it != stories.end()) {
            *it = story;
            return std::optional<Story>(*it);
        }
        return std::nullopt;
    }

    // Удаление истории
    bool deleteStory(int id) {
        auto it = std::find_if(stories.begin(), stories.end(),
            [id](const Story& s) { return s.id == id; });
        if (it != stories.end()) {
            stories.erase(it);
            return true;
        }
        return false;
    }

    // Получение случайной цитаты
    std::pair<Story, std::string> getRandomQuote() {
        if (stories.empty()) {
            return {Story(), ""};
        }

        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> storyDist(0, stories.size() - 1);
        
        const Story& randomStory = stories[storyDist(gen)];
        auto sentences = splitIntoSentences(randomStory.content);
        
        if (sentences.empty()) {
            return {randomStory, ""};
        }

        std::uniform_int_distribution<> sentenceDist(0, sentences.size() - 1);
        return {randomStory, sentences[sentenceDist(gen)]};
    }
}; 
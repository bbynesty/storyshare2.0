// Убираем слеш в конце URL, если он есть
const getApiBaseUrl = () => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};
const API_BASE_URL = getApiBaseUrl();

async function handleResponse(response) {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (err) {
            if (err instanceof Error && err.message.includes('HTTP error')) {
                throw err;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    try {
        return await response.json();
    } catch (err) {
        // Если ответ не JSON, возвращаем пустой объект
        return {};
    }
}

export async function login(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Неверный email или пароль');
            }
            const errorMsg = errorData.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMsg);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        // Если ошибка уже имеет сообщение, используем его, иначе общее
        if (error.message && !error.message.includes('Failed to fetch')) {
            throw error;
        }
        throw new Error('Не удалось войти. Проверьте подключение к серверу.');
    }
}

export async function register(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMsg);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        // Если ошибка уже имеет сообщение, используем его, иначе общее
        if (error.message && !error.message.includes('Failed to fetch')) {
            throw error;
        }
        throw new Error('Не удалось зарегистрироваться. Проверьте подключение к серверу.');
    }
}

export async function fetchRandomQuote() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/quotes/random`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching random quote:', error);
        throw new Error('Не удалось загрузить цитату. Пожалуйста, попробуйте позже.');
    }
}

export const fetchAllStories = async () => {
    const response = await fetch(`${API_BASE_URL}/api/stories`);
    return handleResponse(response);
};

export const fetchStory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${id}`);
    return handleResponse(response);
};

export const searchStories = async (query) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
};

export const createStory = async (storyData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/stories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
    });
    return handleResponse(response);
};

// === КОММЕНТАРИИ ===

export const fetchComments = async (storyId) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/comments`);
    return handleResponse(response);
};

export const createComment = async (storyId, commentData) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    });
    return handleResponse(response);
};

// === ИЗБРАННОЕ ===

export const fetchUserFavorites = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites`);
    return handleResponse(response);
};

export const addToFavorites = async (storyId, userId) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/favorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
};

export const removeFromFavorites = async (storyId, userId) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/favorite`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
};

export const checkFavorite = async (storyId, userId) => {
    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/favorite/${userId}`);
    return handleResponse(response);
};

// === МОИ ИСТОРИИ ===

export const fetchUserStories = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/stories`);
    return handleResponse(response);
};

export const updateStory = async (storyId, storyData) => {
    try {
        // Проверяем, что storyId валидный
        if (!storyId || isNaN(Number(storyId))) {
            throw new Error('Неверный ID истории');
        }

        // Проверяем обязательные поля
        if (!storyData || !storyData.title || !storyData.content) {
            throw new Error('Заголовок и содержание обязательны');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: String(storyData.title).trim(),
                content: String(storyData.content).trim(),
                authorId: Number(storyData.authorId)
            }),
        });
        
        if (!response.ok) {
            let errorData = {};
            try {
                const text = await response.text();
                if (text) {
                    errorData = JSON.parse(text);
                }
            } catch (e) {
                // Если не удалось распарсить JSON, используем текст ответа
                errorData = { error: `Ошибка сервера: ${response.status}` };
            }
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json().catch((e) => {
            console.error('Error parsing response:', e);
            throw new Error('Не удалось обработать ответ сервера');
        });
        
        return result;
    } catch (error) {
        console.error('Update story error:', error);
        // Пробрасываем ошибку дальше с понятным сообщением
        if (error.message) {
            throw error;
        }
        throw new Error('Не удалось обновить историю. Проверьте подключение к серверу.');
    }
}; 
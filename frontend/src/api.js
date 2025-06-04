const API_BASE_URL = 'http://localhost:8080';

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
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
        return handleResponse(response);
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Не удалось войти. Проверьте email и пароль.');
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
        return handleResponse(response);
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Не удалось зарегистрироваться. Возможно, пользователь с таким email уже существует.');
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
// src/utils/api.ts
const GRAPHQL_URL = 'http://localhost:5148/graphql';

export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
    const token = localStorage.getItem('token');

    // 2. Базові заголовки
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // 3. Якщо токен є, додаємо його до заголовків
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Робимо запит
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    // 5. Глобальна обробка GraphQL помилок
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    // 6. Повертаємо тільки чисті дані
    return result.data;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Error de servidor' }));
        throw new Error(error.message || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    boards: {
        list: () => request('/api/boards'),
        get: (id: string) => request(`/api/boards/${id}`),
        create: (title: string, companyType: string = 'peruana', country?: string, ruc?: string) => request('/api/boards', { method: 'POST', body: JSON.stringify({ title, companyType, country, ruc }) }),
        update: (id: string, title: string) => request(`/api/boards/${id}`, { method: 'PUT', body: JSON.stringify({ title }) }),
        delete: (id: string) => request(`/api/boards/${id}`, { method: 'DELETE' }),
    },
    cards: {
        create: (boardId: string, columnId: string, title: string, description = '', documentType = '', priority = 'media') =>
            request(`/api/boards/${boardId}/cards`, { method: 'POST', body: JSON.stringify({ columnId, title, description, documentType, priority }) }),
        update: (cardId: string, data: any) =>
            request(`/api/boards/cards/${cardId}`, { method: 'PUT', body: JSON.stringify(data) }),
        move: (cardId: string, targetColumnId: string, targetPosition: number) =>
            request(`/api/boards/cards/${cardId}/move`, { method: 'PUT', body: JSON.stringify({ targetColumnId, targetPosition }) }),
        delete: (cardId: string) =>
            request(`/api/boards/cards/${cardId}`, { method: 'DELETE' }),
    },
    operations: {
        list: () => request('/api/operations'),
        get: (id: string) => request(`/api/operations/${id}`),
        update: (id: string, data: any) => request(`/api/operations/${id}`, { method: 'PUT', body: JSON.stringify({ data }) }),
    }
};

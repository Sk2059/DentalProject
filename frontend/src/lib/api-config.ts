export const API_BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
    getData: '/api/data/',
    services: '/api/services/',
    featuredServices: '/api/services/featured/',
    team: '/api/team/',
    featuredTeam: '/api/team/featured/',
    appointments: '/api/appointments/',
    messages: '/api/messages/',
    login: '/api/login/',
    users: '/api/users/',
    createUser: '/api/users/create/',
} as const; 
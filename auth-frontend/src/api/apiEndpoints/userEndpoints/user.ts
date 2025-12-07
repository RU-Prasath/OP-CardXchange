export const USER_ENDPOINTS = {
    getAllUsers: '/api/users/all-users',
    getUserById: (id: string | number) => `/api/users/${id}`,
}
import api from './axiosClient'

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/users/me')
export const updateMe = (data) => api.put('/users/me', data)

// ── SOCIETY ───────────────────────────────────────────────────────────────────
export const createSociety = (data) => api.post('/societies', data)
export const getFlats = (societyId) => api.get(`/societies/${societyId}/flats`)
export const getGates = (societyId) => api.get(`/societies/${societyId}/gates`)
export const assignSocietyAdmin = (id, data) => api.put(`/societies/${id}/assign-admin`, data)
export const assignUserToSociety = (id, data) => api.put(`/societies/${id}/assign-user`, data)

// ── FLAT ──────────────────────────────────────────────────────────────────────
export const addFlat = (societyId, data) => api.post(`/societies/${societyId}/flats`, data)
export const assignResident = (flatId, data) => api.put(`/flats/${flatId}/assign`, data)

// ── GATE ──────────────────────────────────────────────────────────────────────
export const addGate = (societyId, data) => api.post(`/societies/${societyId}/gates`, data)
export const assignGuard = (gateId, data) => api.put(`/gates/${gateId}/assign`, data)

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const getAllUsers = (societyId) => api.get('/admin/users', { params: { societyId } })
export const toggleUserStatus = (id, isActive) => api.put(`/admin/users/${id}/status`, null, { params: { isActive } })
export const getAllEntries = (societyId) => api.get('/admin/entries', { params: { societyId } })

// ── PASSES ────────────────────────────────────────────────────────────────────
export const createPass = (data) => api.post('/passes', data)
export const getActivePasses = () => api.get('/passes')
export const getPassHistory = () => api.get('/passes/history')
export const getPassById = (id) => api.get(`/passes/${id}`)
export const revokePass = (id) => api.delete(`/passes/${id}`)

// ── ENTRIES ───────────────────────────────────────────────────────────────────
export const confirmEntry = (data) => api.post('/entries/confirm', data)
export const getMyEntries = () => api.get('/entries')
export const getFlatEntries = (flatId) => api.get(`/entries/flat/${flatId}`)

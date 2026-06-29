import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage  from './pages/auth/ProfilePage'

import ResidentDashboard   from './pages/resident/ResidentDashboard'
import CreatePassPage      from './pages/resident/CreatePassPage'
import MyPassesPage        from './pages/resident/MyPassesPage'
import ResidentEntriesPage from './pages/resident/ResidentEntriesPage'

import GuardDashboard from './pages/guard/GuardDashboard'

import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import AdminDashboard      from './pages/admin/AdminDashboard'
import AdminUsersPage      from './pages/admin/AdminUsersPage'
import AdminFlatsPage      from './pages/admin/AdminFlatsPage'
import AdminGatesPage      from './pages/admin/AdminGatesPage'
import AdminEntriesPage    from './pages/admin/AdminEntriesPage'

import HomePage    from './pages/public/HomePage'
import AboutPage   from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/about"    element={<AboutPage />} />
            <Route path="/contact"  element={<ContactPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            <Route path="/super-admin" element={
              <ProtectedRoute roles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['SOCIETY_ADMIN']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['SOCIETY_ADMIN']}><AdminUsersPage /></ProtectedRoute>
            } />
            <Route path="/admin/flats" element={
              <ProtectedRoute roles={['SOCIETY_ADMIN']}><AdminFlatsPage /></ProtectedRoute>
            } />
            <Route path="/admin/gates" element={
              <ProtectedRoute roles={['SOCIETY_ADMIN']}><AdminGatesPage /></ProtectedRoute>
            } />
            <Route path="/admin/entries" element={
              <ProtectedRoute roles={['SOCIETY_ADMIN']}><AdminEntriesPage /></ProtectedRoute>
            } />

            <Route path="/resident" element={
              <ProtectedRoute roles={['RESIDENT']}><ResidentDashboard /></ProtectedRoute>
            } />
            <Route path="/resident/create-pass" element={
              <ProtectedRoute roles={['RESIDENT']}><CreatePassPage /></ProtectedRoute>
            } />
            <Route path="/resident/passes" element={
              <ProtectedRoute roles={['RESIDENT']}><MyPassesPage /></ProtectedRoute>
            } />
            <Route path="/resident/entries" element={
              <ProtectedRoute roles={['RESIDENT']}><ResidentEntriesPage /></ProtectedRoute>
            } />

            <Route path="/guard" element={
              <ProtectedRoute roles={['GUARD']}><GuardDashboard /></ProtectedRoute>
            } />

            <Route path="/unauthorized" element={
              <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="display-1 text-danger">403</h1>
                  <h4>Unauthorized</h4>
                  <a href="/login" className="btn btn-primary mt-3">Go to Login</a>
                </div>
              </div>
            } />

            <Route path="*" element={
              <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="display-1 text-muted">404</h1>
                  <h4>Page Not Found</h4>
                  <a href="/" className="btn btn-primary mt-3">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
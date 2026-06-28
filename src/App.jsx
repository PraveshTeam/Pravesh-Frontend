import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'

// Auth pages
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage  from './pages/auth/ProfilePage'

// Resident pages
import ResidentDashboard  from './pages/resident/ResidentDashboard'
import CreatePassPage     from './pages/resident/CreatePassPage'
import MyPassesPage       from './pages/resident/MyPassesPage'
import ResidentEntriesPage from './pages/resident/ResidentEntriesPage'

// Guard pages
import GuardDashboard from './pages/guard/GuardDashboard'

// Admin pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import AdminDashboard      from './pages/admin/AdminDashboard'
import AdminUsersPage      from './pages/admin/AdminUsersPage'
import AdminFlatsPage      from './pages/admin/AdminFlatsPage'
import AdminGatesPage      from './pages/admin/AdminGatesPage'
import AdminEntriesPage    from './pages/admin/AdminEntriesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/contact"  element={<ContactPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Profile — all logged in users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* SUPER_ADMIN */}
          <Route path="/super-admin" element={
            <ProtectedRoute roles={['SUPER_ADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          {/* SOCIETY_ADMIN */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['SOCIETY_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['SOCIETY_ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/flats" element={
            <ProtectedRoute roles={['SOCIETY_ADMIN']}>
              <AdminFlatsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/gates" element={
            <ProtectedRoute roles={['SOCIETY_ADMIN']}>
              <AdminGatesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/entries" element={
            <ProtectedRoute roles={['SOCIETY_ADMIN']}>
              <AdminEntriesPage />
            </ProtectedRoute>
          } />

          {/* RESIDENT */}
          <Route path="/resident" element={
            <ProtectedRoute roles={['RESIDENT']}>
              <ResidentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/resident/create-pass" element={
            <ProtectedRoute roles={['RESIDENT']}>
              <CreatePassPage />
            </ProtectedRoute>
          } />
          <Route path="/resident/passes" element={
            <ProtectedRoute roles={['RESIDENT']}>
              <MyPassesPage />
            </ProtectedRoute>
          } />
          <Route path="/resident/entries" element={
            <ProtectedRoute roles={['RESIDENT']}>
              <ResidentEntriesPage />
            </ProtectedRoute>
          } />

          {/* GUARD */}
          <Route path="/guard" element={
            <ProtectedRoute roles={['GUARD']}>
              <GuardDashboard />
            </ProtectedRoute>
          } />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display-1 text-danger">403</h1>
                <h4>Unauthorized</h4>
                <a href="/login" className="btn btn-primary mt-3">Go to Login</a>
              </div>
            </div>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display-1 text-muted">404</h1>
                <h4>Page Not Found</h4>
                <a href="/login" className="btn btn-primary mt-3">Go to Login</a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

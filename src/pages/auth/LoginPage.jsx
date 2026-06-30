import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import logoMark from '../../assets/logo.png'

export default function LoginPage() {
  const { loginUser } = useAuth()
  const { showToast } = useToast()
  const navigate      = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [loginOk, setLoginOk] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showToast('Please enter email and password.', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await login(form)
      setLoginOk(true)          // ← allow browser save popup on success
      loginUser(res.data)
      showToast(`Welcome back, ${res.data.name}!`, 'success')
      const role = res.data.role
      if (role === 'SUPER_ADMIN')        navigate('/super-admin')
      else if (role === 'SOCIETY_ADMIN') navigate('/admin')
      else if (role === 'RESIDENT')      navigate('/resident')
      else if (role === 'GUARD')         navigate('/guard')
    } catch (err) {
      setLoginOk(false)
      showToast(
        err.response?.data?.message || 'Login failed. Check credentials.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  // Support Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4" style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-block">
            <img src={logoMark} alt="Pravesh" style={{ width: 64, height: 'auto' }} />
          </Link>
          <h3 className="fw-bold mt-2">Pravesh</h3>
          <p className="text-muted small">Society Visitor Management</p>
        </div>

        {/* Visible inputs — NOT inside a form tag */}
        <div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            type="button"
            className="btn btn-pravesh w-100 py-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm me-2"></span>
              : <i className="bi bi-box-arrow-in-right me-2"></i>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-center text-muted small mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none">Register</Link>
        </p>
      </div>
    </div>
  )
}
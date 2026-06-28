import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import logoMark from '../../assets/logo.png'

export default function LoginPage() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data)
      const role = res.data.role
      if (role === 'SUPER_ADMIN')   navigate('/super-admin')
      else if (role === 'SOCIETY_ADMIN') navigate('/admin')
      else if (role === 'RESIDENT') navigate('/resident')
      else if (role === 'GUARD')    navigate('/guard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
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

        {error && (
          <div className="alert alert-danger py-2 small">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
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
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-pravesh w-100 py-2"
            disabled={loading}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm me-2"></span>
              : <i className="bi bi-box-arrow-in-right me-2"></i>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-muted small mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none">Register</Link>
        </p>
      </div>
    </div>
  )
}

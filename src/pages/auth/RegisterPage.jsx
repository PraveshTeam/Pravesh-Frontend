import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import logoMark from '../../assets/logo.png'

const ROLES = ['RESIDENT', 'GUARD', 'SOCIETY_ADMIN', 'SUPER_ADMIN']

export default function RegisterPage() {
  const { loginUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '', role: 'RESIDENT' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data)
      showToast(`Account created! Welcome, ${res.data.name}!`, 'success')
      const role = res.data.role
      if (role === 'SUPER_ADMIN')        navigate('/super-admin')
      else if (role === 'SOCIETY_ADMIN') navigate('/admin')
      else if (role === 'RESIDENT')      navigate('/resident')
      else if (role === 'GUARD')         navigate('/guard')
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="card p-4" style={{ width: '100%', maxWidth: 460 }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-block">
            <img src={logoMark} alt="Pravesh" style={{ width: 56, height: 'auto' }} />
          </Link>
          <h4 className="fw-bold mt-2">Create Account</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input className="form-control" placeholder="Varad Patil"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" placeholder="varad@pravesh.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input className="form-control" placeholder="9876543210"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Role</label>
            <select className="form-select" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-pravesh w-100 py-2" disabled={loading}>
            {loading
              ? <span className="spinner-border spinner-border-sm me-2"></span>
              : <i className="bi bi-person-check me-2"></i>}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted small mt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">Login</Link>
        </p>
      </div>
    </div>
  )
}
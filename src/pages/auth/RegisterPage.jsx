import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { INDIAN_STATES } from '../../utils/indianStates'
import PasswordInput from '../../components/common/PasswordInput'
import logoMark from '../../assets/logo.png'

export default function RegisterPage() {
  const { loginUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', state: '',
    claimedFlatNumber: '', role: 'RESIDENT'
  })
  const [loading, setLoading] = useState(false)

  const strength = (pw) => {
    if (!pw) return null
    if (pw.length < 8) return { label: 'Too short (min 8 characters)', cls: 'bg-danger', pct: 33 }
    if (pw.length < 12) return { label: 'Good', cls: 'bg-warning', pct: 66 }
    return { label: 'Strong', cls: 'bg-success', pct: 100 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.state) { showToast('Please select your state.', 'warning'); return }
    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data.data)
      showToast(`Account created! Welcome, ${res.data.data.name}!`, 'success')
      navigate('/access-pending')
    } catch (err) {
      const data = err.response?.data
      const msg = data?.errors ? Object.values(data.errors).flat()[0] : (data?.message || 'Registration failed.')
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = strength(form.password)

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="card auth-card p-4" style={{ width: '100%', maxWidth: 480 }}>
        <div className="text-center mb-4">
          <Link to="/"><img src={logoMark} alt="Pravesh" style={{ width: 56 }} /></Link>
          <h4 className="fw-bold mt-2">Create Account</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">I am a</label>
            <select className="form-select" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="RESIDENT">Resident</option>
              <option value="SOCIETY_ADMIN">Society Admin (registering a new society)</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input className="form-control" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input className="form-control" placeholder="9876543210" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <PasswordInput
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              required
            />
            {pwStrength && (
              <div className="mt-1">
                <div className="progress" style={{ height: 4 }}>
                  <div className={`progress-bar ${pwStrength.cls}`} style={{ width: `${pwStrength.pct}%` }}></div>
                </div>
                <small className="text-muted">{pwStrength.label}</small>
              </div>
            )}
            {form.password && (
              <div className="mt-1">
                <div className="progress" style={{ height: 4 }}>
                  <div
                    className={`progress-bar ${form.password.length < 8 ? 'bg-danger' :
                        form.password.length < 12 ? 'bg-warning' : 'bg-success'
                      }`}
                    style={{ width: `${Math.min(form.password.length * 8, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {form.password.length < 8 ? 'Too short (min 8 characters)' :
                    form.password.length < 12 ? 'Good' : 'Strong'}
                </small>
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">State</label>
            <select className="form-select" value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })} required>
              <option value="">Select your state</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {form.role === 'RESIDENT' && (
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Claimed Flat Number <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input className="form-control" placeholder="A-101" value={form.claimedFlatNumber}
                onChange={e => setForm({ ...form, claimedFlatNumber: e.target.value })} />
              <div className="form-text">You'll submit proof of residency after registering.</div>
            </div>
          )}

          <button type="submit" className="btn btn-pravesh w-100 py-2" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span>
              : <i className="bi bi-person-check me-2"></i>}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted small mt-3">
          Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
        </p>
      </div>
    </div>
  )
}
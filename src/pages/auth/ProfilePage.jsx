import { useState, useEffect } from 'react'
import { getMe, updateMe } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function ProfilePage() {
  const { user, loginUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm]       = useState({ name: '', phone: '' })
  const [msg, setMsg]         = useState('')
  const [error, setError]     = useState('')

  useEffect(() => {
    getMe().then(res => {
      setProfile(res.data)
      setForm({ name: res.data.name, phone: res.data.phone || '' })
    })
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await updateMe(form)
      setMsg('Profile updated successfully!')
      // Update local storage name
      const updated = { ...user, name: form.name }
      loginUser({ ...updated, token: localStorage.getItem('token') })
    } catch {
      setError('Update failed.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 500 }}>
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-person-circle me-2"></i>My Profile</h4>
        </div>

        {profile && (
          <div className="card p-4">
            <div className="mb-3 text-center">
              <span className="badge bg-primary fs-6">{profile.role}</span>
              {profile.flatId && <p className="text-muted small mt-1">Flat ID: {profile.flatId}</p>}
              {profile.societyId && <p className="text-muted small">Society ID: {profile.societyId}</p>}
            </div>

            {msg   && <div className="alert alert-success py-2 small">{msg}</div>}
            {error && <div className="alert alert-danger  py-2 small">{error}</div>}

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input className="form-control" value={profile.email} disabled />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-pravesh w-100">
                <i className="bi bi-save me-2"></i>Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

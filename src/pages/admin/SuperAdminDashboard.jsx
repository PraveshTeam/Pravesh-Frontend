import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createSociety, assignSocietyAdmin } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [societyForm, setSocietyForm] = useState({ name: '', address: '', city: '' })
  const [adminForm, setAdminForm]     = useState({ societyId: '', userId: '' })
  const [societyMsg, setSocietyMsg]   = useState('')
  const [adminMsg, setAdminMsg]       = useState('')
  const [societyErr, setSocietyErr]   = useState('')
  const [adminErr, setAdminErr]       = useState('')

  const handleCreateSociety = async (e) => {
    e.preventDefault()
    setSocietyMsg(''); setSocietyErr('')
    try {
      const res = await createSociety(societyForm)
      setSocietyMsg(`Society "${res.data.name}" created with ID: ${res.data.id}`)
      setSocietyForm({ name: '', address: '', city: '' })
    } catch (err) {
      setSocietyErr(err.response?.data?.message || 'Failed.')
    }
  }

  const handleAssignAdmin = async (e) => {
    e.preventDefault()
    setAdminMsg(''); setAdminErr('')
    try {
      const res = await assignSocietyAdmin(adminForm.societyId, { userId: parseInt(adminForm.userId) })
      setAdminMsg(res.data.message)
      setAdminForm({ societyId: '', userId: '' })
    } catch (err) {
      setAdminErr(err.response?.data?.message || 'Failed.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-1"><i className="bi bi-shield-fill-check me-2"></i>Super Admin Dashboard</h4>
          <p className="mb-0 opacity-75">Welcome, {user?.name}</p>
        </div>

        <div className="row g-4">
          {/* Create Society */}
          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-building-add me-2 text-primary"></i>Create New Society</h6>

              {societyMsg && <div className="alert alert-success py-2 small">{societyMsg}</div>}
              {societyErr && <div className="alert alert-danger  py-2 small">{societyErr}</div>}

              <form onSubmit={handleCreateSociety}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Society Name *</label>
                  <input className="form-control" placeholder="Green Valley Society"
                    value={societyForm.name}
                    onChange={e => setSocietyForm({ ...societyForm, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <input className="form-control" placeholder="Plot 12, Sector 5"
                    value={societyForm.address}
                    onChange={e => setSocietyForm({ ...societyForm, address: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">City</label>
                  <input className="form-control" placeholder="Pune"
                    value={societyForm.city}
                    onChange={e => setSocietyForm({ ...societyForm, city: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-pravesh w-100">
                  <i className="bi bi-building-add me-2"></i>Create Society
                </button>
              </form>
            </div>
          </div>

          {/* Assign Society Admin */}
          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-person-gear me-2 text-success"></i>Assign Society Admin</h6>

              {adminMsg && <div className="alert alert-success py-2 small">{adminMsg}</div>}
              {adminErr && <div className="alert alert-danger  py-2 small">{adminErr}</div>}

              <form onSubmit={handleAssignAdmin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Society ID *</label>
                  <input type="number" className="form-control" placeholder="e.g. 1"
                    value={adminForm.societyId}
                    onChange={e => setAdminForm({ ...adminForm, societyId: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">User ID (SOCIETY_ADMIN) *</label>
                  <input type="number" className="form-control" placeholder="e.g. 2"
                    value={adminForm.userId}
                    onChange={e => setAdminForm({ ...adminForm, userId: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-person-check me-2"></i>Assign Admin
                </button>
              </form>

              <hr />
              <p className="text-muted small mb-2">Flow:</p>
              <ol className="small text-muted">
                <li>Create a society above</li>
                <li>Register a SOCIETY_ADMIN via <Link to="/register">Register</Link></li>
                <li>Assign that user as admin here</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

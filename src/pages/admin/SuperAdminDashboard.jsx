import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createSociety, assignSocietyAdmin } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [societyForm, setSocietyForm] = useState({ name: '', address: '', city: '' })
  const [adminForm, setAdminForm]     = useState({ societyId: '', userId: '' })

  const handleCreateSociety = async (e) => {
    e.preventDefault()
    try {
      const res = await createSociety(societyForm)
      showToast(`Society "${res.data.name}" created! ID: ${res.data.id}`, 'success')
      setSocietyForm({ name: '', address: '', city: '' })
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create society.', 'error')
    }
  }

  const handleAssignAdmin = async (e) => {
    e.preventDefault()
    try {
      const res = await assignSocietyAdmin(adminForm.societyId, { userId: parseInt(adminForm.userId) })
      showToast(res.data.message, 'success')
      setAdminForm({ societyId: '', userId: '' })
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign admin.', 'error')
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
          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-building-add me-2 text-primary"></i>Create New Society</h6>
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

          <div className="col-md-6">
            <div className="card p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-person-gear me-2 text-success"></i>Assign Society Admin</h6>
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
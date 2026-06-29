import { useState, useEffect } from 'react'
import { getGates, addGate, assignGuard } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'

export default function AdminGatesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [gates, setGates]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ name: '', location: '' })
  const [assignForm, setAssignForm] = useState({ gateId: '', guardId: '' })

  const load = () => {
    setLoading(true)
    getGates(user?.societyId).then(res => setGates(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAddGate = async (e) => {
    e.preventDefault()
    try {
      const res = await addGate(user.societyId, form)
      showToast(`Gate "${res.data.name}" added successfully!`, 'success')
      setForm({ name: '', location: '' })
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      const res = await assignGuard(assignForm.gateId, { guardId: parseInt(assignForm.guardId) })
      showToast(res.data.message, 'success')
      setAssignForm({ gateId: '', guardId: '' })
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-building-lock me-2"></i>Manage Gates</h4>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card p-3">
              <h6 className="fw-bold mb-3"><i className="bi bi-plus-circle me-2 text-warning"></i>Add New Gate</h6>
              <form onSubmit={handleAddGate}>
                <div className="mb-2">
                  <input className="form-control" placeholder="Gate Name (e.g. Main Gate) *"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <input className="form-control" placeholder="Location (e.g. North Entrance)"
                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-warning w-100">Add Gate</button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3">
              <h6 className="fw-bold mb-3"><i className="bi bi-person-badge me-2 text-success"></i>Assign Guard to Gate</h6>
              <form onSubmit={handleAssign}>
                <div className="mb-2">
                  <select className="form-select" value={assignForm.gateId}
                    onChange={e => setAssignForm({ ...assignForm, gateId: e.target.value })} required>
                    <option value="">Select Gate</option>
                    {gates.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} {g.assignedGuardName ? `— ${g.assignedGuardName}` : '— No Guard'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <input type="number" className="form-control" placeholder="Guard User ID"
                    value={assignForm.guardId}
                    onChange={e => setAssignForm({ ...assignForm, guardId: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-success w-100">Assign</button>
              </form>
            </div>
          </div>
        </div>

        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : (
            <div className="card p-0 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Gate Name</th><th>Location</th><th>Assigned Guard</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {gates.map(g => (
                    <tr key={g.id}>
                      <td className="text-muted">{g.id}</td>
                      <td className="fw-semibold">{g.name}</td>
                      <td>{g.location || '—'}</td>
                      <td>{g.assignedGuardName
                        ? <span className="badge bg-success">{g.assignedGuardName}</span>
                        : <span className="badge bg-secondary">Unassigned</span>}
                      </td>
                      <td>
                        <span className={`badge ${g.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {g.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </>
  )
}
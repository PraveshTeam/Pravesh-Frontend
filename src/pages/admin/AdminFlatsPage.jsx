import { useState, useEffect } from 'react'
import { getFlats, addFlat, assignResident } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function AdminFlatsPage() {
  const { user } = useAuth()
  const [flats, setFlats]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ flatNumber: '', tower: '', floor: '' })
  const [assignForm, setAssignForm] = useState({ flatId: '', residentId: '' })
  const [msg, setMsg]   = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getFlats(user?.societyId)
      .then(res => setFlats(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAddFlat = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await addFlat(user.societyId, { ...form, floor: parseInt(form.floor) || null })
      setMsg('Flat added successfully!')
      setForm({ flatNumber: '', tower: '', floor: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add flat.')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      const res = await assignResident(assignForm.flatId, { residentId: parseInt(assignForm.residentId) })
      setMsg(res.data.message)
      setAssignForm({ flatId: '', residentId: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-door-open me-2"></i>Manage Flats</h4>
        </div>

        {msg   && <div className="alert alert-success py-2 small">{msg}</div>}
        {error && <div className="alert alert-danger  py-2 small">{error}</div>}

        <div className="row g-4 mb-4">
          {/* Add Flat */}
          <div className="col-md-6">
            <div className="card p-3">
              <h6 className="fw-bold mb-3"><i className="bi bi-plus-circle me-2 text-success"></i>Add New Flat</h6>
              <form onSubmit={handleAddFlat}>
                <div className="mb-2">
                  <input className="form-control" placeholder="Flat Number (e.g. A-101) *"
                    value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <input className="form-control" placeholder="Tower (e.g. A)"
                    value={form.tower} onChange={e => setForm({ ...form, tower: e.target.value })} />
                </div>
                <div className="mb-3">
                  <input type="number" className="form-control" placeholder="Floor"
                    value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-success w-100">Add Flat</button>
              </form>
            </div>
          </div>

          {/* Assign Resident */}
          <div className="col-md-6">
            <div className="card p-3">
              <h6 className="fw-bold mb-3"><i className="bi bi-person-check me-2 text-primary"></i>Assign Resident to Flat</h6>
              <form onSubmit={handleAssign}>
                <div className="mb-2">
                  <select className="form-select" value={assignForm.flatId}
                    onChange={e => setAssignForm({ ...assignForm, flatId: e.target.value })} required>
                    <option value="">Select Flat</option>
                    {flats.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.flatNumber} {f.tower ? `(Tower ${f.tower})` : ''} {f.residentName ? `— ${f.residentName}` : '— Vacant'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <input type="number" className="form-control" placeholder="Resident User ID"
                    value={assignForm.residentId}
                    onChange={e => setAssignForm({ ...assignForm, residentId: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Assign</button>
              </form>
            </div>
          </div>
        </div>

        {/* Flats Table */}
        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : (
            <div className="card p-0 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Flat No.</th><th>Tower</th><th>Floor</th><th>Resident</th></tr>
                </thead>
                <tbody>
                  {flats.map(f => (
                    <tr key={f.id}>
                      <td className="text-muted">{f.id}</td>
                      <td className="fw-semibold">{f.flatNumber}</td>
                      <td>{f.tower || '—'}</td>
                      <td>{f.floor ?? '—'}</td>
                      <td>
                        {f.residentName
                          ? <span className="badge bg-success">{f.residentName}</span>
                          : <span className="badge bg-secondary">Vacant</span>}
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

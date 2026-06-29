import { useState, useEffect } from 'react'
import { getAllUsers, toggleUserStatus, assignUserToSociety } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [assignId, setAssignId] = useState('')

  const load = () => {
    setLoading(true)
    getAllUsers(user?.societyId).then(res => setUsers(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id, name, current) => {
    try {
      await toggleUserStatus(id, !current)
      showToast(`${name} has been ${!current ? 'activated' : 'deactivated'}.`, !current ? 'success' : 'warning')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      const res = await assignUserToSociety(user.societyId, { userId: parseInt(assignId) })
      showToast(res.data.message, 'success')
      setAssignId('')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed.', 'error')
    }
  }

  const roleBadge = (role) => {
    const map = { RESIDENT: 'primary', GUARD: 'warning', SOCIETY_ADMIN: 'success', SUPER_ADMIN: 'danger' }
    return <span className={`badge bg-${map[role] || 'secondary'}`}>{role}</span>
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-people me-2"></i>Manage Users</h4>
        </div>

        <div className="card p-3 mb-4">
          <h6 className="fw-bold mb-3"><i className="bi bi-person-plus me-2 text-primary"></i>Add User to Society</h6>
          <form onSubmit={handleAssign} className="d-flex gap-2">
            <input type="number" className="form-control" placeholder="Enter User ID"
              value={assignId} onChange={e => setAssignId(e.target.value)} required />
            <button type="submit" className="btn btn-pravesh px-4">Assign</button>
          </form>
        </div>

        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : (
            <div className="card p-0 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Flat</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="text-muted">{u.id}</td>
                      <td className="fw-semibold">{u.name}</td>
                      <td className="small">{u.email}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td>{u.flatId || '—'}</td>
                      <td>
                        <span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleToggle(u.id, u.name, u.isActive)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
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
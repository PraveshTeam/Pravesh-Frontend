import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getActivePasses, getFlatEntries } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function ResidentDashboard() {
  const { user } = useAuth()
  const [passes, setPasses]   = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    getActivePasses().then(res => setPasses(res.data)).catch(() => {})
    if (user?.flatId) {
      getFlatEntries(user.flatId).then(res => setEntries(res.data.slice(0, 5))).catch(() => {})
    }
  }, [user])

  const statusBadge = (s) => {
    const map = { ACTIVE: 'primary', CONSUMED: 'secondary', REVOKED: 'danger', EXPIRED: 'warning' }
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1"><i className="bi bi-house-door me-2"></i>Resident Dashboard</h4>
            <p className="mb-0 opacity-75">Welcome, {user?.name}</p>
          </div>
          <Link to="/resident/create-pass" className="btn btn-warning fw-semibold">
            <i className="bi bi-plus-circle me-2"></i>New Pass
          </Link>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-3 text-center border-start border-primary border-4">
              <h2 className="fw-bold text-primary">{passes.length}</h2>
              <p className="text-muted mb-0">Active Passes</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 text-center border-start border-success border-4">
              <h2 className="fw-bold text-success">{entries.filter(e => e.scanResult === 'GRANTED').length}</h2>
              <p className="text-muted mb-0">Entries Granted</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 text-center border-start border-danger border-4">
              <h2 className="fw-bold text-danger">{entries.filter(e => e.scanResult === 'DENIED').length}</h2>
              <p className="text-muted mb-0">Entries Denied</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Active Passes */}
          <div className="col-lg-6">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-ticket-perforated me-2 text-primary"></i>Active Passes</h6>
                <Link to="/resident/passes" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              {passes.length === 0
                ? <p className="text-muted text-center py-3">No active passes</p>
                : passes.slice(0, 3).map(p => (
                  <div key={p.id} className="border rounded p-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">{p.visitorName}</span>
                      {statusBadge(p.status)}
                    </div>
                    <small className="text-muted">{p.passType} · Until {new Date(p.validUntil).toLocaleDateString('en-IN')}</small>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Recent Entries */}
          <div className="col-lg-6">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-clock-history me-2 text-success"></i>Recent Entries</h6>
                <Link to="/resident/entries" className="btn btn-sm btn-outline-success">View All</Link>
              </div>
              {entries.length === 0
                ? <p className="text-muted text-center py-3">No entry records</p>
                : entries.map(e => (
                  <div key={e.id} className="border rounded p-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">{e.visitorName}</span>
                      <span className={`badge ${e.scanResult === 'GRANTED' ? 'bg-success' : 'bg-danger'}`}>
                        {e.scanResult}
                      </span>
                    </div>
                    <small className="text-muted">{e.gateName} · {new Date(e.scannedAt).toLocaleString('en-IN')}</small>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { getAllEntries } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function AdminEntriesPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    getAllEntries(user?.societyId)
      .then(res => setEntries(res.data))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.scanResult === filter)

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-list-check me-2"></i>All Entry Logs</h4>
        </div>

        <div className="mb-3">
          {['ALL', 'GRANTED', 'DENIED'].map(f => (
            <button
              key={f}
              className={`btn btn-sm me-2 ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(f)}
            >
              {f} {f !== 'ALL' && `(${entries.filter(e => e.scanResult === f).length})`}
            </button>
          ))}
          <span className="text-muted small ms-2">Total: {filtered.length}</span>
        </div>

        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : filtered.length === 0
            ? <div className="card p-5 text-center text-muted">No entries found</div>
            : (
              <div className="card p-0 overflow-hidden">
                <table className="table table-hover table-sm mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th><th>Visitor</th><th>Flat</th><th>Gate</th>
                      <th>Guard</th><th>Result</th><th>Reason</th><th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e, i) => (
                      <tr key={e.id}>
                        <td className="text-muted small">{i + 1}</td>
                        <td className="fw-semibold">{e.visitorName}</td>
                        <td>{e.flatNumber}</td>
                        <td>{e.gateName || '—'}</td>
                        <td>{e.guardName || '—'}</td>
                        <td>
                          <span className={`badge ${e.scanResult === 'GRANTED' ? 'bg-success' : 'bg-danger'}`}>
                            {e.scanResult}
                          </span>
                        </td>
                        <td><small className="text-muted">{e.denyReason || '—'}</small></td>
                        <td><small>{new Date(e.scannedAt).toLocaleString('en-IN')}</small></td>
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

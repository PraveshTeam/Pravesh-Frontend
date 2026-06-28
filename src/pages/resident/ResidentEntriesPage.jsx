import { useState, useEffect } from 'react'
import { getFlatEntries } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function ResidentEntriesPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.flatId) {
      getFlatEntries(user.flatId)
        .then(res => setEntries(res.data))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-clock-history me-2"></i>Entry History — My Flat</h4>
        </div>

        {!user?.flatId && (
          <div className="alert alert-warning">You are not assigned to any flat yet.</div>
        )}

        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : entries.length === 0
            ? <div className="card p-5 text-center text-muted">No entry records found</div>
            : (
              <div className="card p-0 overflow-hidden">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Visitor</th>
                      <th>Gate</th>
                      <th>Guard</th>
                      <th>Result</th>
                      <th>Reason</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, i) => (
                      <tr key={e.id}>
                        <td className="text-muted small">{i + 1}</td>
                        <td className="fw-semibold">{e.visitorName}</td>
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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers, getAllEntries, getFlats, getGates } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ users: 0, flats: 0, gates: 0, entries: 0 })
  const [recentEntries, setRecentEntries] = useState([])

  useEffect(() => {
    const sid = user?.societyId
    if (!sid) return

    Promise.all([
      getAllUsers(sid),
      getFlats(sid),
      getGates(sid),
      getAllEntries(sid)
    ]).then(([u, f, g, e]) => {
      setStats({
        users:   u.data.length,
        flats:   f.data.length,
        gates:   g.data.length,
        entries: e.data.length
      })
      setRecentEntries(e.data.slice(0, 5))
    }).catch(() => {})
  }, [user])

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1"><i className="bi bi-building me-2"></i>Admin Dashboard</h4>
            <p className="mb-0 opacity-75">Society ID: {user?.societyId}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Users',   value: stats.users,   icon: 'people',          color: 'primary' },
            { label: 'Flats',   value: stats.flats,   icon: 'door-open',       color: 'success' },
            { label: 'Gates',   value: stats.gates,   icon: 'building-lock',   color: 'warning' },
            { label: 'Entries', value: stats.entries, icon: 'arrow-bar-right', color: 'info'    },
          ].map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div className={`card p-3 text-center border-start border-${s.color} border-4`}>
                <i className={`bi bi-${s.icon} text-${s.color} fs-3`}></i>
                <h3 className={`fw-bold text-${s.color} mb-0`}>{s.value}</h3>
                <p className="text-muted mb-0 small">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Manage Users', icon: 'people',       to: '/admin/users',   color: 'primary'   },
            { label: 'Manage Flats', icon: 'door-open',    to: '/admin/flats',   color: 'success'   },
            { label: 'Manage Gates', icon: 'building-lock',to: '/admin/gates',   color: 'warning'   },
            { label: 'View Entries', icon: 'list-check',   to: '/admin/entries', color: 'info'      },
          ].map(a => (
            <div key={a.label} className="col-6 col-md-3">
              <Link to={a.to} className={`card p-3 text-center text-decoration-none border border-${a.color}`}>
                <i className={`bi bi-${a.icon} text-${a.color} fs-2`}></i>
                <p className={`text-${a.color} fw-semibold mb-0 mt-1 small`}>{a.label}</p>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Entries */}
        <div className="card p-3">
          <h6 className="fw-bold mb-3"><i className="bi bi-clock-history me-2"></i>Recent Entries</h6>
          {recentEntries.length === 0
            ? <p className="text-muted text-center py-3">No entries yet</p>
            : (
              <table className="table table-sm table-hover mb-0">
                <thead className="table-light">
                  <tr><th>Visitor</th><th>Flat</th><th>Gate</th><th>Result</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {recentEntries.map(e => (
                    <tr key={e.id}>
                      <td>{e.visitorName}</td>
                      <td>{e.flatNumber}</td>
                      <td>{e.gateName || '—'}</td>
                      <td>
                        <span className={`badge ${e.scanResult === 'GRANTED' ? 'bg-success' : 'bg-danger'}`}>
                          {e.scanResult}
                        </span>
                      </td>
                      <td><small>{new Date(e.scannedAt).toLocaleString('en-IN')}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </>
  )
}

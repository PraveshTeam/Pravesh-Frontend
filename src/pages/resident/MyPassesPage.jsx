import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPassHistory, revokePass } from '../../api/endpoints'
import Navbar from '../../components/common/Navbar'

export default function MyPassesPage() {
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  const load = () => {
    setLoading(true)
    getPassHistory()
      .then(res => setPasses(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRevoke = async (id) => {
    if (!confirm('Revoke this pass?')) return
    try {
      await revokePass(id)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to revoke.')
    }
  }

  const statusBadge = (s) => {
    const map = { ACTIVE: 'primary', CONSUMED: 'secondary', REVOKED: 'danger', EXPIRED: 'warning' }
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>
  }

  const filtered = filter === 'ALL' ? passes : passes.filter(p => p.status === filter)

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0"><i className="bi bi-ticket-perforated me-2"></i>My Visitor Passes</h4>
          <Link to="/resident/create-pass" className="btn btn-warning">
            <i className="bi bi-plus me-1"></i>New Pass
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mb-3">
          {['ALL','ACTIVE','CONSUMED','REVOKED','EXPIRED'].map(f => (
            <button
              key={f}
              className={`btn btn-sm me-2 mb-2 ${filter === f ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading
          ? <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
          : filtered.length === 0
            ? <div className="card p-5 text-center text-muted">No passes found</div>
            : (
              <div className="row g-3">
                {filtered.map(p => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card p-3 h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-0">{p.visitorName}</h6>
                          <small className="text-muted">{p.visitorPhone || 'No phone'}</small>
                        </div>
                        {statusBadge(p.status)}
                      </div>

                      <div className="small text-muted mb-2">
                        <div><i className="bi bi-tag me-1"></i>{p.passType}</div>
                        <div><i className="bi bi-arrow-repeat me-1"></i>{p.usesRemaining}/{p.usesAllowed} uses left</div>
                        <div><i className="bi bi-calendar me-1"></i>{new Date(p.validFrom).toLocaleString('en-IN')}</div>
                        <div><i className="bi bi-calendar-x me-1"></i>{new Date(p.validUntil).toLocaleString('en-IN')}</div>
                      </div>

                      <div className="mt-auto">
                        <div className="bg-light rounded p-2 mb-2">
                          <small className="text-break text-muted" style={{ fontSize: '0.7rem' }}>
                            <i className="bi bi-qr-code me-1"></i><strong>UUID:</strong> {p.uuid}
                          </small>
                        </div>
                        {p.status === 'ACTIVE' && (
                          <button
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => handleRevoke(p.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </div>
    </>
  )
}

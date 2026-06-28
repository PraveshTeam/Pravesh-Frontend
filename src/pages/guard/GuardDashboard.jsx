import { useState, useEffect } from 'react'
import { confirmEntry, getMyEntries } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'

export default function GuardDashboard() {
  const { user } = useAuth()
  const [uuid, setUuid]       = useState('')
  const [result, setResult]   = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  const loadEntries = () => {
    getMyEntries().then(res => setEntries(res.data)).catch(() => {})
  }

  useEffect(() => { loadEntries() }, [])

  const handleConfirm = async (e) => {
    e.preventDefault()
    setResult(null)
    setLoading(true)
    try {
      const res = await confirmEntry({ uuid })
      setResult(res.data)
      setUuid('')
      loadEntries()
    } catch (err) {
      setResult({ result: 'ERROR', message: err.response?.data?.message || 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header">
          <h4 className="mb-1"><i className="bi bi-shield-check me-2"></i>Guard Dashboard</h4>
          <p className="mb-0 opacity-75">Welcome, {user?.name}</p>
        </div>

        <div className="row g-4">
          {/* Confirm Entry */}
          <div className="col-lg-5">
            <div className="card p-4">
              <h6 className="fw-bold mb-3"><i className="bi bi-qr-code-scan me-2 text-primary"></i>Confirm Visitor Entry</h6>

              <form onSubmit={handleConfirm}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Visitor Pass UUID</label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="Paste UUID here..."
                    value={uuid}
                    onChange={e => setUuid(e.target.value)}
                    required
                  />
                  <small className="text-muted">Visitor will share this UUID for entry</small>
                </div>
                <button
                  type="submit"
                  className="btn btn-pravesh w-100 py-2"
                  disabled={loading}
                >
                  {loading
                    ? <span className="spinner-border spinner-border-sm me-2"></span>
                    : <i className="bi bi-check-circle me-2"></i>}
                  {loading ? 'Checking...' : 'Confirm Entry'}
                </button>
              </form>

              {/* Result */}
              {result && (
                <div className={`alert mt-3 ${result.result === 'GRANTED' ? 'alert-success' : 'alert-danger'}`}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className={`bi ${result.result === 'GRANTED' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} fs-4`}></i>
                    <strong className="fs-5">{result.result}</strong>
                  </div>
                  {result.visitorName && <div>Visitor: <strong>{result.visitorName}</strong></div>}
                  {result.flatNumber  && <div>Flat: <strong>{result.flatNumber}</strong></div>}
                  {result.gate        && <div>Gate: <strong>{result.gate}</strong></div>}
                  {result.reason      && <div>Reason: <strong>{result.reason}</strong></div>}
                  {result.message     && <div>{result.message}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Today's Entries */}
          <div className="col-lg-7">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-list-check me-2 text-success"></i>Today's Entries</h6>
                <button className="btn btn-sm btn-outline-secondary" onClick={loadEntries}>
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>

              {entries.length === 0
                ? <p className="text-muted text-center py-4">No entries today</p>
                : (
                  <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                    {entries.map(e => (
                      <div key={e.id} className="border rounded p-2 mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{e.visitorName}</span>
                          <span className={`badge ${e.scanResult === 'GRANTED' ? 'bg-success' : 'bg-danger'}`}>
                            {e.scanResult}
                          </span>
                        </div>
                        <small className="text-muted">
                          Flat: {e.flatNumber} · {e.gateName || 'Unknown Gate'} · {new Date(e.scannedAt).toLocaleTimeString('en-IN')}
                          {e.denyReason && <span className="text-danger ms-2">({e.denyReason})</span>}
                        </small>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

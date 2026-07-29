import { useState, useEffect } from 'react'
import {
  getOnboardingRequests, getOnboardingDocument,
  approveOnboardingRequest, rejectOnboardingRequest
} from '../../api/endpoints'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminOnboardingPage() {
  const { showToast } = useToast()
  const [requests, setRequests] = useState([])
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState(null)
  const [reason, setReason] = useState('')

  const [approvingId, setApprovingId] = useState(null)
  const [submittingRejectId, setSubmittingRejectId] = useState(null)
  const [viewingDocId, setViewingDocId] = useState(null)

  const load = () => {
    setLoading(true)
    getOnboardingRequests(statusFilter)
      .then(res => setRequests(res.data.data))
      .catch(() => showToast('Failed to load requests.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const viewDoc = async (id) => {
    setViewingDocId(id)
    try {
      const res = await getOnboardingDocument(id)
      window.open(URL.createObjectURL(res.data), '_blank')
    } catch {
      showToast('Failed to load document.', 'error')
    } finally {
      setViewingDocId(null)
    }
  }

  const approve = async (id) => {
    setApprovingId(id)
    try {
      await approveOnboardingRequest(id)
      showToast('Approved.', 'success')
      load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed.', 'error')
    } finally {
      setApprovingId(null)
    }
  }

  const reject = async (id) => {
    if (!reason.trim()) { showToast('Provide a rejection reason.', 'warning'); return }
    setSubmittingRejectId(id)
    try {
      await rejectOnboardingRequest(id, reason)
      showToast('Rejected.', 'success')
      setRejectingId(null); setReason(''); load()
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed.', 'error')
    } finally {
      setSubmittingRejectId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0"><i className="bi bi-person-check me-2"></i>Onboarding Requests</h4>
          <select className="form-select w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="card p-4">
          {loading ? <LoadingSpinner text="Loading requests..." /> : (
          <table className="table">
            <thead>
              <tr><th>Resident</th><th>Flat</th><th>Document</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td data-label="Resident">{r.userName}</td>
                  <td data-label="Flat">{r.claimedFlatNumber} {r.tower ? `(${r.tower})` : ''}</td>
                  <td data-label="Document">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => viewDoc(r.id)}
                      disabled={viewingDocId === r.id}
                    >
                      {viewingDocId === r.id
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <><i className="bi bi-file-earmark-text me-1"></i>View</>}
                    </button>
                  </td>
                  <td data-label="Status"><span className="badge bg-secondary">{r.status}</span></td>
                  <td data-label="Actions">
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => approve(r.id)}
                          disabled={approvingId === r.id || submittingRejectId === r.id}
                        >
                          {approvingId === r.id
                            ? <><span className="spinner-border spinner-border-sm me-1"></span>Approving...</>
                            : 'Approve'}
                        </button>
                        {rejectingId === r.id ? (
                          <div className="d-inline-flex gap-1">
                            <input className="form-control form-control-sm" placeholder="Reason"
                              value={reason} onChange={e => setReason(e.target.value)} style={{ width: 160 }}
                              disabled={submittingRejectId === r.id} />
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => reject(r.id)}
                              disabled={submittingRejectId === r.id}
                            >
                              {submittingRejectId === r.id
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : 'Confirm'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => { setRejectingId(null); setReason('') }}
                              disabled={submittingRejectId === r.id}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setRejectingId(r.id)}
                            disabled={approvingId === r.id}
                          >
                            Reject
                          </button>
                        )}
                      </>
                    )}
                    {r.status === 'REJECTED' && r.adminNotes && (
                      <span className="text-muted small">Reason: {r.adminNotes}</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-3">No requests found.</td></tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </>
  )
}
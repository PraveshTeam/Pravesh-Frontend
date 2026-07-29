import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getMyOnboardingRequest, getMySocietyRequest } from '../../api/endpoints'

export default function AccessPendingPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasRequest, setHasRequest] = useState(true)

  useEffect(() => {
    const call = user.role === 'RESIDENT' ? getMyOnboardingRequest : getMySocietyRequest
    call()
      .then(res => setRequest(res.data.data))
      .catch(() => setHasRequest(false))
      .finally(() => setLoading(false))
  }, [user.role])

  const submitPath = user.role === 'RESIDENT' ? '/onboarding/submit' : '/society-onboarding/submit'
  const handleLogout = () => { logout(); navigate('/login') }

  if (loading) {
    return (
      <LoadingSpinner fullPage text="Checking your status..." />
    )
  }

  const status = request?.status

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center auth-bg">
      <div className="card auth-card p-4" style={{ width: '100%', maxWidth: 520 }}>
        <div className="text-center mb-3">
          <i className="bi bi-hourglass-split text-warning float-soft" style={{ fontSize: '3rem' }}></i>
          <h4 className="fw-bold mt-3">Access Pending</h4>
        </div>

        {!hasRequest && (
          <>
            <div className="alert alert-warning">
              You haven't submitted a {user.role === 'RESIDENT' ? 'flat verification' : 'society registration'} request yet.
            </div>
            <button className="btn btn-pravesh w-100 py-2" onClick={() => navigate(submitPath)}>
              Submit Request
            </button>
          </>
        )}

        {hasRequest && status === 'PENDING' && (
          <div className="alert alert-info">
            <span className="badge bg-info mb-2">Under Review</span>
            <p className="mb-0">Your request is awaiting review. You'll be notified by email once decided.</p>
          </div>
        )}

        {hasRequest && status === 'REJECTED' && (
          <>
            <div className="alert alert-danger">
              <span className="badge bg-danger mb-2">Rejected</span>
              <p className="mb-0"><strong>Reason:</strong> {request.adminNotes || 'No reason provided.'}</p>
            </div>
            <button className="btn btn-pravesh w-100 py-2" onClick={() => navigate(submitPath)}>
              Resubmit Request
            </button>
          </>
        )}

        {hasRequest && status === 'APPROVED' && (
          <div className="alert alert-success">
            Approved! Please log out and log in again to access your dashboard.
          </div>
        )}

        <button className="btn btn-outline-secondary w-100 mt-3" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i>Logout
        </button>
      </div>
    </div>
  )
}

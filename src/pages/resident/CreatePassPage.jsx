import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createPass } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'

export default function CreatePassPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    visitorName: '', visitorPhone: '',
    passType: 'ONE_TIME', usesAllowed: 1,
    validFrom: '', validUntil: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createPass({ ...form, usesAllowed: parseInt(form.usesAllowed) })
      showToast(`Pass created for ${form.visitorName}! Email sent.`, 'success')
      navigate('/resident/passes')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create pass.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 550 }}>
        <div className="page-header">
          <h4 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Create Visitor Pass</h4>
        </div>

        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Visitor Name *</label>
              <input className="form-control" placeholder="Amit Shah"
                value={form.visitorName}
                onChange={e => setForm({ ...form, visitorName: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Visitor Phone</label>
              <input className="form-control" placeholder="9876543210"
                value={form.visitorPhone}
                onChange={e => setForm({ ...form, visitorPhone: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Pass Type *</label>
              <select className="form-select" value={form.passType}
                onChange={e => setForm({ ...form, passType: e.target.value })}>
                <option value="ONE_TIME">ONE_TIME — Single entry only</option>
                <option value="MULTI_USE">MULTI_USE — Multiple entries</option>
                <option value="RECURRING_DAILY">RECURRING_DAILY — Daily access</option>
              </select>
            </div>
            {form.passType === 'MULTI_USE' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Number of Uses *</label>
                <input type="number" className="form-control" min={2}
                  value={form.usesAllowed}
                  onChange={e => setForm({ ...form, usesAllowed: e.target.value })} required />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-semibold">Valid From *</label>
              <input type="datetime-local" className="form-control"
                value={form.validFrom}
                onChange={e => setForm({ ...form, validFrom: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Valid Until *</label>
              <input type="datetime-local" className="form-control"
                value={form.validUntil}
                onChange={e => setForm({ ...form, validUntil: e.target.value })} required />
            </div>
            <div className="d-flex gap-2">
              <Link to="/resident" className="btn btn-outline-secondary w-50">
                <i className="bi bi-arrow-left me-1"></i>Cancel
              </Link>
              <button type="submit" className="btn btn-pravesh w-50" disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm me-2"></span>
                  : <i className="bi bi-send me-2"></i>}
                {loading ? 'Creating...' : 'Create Pass'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
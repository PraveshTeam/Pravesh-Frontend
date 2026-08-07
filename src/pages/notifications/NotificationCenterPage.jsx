import { useState, useEffect } from 'react'
import { getMyNotifications, markNotificationsRead } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext'
import Navbar from '../../components/common/Navbar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import BackButton from '../../components/common/BackButton'

const TYPE_META = {
  VISITOR_ENTERED:    { icon: 'bi-door-open',          cls: 'notif-entry' },
  PASS_CREATED:       { icon: 'bi-ticket-perforated',  cls: 'notif-pass' },
  PASS_REVOKED:       { icon: 'bi-x-circle',           cls: 'notif-revoke' },
  OTP_REQUESTED:      { icon: 'bi-shield-lock',        cls: 'notif-otp' },
  GATE_REQUEST:       { icon: 'bi-person-walking',     cls: 'notif-gate' },
  RESIDENT_APPROVED:  { icon: 'bi-check-circle',       cls: 'notif-approved' },
  RESIDENT_REJECTED:  { icon: 'bi-x-octagon',          cls: 'notif-revoke' },
  SOCIETY_APPROVED:   { icon: 'bi-building-check',     cls: 'notif-approved' },
  SOCIETY_REJECTED:   { icon: 'bi-building-x',         cls: 'notif-revoke' },
}
const DEFAULT_META = { icon: 'bi-bell', cls: 'notif-default' }

const CHANNEL_ICON = { EMAIL: 'bi-envelope', SMS: 'bi-chat-dots', WEBSOCKET: 'bi-broadcast' }

export default function NotificationCenterPage() {
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const [filter, setFilter] = useState('ALL')

  const load = () => {
    setLoading(true)
    getMyNotifications()
      .then(res => setNotifications(res.data.data || []))
      .catch(() => showToast('Failed to load notifications.', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleMarkAll = async () => {
    setMarkingAll(true)
    try {
      await markNotificationsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      showToast('All notifications marked as read.', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update.', 'error')
    } finally {
      setMarkingAll(false)
    }
  }

  const handleMarkOne = async (n) => {
    if (n.isRead) return
    try {
      await markNotificationsRead(n.id)
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x))
    } catch {
      // silent — not critical if a single mark-as-read fails
    }
  }

  const timeAgo = (createdAt) => {
    const diffMs = Date.now() - new Date(createdAt).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(createdAt).toLocaleDateString('en-IN')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const visible = filter === 'UNREAD' ? notifications.filter(n => !n.isRead) : notifications

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <BackButton label="Back" />
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1"><i className="bi bi-bell me-2"></i>Notifications</h4>
            <p className="mb-0 opacity-75">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
            </p>
          </div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleMarkAll}
            disabled={markingAll || unreadCount === 0}
          >
            {markingAll
              ? <span className="spinner-border spinner-border-sm me-1"></span>
              : <i className="bi bi-check2-all me-1"></i>}
            Mark all read
          </button>
        </div>

        <ul className="nav nav-pills mb-3">
          {['ALL', 'UNREAD'].map(t => (
            <li className="nav-item" key={t}>
              <button className={`nav-link ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
                {t === 'ALL' ? 'All' : `Unread${unreadCount ? ` (${unreadCount})` : ''}`}
              </button>
            </li>
          ))}
        </ul>

        {loading ? <LoadingSpinner text="Loading notifications..." />
          : visible.length === 0
            ? (
              <div className="empty-state">
                <i className="bi bi-bell-slash"></i>
                <p className="mb-0">
                  {filter === 'UNREAD' ? 'No unread notifications.' : 'No notifications yet.'}
                </p>
              </div>
            )
            : (
              <div className="notif-list stagger-in">
                {visible.map(n => {
                  const meta = TYPE_META[n.type] || DEFAULT_META
                  return (
                    <button
                      key={n.id}
                      className={`notif-item ${meta.cls} ${!n.isRead ? 'notif-unread' : ''}`}
                      onClick={() => handleMarkOne(n)}
                    >
                      <span className="notif-icon"><i className={`bi ${meta.icon}`}></i></span>
                      <span className="notif-body">
                        <span className="notif-title">{n.title || n.type}</span>
                        <span className="notif-message">{n.message}</span>
                        <span className="notif-footer">
                          <span className="notif-time">{timeAgo(n.createdAt)}</span>
                          {Array.isArray(n.channel) && n.channel.map(c => (
                            <i key={c} className={`bi ${CHANNEL_ICON[c] || 'bi-broadcast'} notif-channel`} title={c}></i>
                          ))}
                        </span>
                      </span>
                      {!n.isRead && <span className="notif-dot"></span>}
                    </button>
                  )
                })}
              </div>
            )}
      </div>
    </>
  )
}
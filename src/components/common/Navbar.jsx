import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import fullLogo from '../../assets/full_logo.png'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const brandLink = () => {
    if (!user) return '/'
    switch (user.role) {
      case 'SUPER_ADMIN':    return '/super-admin'
      case 'SOCIETY_ADMIN':  return '/admin'
      case 'RESIDENT':       return '/resident'
      case 'GUARD':          return '/guard'
      default:               return '/'
    }
  }

  return (
    <nav className="navbar navbar-pravesh navbar-expand-lg px-4 py-2">
      <Link className="navbar-brand d-flex align-items-center" to={brandLink()}>
        <img src={fullLogo} alt="Pravesh — Visitor Access Control" className="navbar-full-logo" />
      </Link>

      {!user && (
        <div className="navbar-links d-none d-md-flex align-items-center gap-1 ms-4">
          <Link to="/" className="nav-link-pravesh">Home</Link>
          <Link to="/about" className="nav-link-pravesh">About</Link>
          <Link to="/contact" className="nav-link-pravesh">Contact</Link>
        </div>
      )}

      {user && (
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-white-50 small">
            <i className="bi bi-person-circle me-1"></i>
            {user.name}
            <span className="badge bg-warning text-dark ms-2">{user.role}</span>
          </span>
          <Link to="/profile" className="btn btn-outline-light btn-sm">
            <i className="bi bi-gear"></i>
          </Link>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      )}

      {!user && (
        <div className="ms-auto d-flex align-items-center gap-2">
          <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
          <Link to="/register" className="btn btn-pravesh btn-sm">Register</Link>
        </div>
      )}
    </nav>
  )
}
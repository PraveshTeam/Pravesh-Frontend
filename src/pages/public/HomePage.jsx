import { Link } from 'react-router-dom'
import fullLogo from '../../assets/full_logo.png'
import logoMark from '../../assets/logo.png'
import Navbar from '../../components/common/Navbar'
import './HomePage.css'

export default function HomePage() {
  const features = [
    {
      icon: 'bi-qr-code-scan',
      title: 'QR Gate Passes',
      text: 'Residents generate time-bound QR passes for visitors, delivery staff, or cabs — scanned and verified in seconds at the gate.',
    },
    {
      icon: 'bi-clock-history',
      title: 'Real-Time Entry Logs',
      text: 'Every scan is logged instantly with gate, time, and outcome — giving residents and admins a live, searchable history.',
    },
    {
      icon: 'bi-diagram-3',
      title: 'Role-Based Access',
      text: 'Super Admins, Society Admins, Guards, and Residents each get a dashboard built for exactly what they need to do.',
    },
  ]

  const roles = [
    { id: 1, name: 'Residents', desc: 'Create passes, track visitors, view entry history', icon: 'bi-house-heart' },
    { id: 2, name: 'Security Guards', desc: 'Scan passes and grant or deny entry at the gate', icon: 'bi-person-badge' },
    { id: 3, name: 'Society Admins', desc: 'Manage flats, gates, residents, and entry records', icon: 'bi-building' },
    { id: 4, name: 'Super Admins', desc: 'Oversee societies and platform-wide configuration', icon: 'bi-shield-lock' },
  ]

  const stats = [
    { num: '100%', label: 'Digital Passes' },
    { num: '4', label: 'Role Dashboards' },
    { num: '24/7', label: 'Gate Monitoring' },
    { num: '<5s', label: 'Scan Verification' },
  ]

  return (
    <>
      <Navbar />
      <div className="home-page">

        {/* Hero */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-badge">Intelligent Access Control</div>

          <img src={fullLogo} alt="Pravesh — Visitor Access Control" className="hero-full-logo" />

          <p className="hero-subtitle">
            Secure, paperless visitor management for gated communities — from QR pass creation
            to gate verification, all in one platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary-gold">Get Started</Link>
            <Link to="/about" className="btn-outline-gold">Learn More</Link>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-strip">
          {stats.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="py-4">
          <div className="text-center mb-2">
            <h2 className="section-title">Why <span>Pravesh</span>?</h2>
          </div>
          <div className="section-line"></div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 feature-card">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon"><i className={`bi ${f.icon}`}></i></div>
                    <h5 className="card-title">{f.title}</h5>
                    <p className="card-text">{f.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section className="py-5">
          <div className="text-center mb-2">
            <h2 className="section-title">Built For <span>Every Role</span></h2>
          </div>
          <div className="section-line"></div>
          <div className="row g-4">
            {roles.map(r => (
              <div key={r.id} className="col-md-3 col-sm-6">
                <div className="card h-100 category-card">
                  <div className="card-body text-center p-4">
                    <div className="category-icon"><i className={`bi ${r.icon}`}></i></div>
                    <h6 className="card-title">{r.name}</h6>
                    <p className="card-text">{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="home-cta">
          <img src={logoMark} alt="Pravesh shield mark" className="home-cta-mark" />
          <h3>Ready to secure your community?</h3>
          <p>Join Pravesh and bring every gate, guard, and visitor pass onto one trusted platform.</p>
          <Link to="/register" className="btn-primary-gold">Create an Account</Link>
        </section>

      </div>
    </>
  )
}

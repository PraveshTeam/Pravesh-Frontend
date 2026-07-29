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

  const steps = [
    { n: '01', icon: 'bi-pencil-square', title: 'Resident creates a pass', text: 'Enter visitor details and a validity window. A unique QR is generated instantly.' },
    { n: '02', icon: 'bi-send',          title: 'Share the QR',            text: 'Send it to your visitor over WhatsApp, SMS, or email — no app install needed.' },
    { n: '03', icon: 'bi-upc-scan',      title: 'Guard scans at the gate', text: 'The guard scans with the gate tablet. Validity, society, and usage are checked live.' },
    { n: '04', icon: 'bi-bell',          title: 'You get notified',        text: 'Entry is logged against your flat and you get an instant alert — granted or denied.' },
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

        {/* ── Hero: two-column ── */}
        <section className="hero-section">
          <div className="hero-bg"></div>

          <div className="hero-grid">
            {/* Left: copy + CTA */}
            <div className="hero-copy">
              <div className="hero-badge">Intelligent Access Control</div>

              <img src={fullLogo} alt="Pravesh — Visitor Access Control" className="hero-full-logo" />

              <p className="hero-subtitle">
                Secure, paperless visitor management for gated communities — from QR pass
                creation to gate verification, all in one platform.
              </p>

              <div className="hero-buttons">
                <Link to="/register" className="btn-primary-gold">Get Started</Link>
                <Link to="/about" className="btn-outline-gold">Learn More</Link>
              </div>

              <ul className="hero-points">
                <li><i className="bi bi-check-circle-fill"></i> No app install for visitors</li>
                <li><i className="bi bi-check-circle-fill"></i> Every entry logged &amp; auditable</li>
                <li><i className="bi bi-check-circle-fill"></i> One-time &amp; multi-use passes</li>
              </ul>
            </div>

            {/* Right: live product preview (pure CSS mockup) */}
            <div className="hero-visual" aria-hidden="true">
              <div className="mock-glow"></div>

              <div className="mock-card mock-pass">
                <div className="mock-pass-head">
                  <span className="mock-chip">ONE-TIME PASS</span>
                  <span className="mock-live"><span className="mock-dot"></span>Active</span>
                </div>
                <div className="mock-qr">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <span key={i} className={(i * 7) % 3 === 0 ? 'on' : ''}></span>
                  ))}
                </div>
                <div className="mock-pass-meta">
                  <div><strong>Rahul Sharma</strong><small>Visitor</small></div>
                  <div className="text-end"><strong>A-304</strong><small>Flat</small></div>
                </div>
              </div>

              <div className="mock-card mock-scan">
                <div className="mock-scan-icon"><i className="bi bi-check-lg"></i></div>
                <div>
                  <div className="mock-scan-title">Entry Granted</div>
                  <div className="mock-scan-sub">Main Gate · just now</div>
                </div>
              </div>

              <div className="mock-card mock-alert">
                <i className="bi bi-bell-fill"></i>
                <span>Your visitor just entered</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-strip">
          {stats.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <section className="home-section">
          <div className="text-center">
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

        {/* ── How it works ── */}
        <section className="home-section">
          <div className="text-center">
            <h2 className="section-title">How It <span>Works</span></h2>
          </div>
          <div className="section-line"></div>

          <div className="steps-rail">
            {steps.map(s => (
              <div className="step-item" key={s.n}>
                <div className="step-badge">
                  <i className={`bi ${s.icon}`}></i>
                  <span className="step-num">{s.n}</span>
                </div>
                <h6>{s.title}</h6>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Roles ── */}
        <section className="home-section">
          <div className="text-center">
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

        {/* ── Closing CTA ── */}
        <section className="home-cta">
          <img src={logoMark} alt="Pravesh shield mark" className="home-cta-mark" />
          <h3>Ready to secure your community?</h3>
          <p>Join Pravesh and bring every gate, guard, and visitor pass onto one trusted platform.</p>
          <div className="hero-buttons justify-content-center">
            <Link to="/register" className="btn-primary-gold">Create an Account</Link>
            <Link to="/contact" className="btn-outline-gold">Talk to Us</Link>
          </div>
        </section>

      </div>
    </>
  )
}

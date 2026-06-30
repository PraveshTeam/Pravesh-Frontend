import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import logoMark from '../../assets/logo.png'
import './AboutPage.css'
import varadImg from '../../assets/varad.jpg';
import snehaImg from '../../assets/Sneha.png';
import ritikImg from '../../assets/Ritik.jpg';
import saloneeImg from '../../assets/Salonee.png';
import shreyaImg from '../../assets/Shreya.png';
import vyankiiImg from '../../assets/vyankii.jpeg';

/* ── Default Avatar SVG (initials) ── */
const DefaultAvatar = ({ name }) => {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  const uid = `grad-${initials}-${Math.random().toString(36).slice(2, 6)}`
  return (
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="default-avatar">
      <defs>
        <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2c5d8c" />
          <stop offset="100%" stopColor="#e8871a" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill={`url(#${uid})`} />
      <text x="40" y="47" textAnchor="middle" fontSize="24" fontWeight="700"
        fontFamily="Segoe UI, sans-serif" fill="white" letterSpacing="1">
        {initials}
      </text>
    </svg>
  )
}

/* ── Social Icons ── */
const SocialIcon = ({ href, icon, title }) => (
  <a href={href} target="_blank" rel="noreferrer" title={title} className="social-link-pravesh">
    <i className={`bi ${icon}`}></i>
  </a>
)

const teamMembers = [
  {
    id: 1,
    name: 'Ritik Garhewal',
    role: 'Frontend Developer',
    photo: ritikImg,
    bio: 'Developed responsive user interfaces using React 18 and Bootstrap. Built reusable components, integrated REST APIs, and created intuitive navigation for resident, guard, and admin dashboards.',
    email: 'ritik.garhewal.cmfeb26@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ritikgarhewal',
    github: 'https://github.com/ritikgarhewalcmfeb26',
  },
  {
    id: 2,
    name: 'Salonee Pravin Shirsat',
    role: 'Backend Developer',
    photo: saloneeImg,
    bio: 'Developed secure backend APIs using .NET 8, implemented visitor pass generation, QR code verification, and managed database operations to ensure reliable gate management.',
    email: 'shirsatsalonee510@gmail.com',
    linkedin: 'https://www.linkedin.com/in/salonee-shirsat-325517248',
    github: 'https://github.com/89285-Salonee',
  },
  {
    id: 3,
    name: 'Shreya Jangid',
    role: 'Backend Developer',
    photo: shreyaImg,
    bio: 'Implemented business logic, role-based workflows, and database integration using .NET 8. Ensured efficient communication between resident, guard, and administrator modules.',
    email: 'shreyajangid12@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shreyajangid/',
    github: 'https://github.com/shreyajangid12',
  },
  {
    id: 4,
    name: 'Sneha Raja Ghongade',
    role: 'Full Stack Developer',
    photo: snehaImg,
    bio: 'Developed full-stack features using .NET 8, React 18, and Bootstrap. Built secure backend APIs, designed database modules, and created responsive user interfaces with seamless API integration.',
    email: 'snehaghongade642@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sneha-ghongade',
    github: 'https://github.com/snehaghongadeDev',
  },
  {
    id: 5,
    name: 'Varad Nishant Patil',
    role: 'Backend Developer',
    photo: varadImg,
    bio: 'Led backend development using .NET 8 by designing the application architecture, implementing JWT-based authentication and authorization, developing secure REST APIs, and designing the MySQL database for a scalable visitor management system.',
    email: 'varadpatil466@gmail.com',
    linkedin: 'https://www.linkedin.com/in/varad-nishant-patil-4159822b0',
    github: 'https://github.com/Varadpatil1812',
  },
  {
    id: 6,
    name: 'Vyankatesh Deepak Wakde',
    role: 'Backend Developer',
    photo: vyankiiImg,
    bio: 'Contributed to the end-to-end backend development of a web application using .NET 8, focusing on API development, database design,          user authentication, and system security.',
    email: 'vyankateshwakde23@gmail.com',
    linkedin: 'https://www.linkedin.com/in/vyankatesh-wakde-6b5a3334b',
    github: 'https://github.com/vyankateshwakdecmfeb26',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="about-page">

        {/* ── Hero Info Card ── */}
        <div className="about-hero-card">
          <div className="about-hero-text">
            <p className="about-hero-lead">
              <i>Pravesh is an intelligent access control system built to secure gated communities.</i>
            </p>
            <p className="about-para">
              <i>Our mission is to replace paper visitor registers and manual gate checks with a fast,
                reliable, and fully digital pass-and-verification system.</i>
            </p>
            <p className="about-para">
              <i>Built as a CDAC final year project, Pravesh brings residents, guards, and society
                administrators onto one connected platform — from QR pass creation to real-time entry logs.</i>
            </p>
          </div>

          <div className="about-hero-brand">
            <img src={logoMark} alt="Pravesh" className="pravesh-brand-icon" />
          </div>
        </div>

        {/* ── Team Section ── */}
        <div className="about-inner">
          <h2 className="team-heading">Meet The Team</h2>

          <div className="card-section">
            {teamMembers.map(member => (
              <div className="info-card" key={member.id}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="member-photo" />
                ) : (
                  <DefaultAvatar name={member.name} />
                )}
                <h4 className="member-name">{member.name}</h4>
                <h4 className="member-role">( {member.role} )</h4>
                <p className="about-para">{member.bio}</p>
                <div className="social-links">
                  {member.email && (
                    <SocialIcon
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`}
                      icon="bi-envelope-fill"
                      title="Email"
                    />
                  )}
                  <SocialIcon href={member.linkedin} icon="bi-linkedin" title="LinkedIn" />
                  <SocialIcon href={member.github} icon="bi-github" title="GitHub" />
                </div>
              </div>
            ))}
          </div>

          {/* ── Mission Card ── */}
          <div className="card mission-card">
            <div className="card-body">
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-text">
                Our mission is to make residential gate security faster, more transparent, and easier to
                manage for everyone involved. We aim to give residents control over who can enter on their
                behalf, give guards a simple way to verify visitors in seconds, and give society admins a
                clear, searchable record of every entry — all without a single paper register.
              </p>
            </div>
          </div>

          <div className="text-center mt-4 mb-5">
            <Link to="/register" className="btn-primary-gold-about">Join Pravesh</Link>
          </div>
        </div>

      </div>
    </>
  )
}

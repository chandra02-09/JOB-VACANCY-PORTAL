import Link from 'next/link';
import styles from './page.module.css';

const FEATURES = [
  {
    icon: '🤖',
    iconBg: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(99,102,241,0.08))',
    iconColor: '#818cf8',
    title: 'Smart AI Matching',
    desc: 'Our proprietary algorithm calculates a precise match score between your skills and any job, surfacing only the most relevant roles for you.',
  },
  {
    icon: '📄',
    iconBg: 'linear-gradient(135deg,rgba(34,211,238,0.25),rgba(34,211,238,0.08))',
    iconColor: '#22d3ee',
    title: 'Instant Resume Parsing',
    desc: 'Upload your PDF resume once. Our AI extracts skills, experience, and education in seconds — no manual entry required.',
  },
  {
    icon: '📊',
    iconBg: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(245,158,11,0.08))',
    iconColor: '#f59e0b',
    title: 'Career Analytics',
    desc: 'Track applications, see who viewed your profile, and get AI-powered insights to strengthen your career trajectory.',
  },
  {
    icon: '🔔',
    iconBg: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(16,185,129,0.08))',
    iconColor: '#10b981',
    title: 'Real-time Alerts',
    desc: 'Get instant notifications when your match score hits new jobs. Never miss the perfect opportunity again.',
  },
  {
    icon: '🏢',
    iconBg: 'linear-gradient(135deg,rgba(244,63,94,0.25),rgba(244,63,94,0.08))',
    iconColor: '#f43f5e',
    title: 'Recruiter Dashboard',
    desc: 'Recruiters can post jobs, browse AI-ranked candidates, and manage the entire hiring pipeline from one place.',
  },
  {
    icon: '💬',
    iconBg: 'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(139,92,246,0.08))',
    iconColor: '#a78bfa',
    title: 'AI Career Chatbot',
    desc: 'Ask our intelligent assistant anything — resume tips, salary benchmarks, interview prep, and more.',
  },
];

const STEPS = [
  { n: '01', title: 'Create Your Profile', desc: 'Sign up, upload your resume, and let AI do the rest.' },
  { n: '02', title: 'Get AI Matches', desc: 'Receive a curated list of jobs ranked by your personalized match score.' },
  { n: '03', title: 'Apply in One Click', desc: 'Apply to multiple jobs instantly with your pre-filled AI profile.' },
  { n: '04', title: 'Land the Job', desc: 'Track your applications, ace interviews, and get hired faster.' },
];

const TESTIMONIALS = [
  {
    stars: '★★★★★',
    text: "I landed a Senior Engineer role within 3 weeks. The AI match score literally predicted every job I'd be excited about.",
    name: 'Priya K.',
    role: 'Senior Frontend Engineer',
    initials: 'PK',
  },
  {
    stars: '★★★★★',
    text: "As a recruiter, I can now screen 200 applications in minutes instead of days. The AI ranking is incredibly accurate.",
    name: 'Marcus T.',
    role: 'Talent Acquisition Lead',
    initials: 'MT',
  },
  {
    stars: '★★★★★',
    text: "The resume parser automatically filled out my profile. It felt like magic — I was applying to jobs in under 5 minutes.",
    name: 'Aisha R.',
    role: 'Data Scientist',
    initials: 'AR',
  },
];

const TAGS = ['Frontend Developer', 'AI Engineer', 'Product Manager', 'Remote', 'Data Scientist'];

export default function Home() {
  return (
    <main className={styles.main}>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Powered by State-of-the-Art AI
        </div>

        <h1 className={styles.heroTitle}>
          Find Your{' '}
          <span className="gradient-text">Dream Job</span>
          <br />
          Smarter &amp; Faster
        </h1>

        <p className={styles.heroSubtitle}>
          AI-powered matching, instant resume parsing, and personalised career guidance — all in one beautiful platform.
        </p>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            className={styles.searchField}
            type="text"
            placeholder="🔍  Job title, skill, or company..."
          />
          <div className={styles.searchDivider} />
          <input
            className={styles.searchField}
            type="text"
            placeholder="📍  City, state, or Remote..."
          />
          <Link href="/jobs" className={styles.searchBtn}>
            Search Jobs →
          </Link>
        </div>

        {/* Trending tags */}
        <div className={styles.tagWrap}>
          <span className={styles.tagLabel}>Trending:</span>
          {TAGS.map(tag => (
            <Link href="/jobs" key={tag} className={styles.tag}>{tag}</Link>
          ))}
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>50K+</span>
          <span className={styles.statLabel}>Active Jobs</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>120K+</span>
          <span className={styles.statLabel}>Job Seekers</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>8K+</span>
          <span className={styles.statLabel}>Companies</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>93%</span>
          <span className={styles.statLabel}>Match Accuracy</span>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <section className={styles.featuresSection}>
        <div style={{ textAlign: 'center' }}>
          <span className={styles.sectionLabel}>PLATFORM FEATURES</span>
          <h2 className={styles.sectionTitle}>
            Everything you need to{' '}
            <span className="gradient-text">level up</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A full-stack AI toolkit for job seekers and recruiters alike.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div
                className={styles.featureIcon}
                style={{ background: f.iconBg }}
              >
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={styles.howSection}>
        <div style={{ textAlign: 'center' }}>
          <span className={styles.sectionLabel}>HOW IT WORKS</span>
          <h2 className={styles.sectionTitle}>
            Get hired in <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From signup to offer letter — our AI guides you every step of the way.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNumber}>{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={styles.testimonialsSection}>
        <div style={{ textAlign: 'center' }}>
          <span className={styles.sectionLabel}>TESTIMONIALS</span>
          <h2 className={styles.sectionTitle}>
            Loved by <span className="gradient-text">thousands</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Real stories from job seekers and recruiters who found success.
          </p>
        </div>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <div className={styles.stars}>{t.stars}</div>
              <p className={styles.testimonialText}>{t.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to find your <span className="gradient-text">dream job?</span>
        </h2>
        <p className={styles.ctaSubtitle}>
          Join 120,000+ professionals who use AI JobPortal to accelerate their careers.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.ctaPrimary}>
            Start for Free →
          </Link>
          <Link href="/jobs" className={styles.ctaOutline}>
            Browse All Jobs
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/">Home</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/register">Sign Up</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <p>© 2026 AI JobPortal. Built with ⚡ AI &amp; Next.js</p>
      </footer>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type Role = 'job_seeker' | 'recruiter';

const ROLES: { value: Role; label: string; icon: string; desc: string }[] = [
  { value: 'job_seeker', label: 'Job Seeker',  icon: '🎯', desc: 'Looking for a job' },
  { value: 'recruiter',  label: 'Recruiter',   icon: '🏢', desc: 'Hiring talent' },
];

export default function Register() {
  const { login } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<Role>('job_seeker');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      login({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token
      });

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in" style={{ maxWidth: 500 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg,#6366f1,#22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)'
          }}>⚡</div>
          <h1 className="auth-title gradient-text">Create your account</h1>
          <p className="auth-subtitle">Join 120K+ professionals on AI JobPortal</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-selector">
              {ROLES.map(r => (
                <label
                  key={r.value}
                  className={`role-card ${role === r.value ? 'selected' : ''}`}
                  onClick={() => setRole(r.value)}
                >
                  <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} />
                  <span className="role-card-icon">{r.icon}</span>
                  <span className="role-card-label">{r.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginTop: '0.2rem' }}>{r.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Alex Johnson"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 500 }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {/* Password strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%',
                    background: password.length < 6 ? '#f43f5e' : password.length < 10 ? '#f59e0b' : '#10b981',
                    borderRadius: 4,
                    transition: 'all 0.3s'
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: password.length < 6 ? '#f43f5e' : password.length < 10 ? '#f59e0b' : '#10b981', marginTop: '0.25rem', display: 'block' }}>
                  {password.length < 6 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: '#6366f1' }}>Terms of Service</a> and{' '}
            <a href="#" style={{ color: '#6366f1' }}>Privacy Policy</a>.
          </p>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create Free Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link href="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

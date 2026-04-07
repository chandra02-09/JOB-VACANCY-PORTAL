'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaCloudUploadAlt, FaCalendarAlt, FaDollarSign, FaInfoCircle } from 'react-icons/fa';

export default function PostJob() {
  const { user, isRecruiter } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    category: 'Engineering',
    type: 'Full-time',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user || (!isRecruiter && user.role !== 'admin')) {
    return <div className="auth-container"><h2>Access Denied</h2><p>Only recruiters can post jobs.</p></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split('\n').filter(r => r.trim() !== '')
        })
      });
      
      if (!res.ok) throw new Error('Failed to post job');
      setSuccess(true);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '4rem 2rem' }}>
      <div className="auth-card" style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="auth-title gradient-text">Post a New Vacancy</h1>
          <p className="auth-subtitle">Reach thousands of AI-matched candidates in seconds.</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ Job posted successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input type="text" placeholder="Senior AI Engineer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" placeholder="TechCorp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" placeholder="San Francisco, CA or Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <div style={{ position: 'relative' }}>
                <FaDollarSign style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="120k - 150k" style={{ paddingLeft: '2.5rem' }} value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea rows={6} placeholder="Detailed role description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements (one per line)</label>
            <textarea rows={4} placeholder="React, Node.js, AWS, etc." value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Application Deadline</label>
            <div style={{ position: 'relative' }}>
              <FaCalendarAlt style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-muted)' }} />
              <input type="date" style={{ paddingLeft: '2.5rem' }} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
          </div>

          <div style={{ background: 'rgba(99,102,241,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
            <FaInfoCircle color="var(--primary-light)" style={{ marginTop: '0.2rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>AI Tip:</strong> Our matching algorithm analyzes your requirements and description to automatically surface the best candidates based on their skills and experience. Be as detailed as possible!
            </p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" /> Posting Job...</> : <><FaCloudUploadAlt /> Publish Vacancy →</>}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import { FaMapMarkerAlt, FaWallet, FaSearch, FaBriefcase, FaCheckCircle } from 'react-icons/fa';

const MOCK_JOBS = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'TechCorp', location: 'Remote', salary: '$120k - $150k', match: 95, type: 'Full-time', isVerified: true },
  { id: 2, title: 'AI Research Scientist', company: 'DeepSync', location: 'San Francisco, CA', salary: '$150k - $200k', match: 88, type: 'Contract', isVerified: true },
  { id: 3, title: 'Full Stack Developer', company: 'WebSolutions', location: 'New York, NY', salary: '$100k - $130k', match: 76, type: 'Full-time', isVerified: false },
  { id: 4, title: 'UX/UI Designer', company: 'CreativeFlow', location: 'Austin, TX', salary: '$90k - $120k', match: 82, type: 'Remote', isVerified: true },
  { id: 5, title: 'DevOps Architect', company: 'CloudNexus', location: 'Remote', salary: '$140k - $180k', match: 91, type: 'Full-time', isVerified: false },
  { id: 6, title: 'Product Manager', company: 'InnovateAI', location: 'Seattle, WA', salary: '$130k - $160k', match: 85, type: 'Hybrid', isVerified: true },
];

export default function JobsPage() {
  const { user, isSeeker } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        const data = await res.json();
        setJobs(data.length > 0 ? data : MOCK_JOBS);
      } catch (err) {
        setJobs(MOCK_JOBS); // Fallback to mock
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    if (!user) {
      setMessage({ text: 'Please log in to apply for jobs.', type: 'error' });
      return;
    }
    if (!isSeeker) {
      setMessage({ text: 'Only job seekers can apply.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application failed');
      
      setMessage({ text: '✅ Application submitted successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: `❌ ${err.message}`, type: 'error' });
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className="badge badge-info animate-fade-in" style={{ marginBottom: '1rem' }}>SEARCH JOBS</span>
        <h1 className="gradient-text">Explore AI-Matched Roles</h1>
        <p>Our algorithms find the best jobs tailored to your unique profile and skills.</p>
        
        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginTop: '2rem', maxWidth: '600px', marginInline: 'auto' }}>
            {message.text}
          </div>
        )}
      </header>
      
      <div className={styles.searchSection}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.75rem', paddingLeft: '0.5rem' }}>
          <FaSearch color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by title, company, or skills..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className="btn-primary btn-sm" style={{ width: 'auto' }}>Filter Results</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <span className="spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Finding the best matches...</p>
        </div>
      ) : (
        <div className={styles.jobList}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <h3>{job.title}</h3>
                  <span className={styles.matchScore}>{job.match}% Match</span>
                </div>
                <div className={styles.company}>
                  <FaBriefcase size={14} />
                  <span>{job.company}</span>
                  {job.isVerified && (
                    <div className={styles.verifiedBadge} title="Platform Verified Job">
                      <FaCheckCircle className={styles.verifiedIcon} />
                    </div>
                  )}
                </div>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt size={14} />
                    <span>{job.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaWallet size={14} />
                    <span>{job.salary}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{job.type}</span>
                  </div>
                </div>
                <button 
                  className="btn-primary applyBtn"
                  onClick={() => handleApply(job._id || job.id)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>No matching jobs found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try broadening your search or updating your profile.</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="btn-outline" 
                style={{ marginTop: '2rem' }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

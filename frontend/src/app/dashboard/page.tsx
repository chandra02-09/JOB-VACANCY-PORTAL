'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';
import { 
  FaChartLine, FaBriefcase, FaUserCircle, FaPaperPlane, 
  FaRegBookmark, FaCog, FaSignOutAlt, FaRocket, FaFileAlt
} from 'react-icons/fa';

interface Job {
  _id: string;
  title: string;
  company: string;
  category: string;
  type: string;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  resumeUrl: string;
}

interface Application {
  _id: string;
  user: Applicant;
  job: Job;
  status: 'pending' | 'shortlisted' | 'rejected';
  aiMatchScore: number;
  createdAt: string;
  feedback?: string;
}

export default function Dashboard() {
  const { user, isSeeker, isRecruiter, isAdmin, logout } = useAuth();
  // Admins get recruiter-style view + extra admin controls
  const isRecruiterOrAdmin = isRecruiter || isAdmin;
  const [applications, setApplications] = useState<Application[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobApplicants, setJobApplicants] = useState<Application[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        
        const endpoint = isSeeker ? '/api/applications/myapplications' : '/api/jobs';
        const res = await fetch(`http://localhost:5000${endpoint}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        
        if (isSeeker) {
          setApplications(data);
        } else {
          // Admins see ALL jobs; recruiters see only their own
          if (isAdmin) {
            setPostedJobs(data);
          } else {
            setPostedJobs(data.filter((j: any) => j.postedBy?._id === user._id || j.postedBy === user._id));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, isSeeker]);

  const viewApplicants = async (jobId: string) => {
    setLoading(true);
    setSelectedJob(postedJobs.find(j => j._id === jobId) || null);
    try {
      const res = await fetch(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      setJobApplicants(data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setJobApplicants(prev => prev.map(app => app._id === appId ? { ...app, status: status as any } : app));
    } catch (err) {
      alert('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const verifyJob = async (jobId: string, isVerified: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/jobs/${jobId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ isVerified })
      });
      setPostedJobs(prev => prev.map(j => j._id === jobId ? { ...j, isVerified } as any : j));
    } catch (err) {
      alert('Verification update failed');
    }
  };

  if (!user) return <div className="auth-container"><span className="spinner" /></div>;

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <h3 className={styles.sidebarTitle}>Navigation</h3>
          <ul className={styles.sidebarNav}>
            <li className={`${styles.navItem} ${styles.navItemActive}`}>
              <FaChartLine /> <span>Overview</span>
            </li>
            <li className={styles.navItem}>
              <FaBriefcase /> <span>{isSeeker ? 'My Applications' : isAdmin ? 'All Job Listings' : 'My Job Postings'}</span>
            </li>
            {isSeeker && (
              <li className={styles.navItem}>
                <FaRegBookmark /> <span>Saved Jobs</span>
              </li>
            )}
            <li className={styles.navItem}>
              <FaUserCircle /> <span>Profile Hub</span>
            </li>
            {isSeeker && (
              <li className={styles.navItem}>
                <FaFileAlt /> <span>AI Resume Review</span>
              </li>
            )}
            {isAdmin && (
              <li className={styles.navItem} onClick={() => window.location.href = '/jobs/post'}
                style={{ color: 'var(--accent)', cursor: 'pointer' }}>
                <FaPaperPlane /> <span>Post New Job</span>
              </li>
            )}
          </ul>
        </div>
        
        <div>
          <h3 className={styles.sidebarTitle}>Account</h3>
          <ul className={styles.sidebarNav}>
            <li className={styles.navItem}>
              <FaCog /> <span>Settings</span>
            </li>
            <li className={styles.navItem} onClick={logout} style={{ color: 'var(--danger)' }}>
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className={styles.subtitle}>
            {isSeeker 
              ? "Here is what's happening with your job search today."
              : isAdmin
                ? "Admin Panel — Manage all job listings, verify companies, and oversee the platform."
                : "Manage your job listings and review top AI-matched candidates."}
          </p>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {isSeeker ? (
            <>
              <div className={styles.statCard}>
                <h4>Total Applications</h4>
                <div className={styles.statNumber}>{applications.length}</div>
              </div>
              <div className={styles.statCard}>
                <h4>Active Interviews</h4>
                <div className={styles.statNumber}>3</div>
              </div>
              <div className={styles.statCard}>
                <h4>Profile Match Rate</h4>
                <div className={styles.statNumber} style={{ color: 'var(--success)' }}>94%</div>
              </div>
            </>
          ) : isAdmin ? (
            <>
              <div className={styles.statCard}>
                <h4>Total Job Listings</h4>
                <div className={styles.statNumber}>{postedJobs.length}</div>
              </div>
              <div className={styles.statCard}>
                <h4>Verified Jobs</h4>
                <div className={styles.statNumber} style={{ color: 'var(--success)' }}>
                  {(postedJobs as any[]).filter(j => j.isVerified).length}
                </div>
              </div>
              <div className={styles.statCard}>
                <h4>Pending Verification</h4>
                <div className={styles.statNumber} style={{ color: 'var(--warning)' }}>
                  {(postedJobs as any[]).filter(j => !j.isVerified).length}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.statCard}>
                <h4>Active Postings</h4>
                <div className={styles.statNumber}>{postedJobs.length}</div>
              </div>
              <div className={styles.statCard}>
                <h4>Total Applicants</h4>
                <div className={styles.statNumber}>48</div>
              </div>
              <div className={styles.statCard}>
                <h4>Top Tier Matches</h4>
                <div className={styles.statNumber} style={{ color: 'var(--accent)' }}>12</div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity / Applications */}
        <div className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <h3>
              {isSeeker 
                ? 'Recent Applications' 
                : selectedJob 
                  ? `Applicants for ${selectedJob.title}` 
                  : isAdmin ? 'All Platform Jobs' : 'Managed Postings'}
            </h3>
            {selectedJob && <button className="btn-outline btn-sm" onClick={() => setSelectedJob(null)}>Back to Jobs</button>}
            {!selectedJob && !isAdmin && <button className="btn-outline btn-sm">View All</button>}
            {isAdmin && !selectedJob && (
              <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => window.location.href = '/jobs/post'}>
                + Post New Job
              </button>
            )}
          </div>

          <div className={styles.activityList}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></div>
            ) : isSeeker ? (
              applications.length > 0 ? (
                applications.map(app => (
                  <div key={app._id} className={styles.activityItem}>
                    <div className={styles.jobInfo}>
                      <h4>{app.job.title}</h4>
                      <p>{app.job.company} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.aiScoreContainer}>
                      <span className={styles.aiScoreText}>{app.aiMatchScore}% Match Score</span>
                      <div className={styles.aiProgressBar}>
                        <div className={styles.aiProgressFill} style={{ width: `${app.aiMatchScore}%` }} />
                      </div>
                      <span className={`badge ${app.status === 'shortlisted' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>No applications yet. Start your search today!</p>
                  <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => window.location.href = '/jobs'}>Browse Jobs</button>
                </div>
              )
            ) : selectedJob ? (
              jobApplicants.length > 0 ? (
                jobApplicants.map(app => (
                  <div key={app._id} className={styles.activityItem}>
                    <div className={styles.jobInfo}>
                      <h4>{app.user.name}</h4>
                      <p>{app.user.email} • AI Core Skills: {app.user.skills?.slice(0,3).join(', ')}</p>
                    </div>
                    <div className={styles.aiScoreContainer}>
                      <span className={styles.aiScoreText}>{app.aiMatchScore}% Match Score</span>
                      <div className={styles.aiProgressBar}>
                        <div className={styles.aiProgressFill} style={{ width: `${app.aiMatchScore}%` }} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button 
                          className="btn-sm btn-outline" 
                          style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                          disabled={updatingId === app._id || app.status === 'shortlisted'}
                          onClick={() => updateStatus(app._id, 'shortlisted')}
                        >
                          Shortlist
                        </button>
                        <button 
                          className="btn-sm btn-outline" 
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          disabled={updatingId === app._id || app.status === 'rejected'}
                          onClick={() => updateStatus(app._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>No applicants for this job yet.</p>
                </div>
              )
            ) : (
              postedJobs.length > 0 ? (
                postedJobs.map(job => (
                  <div key={job._id} className={styles.activityItem}>
                    <div className={styles.jobInfo}>
                      <h4>{job.title}</h4>
                      <p>{job.category} • {job.type}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {isAdmin && (
                        <button
                          className="btn-sm btn-outline"
                          style={{
                            borderColor: (job as any).isVerified ? 'var(--danger)' : 'var(--success)',
                            color: (job as any).isVerified ? 'var(--danger)' : 'var(--success)'
                          }}
                          onClick={() => verifyJob(job._id, !(job as any).isVerified)}
                        >
                          {(job as any).isVerified ? '✗ Unverify' : '✓ Verify'}
                        </button>
                      )}
                      <button className="btn-outline btn-sm" onClick={() => viewApplicants(job._id)}>View Applicants</button>
                      <button className="btn-primary btn-sm">Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p>No job postings yet. Ready to hire?</p>
                  <button className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => window.location.href = '/jobs/post'}>Post a Job</button>
                </div>
              )
            )}
          </div>
        </div>

        {/* AI Quick Tips Section */}
        {isSeeker && (
          <div className="card" style={{ marginTop: '3rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🚀</div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Want to boost your match score?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Our AI suggests updating your skills section with "System Design" and "Cloud Architecture" based on the jobs you're applying for.
              </p>
              <button className="btn-primary btn-sm" style={{ width: 'auto', marginTop: '1rem' }}>Optimize Profile</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

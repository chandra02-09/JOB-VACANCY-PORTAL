'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaCloudUploadAlt, FaBrain, FaCheckCircle, FaFileAlt, FaMagic } from 'react-icons/fa';
import styles from '../page.module.css';

interface AIResult {
  skills: string[];
  experience: string;
}

export default function ResumeHub() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState('');

  if (!user) return <div className="auth-container"><span className="spinner" /></div>;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    setLoading(true);
    setError('');
    
    try {
      // In a real app, send file with FormData
      const res = await fetch('http://localhost:5000/api/ai/parse', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (!data.success) throw new Error('AI Parsing failed.');
      
      // Simulate processing time
      setTimeout(() => {
        setResult(data.data);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '4rem 2rem' }}>
      <div className="auth-card" style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
          <h1 className="auth-title gradient-text">AI Resume Insight Hub</h1>
          <p className="auth-subtitle">Upload your resume and let our AI extract skills, calculate match scores, and optimize your career profile.</p>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!result ? (
          <div 
            style={{
              border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '20px',
              padding: '4rem 2rem',
              textAlign: 'center',
              background: dragActive ? 'rgba(99,102,241,0.05)' : 'var(--bg-glass)',
              transition: 'var(--transition)'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input type="file" id="resume-upload" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            <div style={{ fontSize: '4rem', color: 'var(--primary-light)', marginBottom: '1.5rem' }}>
              <FaCloudUploadAlt />
            </div>
            <h3>{file ? file.name : 'Drag & drop your resume here'}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Supports PDF, DOC, and DOCX (Max 5MB)</p>
            
            <label htmlFor="resume-upload" className="btn-outline" style={{ cursor: 'pointer', marginBottom: '1rem', display: 'inline-block' }}>
              Select File
            </label>
            
            <br />
            
            {file && (
              <button className="btn-primary" style={{ width: 'auto' }} onClick={analyzeResume} disabled={loading}>
                {loading ? <><span className="spinner" /> AI Analyzing...</> : <><FaMagic /> Start AI Analysis</>}
              </button>
            )}
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>AI Matching Score</div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--success)' }}>92%</div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, margin: '1rem 0' }}>
                    <div style={{ width: '92%', height: '100%', background: 'var(--grad-primary)', borderRadius: 3 }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on your top 5 matched job categories.</p>
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <button className="btn-primary" style={{ marginBottom: '1rem' }}>Find Jobs for Me</button>
                  <button className="btn-outline" onClick={() => setResult(null)}>Analyze New File</button>
                </div>
              </div>

              <div>
                <h3 className={styles.sidebarTitle} style={{ padding: 0, marginBottom: '1.5rem' }}>Analysis Results</h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <FaBrain color="var(--primary-light)" /> <h4 style={{ margin: 0 }}>Extracted Skills</h4>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {result.skills.map(skill => (
                      <span key={skill} className="badge badge-info" style={{ padding: '0.4rem 1rem' }}>
                        <FaCheckCircle size={10} style={{ marginRight: '0.4rem' }} /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <FaFileAlt color="var(--primary-light)" /> <h4 style={{ margin: 0 }}>Experience Summary</h4>
                  </div>
                  <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{result.experience}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '3rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
              <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>💡</div>
                <div>
                  <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>AI Career Recommendation</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Your resume shows strong proficiency in <strong>React</strong> and <strong>Node.js</strong>. To unlock higher-paying "Senior" roles, consider adding <strong>Cloud Architecture (AWS/GCP)</strong> to your toolbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

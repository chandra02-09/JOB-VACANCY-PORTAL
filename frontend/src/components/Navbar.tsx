'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/jobs',      label: 'Find Jobs' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.navbar}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span className={styles.logoText}>AI JobPortal</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className={styles.authSection}>
          {!user ? (
            <>
              <Link href="/login" className={styles.loginBtn}>Log In</Link>
              <Link href="/register" className={styles.signupBtn}>Get Started →</Link>
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={logout} className={styles.loginBtn} style={{ background: 'none' }}>Logout</button>
              <Link href="/dashboard" className={styles.signupBtn}>Dashboard</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          <Link href="/login"    className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Log In</Link>
          <Link href="/register" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign Up →</Link>
        </div>
      )}
    </>
  );
}

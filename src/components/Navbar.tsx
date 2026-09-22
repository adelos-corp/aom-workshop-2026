import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GlassSurface from './GlassSurface';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Process', href: '#process' },
    { label: 'Build', href: '#build' },
    { label: 'Deploy', href: '#deploy' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, x: '-50%', y: -12 }}
      animate={{ opacity: 1, x: '-50%', y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        zIndex: 100,
        width: 'calc(100% - 48px)',
        maxWidth: '900px',
      }}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={50}
        backgroundOpacity={scrolled ? 0.12 : 0.06}
        blur={16}
        brightness={95}
        opacity={0.9}
        saturation={1.2}
        style={{
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
          border: '1px solid rgba(255,255,255,0.65)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        <nav
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 20px',
            width: '100%',
          }}
        >
          {/* Logo - Left Aligned */}
          <div style={{ position: 'absolute', left: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
            <a
              href="https://adeloscorp.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ADELOS Corp."
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img
                src="/adelos-logo.png"
                alt="ADELOS Corp."
                style={{ width: '28px', height: '28px', objectFit: 'contain', display: 'block', filter: 'brightness(0) contrast(1.35)' }}
              />
            </a>
            <a
              href="#"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text)',
              }}
            >
              The Art of Making
            </a>
          </div>

          {/* Desktop links - Center Aligned */}
          <div className="nav-menu" style={{ 
            display: 'flex', 
            gap: '32px', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: '13px',
                  color: 'var(--muted)',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--muted)')}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Action - Right Aligned */}
          <div style={{ position: 'absolute', right: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            <a
              href="#cta"
              className="nav-cta"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                padding: '7px 16px',
                borderRadius: '8px',
                background: 'var(--text)',
                color: 'var(--bg)',
                transition: 'background 0.2s ease, transform 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#333';
                (e.target as HTMLElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'var(--text)';
                (e.target as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Make something
            </a>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)', transition: 'transform 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
              <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)', transition: 'opacity 0.2s', opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)', transition: 'transform 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
            </button>
          </div>
        </nav>
      </GlassSurface>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: '8px',
              background: 'rgba(250,250,249,0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', color: 'var(--text)' }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'var(--text)',
                color: 'var(--bg)',
                textAlign: 'center',
              }}
            >
              Make something
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-menu { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </motion.header>
  );
}

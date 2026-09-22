import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GlassSurface from './GlassSurface';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: 'Process', href: '#process' },
    { label: 'Build', href: '#build' },
    { label: 'Deploy', href: '#deploy' },
  ];

  const glassProps = {
    borderRadius: 50,
    backgroundOpacity: 0.08,
    blur: 16,
    brightness: 95,
    opacity: 0.9,
    saturation: 1.2,
  };

  const logoContent = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
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
          style={{
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            display: 'block',
            filter: 'brightness(0) contrast(1.25) drop-shadow(0.7px 0 0 #000) drop-shadow(-0.7px 0 0 #000) drop-shadow(0 0.7px 0 #000) drop-shadow(0 -0.7px 0 #000)'
          }}
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
  );

  const linksContent = (
    <div className="nav-menu" style={{
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 8px',
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
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
        >
          {l.label}
        </a>
      ))}
    </div>
  );

  const ctaContent = (
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
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#333';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--text)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      Make something
    </a>
  );

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
      <AnimatePresence mode="wait" initial={false}>
        {!scrolled ? (
          <motion.div
            key="single"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="nav-single"
          >
            <GlassSurface
              width="100%"
              height="auto"
              {...glassProps}
              style={{
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.65)',
              }}
            >
              <nav style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 20px',
                width: '100%',
              }}>
                <div style={{ position: 'absolute', left: '20px', display: 'flex', alignItems: 'center' }}>
                  {logoContent}
                </div>
                {linksContent}
                <div style={{ position: 'absolute', right: '20px', display: 'flex', alignItems: 'center' }}>
                  {ctaContent}
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
                    <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)' }} />
                    <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)' }} />
                    <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'var(--text)' }} />
                  </button>
                </div>
              </nav>
            </GlassSurface>
          </motion.div>
        ) : (
          <motion.div
            key="split"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="nav-split"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ justifySelf: 'start' }}>
              <GlassSurface width="auto" height="auto" {...glassProps} style={{ border: '1px solid rgba(255,255,255,0.65)' }}>
                {logoContent}
              </GlassSurface>
            </div>

            <div style={{ justifySelf: 'center' }}>
              <GlassSurface width="auto" height="auto" {...glassProps} style={{ border: '1px solid rgba(255,255,255,0.65)' }}>
                {linksContent}
              </GlassSurface>
            </div>

            <div style={{ justifySelf: 'end' }}>
              <GlassSurface width="auto" height="auto" {...glassProps} style={{ border: '1px solid rgba(255,255,255,0.65)' }}>
                {ctaContent}
              </GlassSurface>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ fontSize: '15px', color: 'var(--text)' }}>
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
          .nav-split { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}

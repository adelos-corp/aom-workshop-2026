import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GlassSurface from './GlassSurface';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navTones, setNavTones] = useState<('light' | 'dark')[]>(['light', 'light', 'light']);
  const navHeaderRef = useRef<HTMLElement>(null);
  const navPanelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const getLuminance = (color: string) => {
    const match = color.match(/rgba?\\(([^)]+)\\)/i);
    if (!match) return null;

    const parts = match[1].split(',').map((part) => parseFloat(part.trim()));
    if (parts.length < 3) return null;

    const [r, g, b] = parts;
    const alpha = parts.length >= 4 ? parts[3] : 1;
    if (alpha === 0) return null;

    const toLinear = (value: number) => {
      const channel = value / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const detectNavTone = (panel: HTMLElement) => {
    const rect = panel.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const header = navHeaderRef.current;

    const elements = document.elementsFromPoint(x, y);
    const behind = elements.find((element) => !header?.contains(element));

    let current: Element | null = behind ?? null;

    while (current) {
      const styles = window.getComputedStyle(current);
      const luminance = getLuminance(styles.backgroundColor);

      if (luminance !== null) {
        return luminance < 0.42 ? 'dark' : 'light';
      }

      current = current.parentElement;
    }

    return 'light';
  };

  useEffect(() => {
    const updateNavTones = () => {
      setNavTones(navPanelRefs.map((ref) => ref.current ? detectNavTone(ref.current) : 'light'));
    };

    updateNavTones();
    window.addEventListener('scroll', updateNavTones, { passive: true });
    window.addEventListener('resize', updateNavTones);

    return () => {
      window.removeEventListener('scroll', updateNavTones);
      window.removeEventListener('resize', updateNavTones);
    };
  }, []);

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
          color: toneColors(navTones[0]).text,
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
            color: toneColors(navTones[1]).muted,
            transition: 'color 0.2s ease',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = toneColors(navTones[1]).text)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = toneColors(navTones[1]).muted)}
        >
          {l.label}
        </a>
      ))}
    </div>
  );

  const toneColors = (tone: 'light' | 'dark') => ({
    text: tone === 'dark' ? '#ffffff' : '#111110',
    muted: tone === 'dark' ? 'rgba(255,255,255,0.68)' : '#78786e',
    ctaBackground: tone === 'dark' ? '#ffffff' : '#111110',
    ctaText: tone === 'dark' ? '#111110' : '#fafaf9',
  });

  const ctaTone = toneColors(navTones[2]);

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
        e.currentTarget.style.background = navTones[2] === 'dark' ? '#e5e5e5' : '#333';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = ctaTone.ctaBackground;
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
      ref={navHeaderRef}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        zIndex: 100,
        width: 'calc(100% - 48px)',
        maxWidth: '900px',
      }}
    >
      <motion.div
        className="nav-morph"
        animate={{ gap: scrolled ? 10 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <motion.div
          ref={navPanelRefs[0]}
          animate={{ x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ justifySelf: 'start', minWidth: 0 }}
        >
          <GlassSurface
            className="navbar-glass"
            width="auto"
            height="auto"
            {...glassProps}
            borderRadius={scrolled ? 50 : '50px 0 0 50px'}
            style={{
              border: '1px solid rgba(255,255,255,0.65)',
              borderRight: scrolled ? '1px solid rgba(255,255,255,0.65)' : '0',
              boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <div style={{ color: toneColors(navTones[0]).text }}>{logoContent}</div>
          </GlassSurface>
        </motion.div>

        <motion.div
          ref={navPanelRefs[1]}
          animate={{ x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ justifySelf: 'center', minWidth: 0 }}
        >
          <GlassSurface
            className="navbar-glass"
            width="auto"
            height="auto"
            {...glassProps}
            borderRadius={scrolled ? 50 : 0}
            style={{
              border: '1px solid rgba(255,255,255,0.65)',
              borderLeft: scrolled ? '1px solid rgba(255,255,255,0.65)' : '0',
              borderRight: scrolled ? '1px solid rgba(255,255,255,0.65)' : '0',
              boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <div style={{ color: toneColors(navTones[1]).text }}>{linksContent}</div>
          </GlassSurface>
        </motion.div>

        <motion.div
          ref={navPanelRefs[2]}
          animate={{ x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ justifySelf: 'end', minWidth: 0 }}
        >
          <GlassSurface
            className="navbar-glass"
            width="auto"
            height="auto"
            {...glassProps}
            borderRadius={scrolled ? 50 : '0 50px 50px 0'}
            style={{
              border: '1px solid rgba(255,255,255,0.65)',
              borderLeft: scrolled ? '1px solid rgba(255,255,255,0.65)' : '0',
              boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {ctaContent}
          </GlassSurface>
        </motion.div>
      </motion.div>
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
          .navbar-glass.glass-surface--svg {
            backdrop-filter: var(--filter-id) saturate(var(--glass-saturation, 1)) blur(1.5px);
            -webkit-backdrop-filter: var(--filter-id) saturate(var(--glass-saturation, 1)) blur(1.5px);
          }
          .nav-menu { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-split { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}

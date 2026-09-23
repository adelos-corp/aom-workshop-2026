import { motion } from 'motion/react';
import { useRef } from 'react';
import { useInView } from 'motion/react';

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(48px, 6vw, 80px) 0 clamp(32px, 4vw, 48px)',
      }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {/* Main identity */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingBottom: '32px',
              borderBottom: '1px solid var(--border)',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 'clamp(24px, 4vw, 40px)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}
              >
                Fly
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Created and organised by Students of KES Polytechnic College
              </div>
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--muted)',
                textAlign: 'right',
              }}
            >
              Workshop 2026
            </div>
          </div>

          {/* Workshop footnote */}
          <div
            style={{
              paddingTop: '18px',
              fontSize: '10px',
              color: 'var(--muted)',
              opacity: 0.45,
              letterSpacing: '0.02em',
            }}
          >
            Workshop initiated by ADELOS Corp.
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--muted)', opacity: 0.5 }}>
              © 2026
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--muted)',
                opacity: 0.35,
                letterSpacing: '0.02em',
              }}
            >
              Website by Akhil Anand
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

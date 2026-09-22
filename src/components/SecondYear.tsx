import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const verbs = ['Prompt it.', 'Inspect it.', 'Change it.', 'Break it.', 'Fix it.', 'Make it yours.'];

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function SecondYear() {
  const verbsRef = useRef<HTMLDivElement>(null);
  const verbsInView = useInView(verbsRef, { once: true, margin: '-60px' });

  return (
    <section
      style={{
        padding: 'clamp(80px, 12vw, 160px) 0',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(48px, 8vw, 120px)',
            alignItems: 'start',
          }}
          className="sy-grid"
        >
          <div>
            <FadeUp>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '24px' }}>
                Second Year
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2
                style={{
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.0,
                  color: 'var(--text)',
                }}
              >
                Don't just generate.
                <br />
                <span style={{ color: 'var(--accent)' }}>Build.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2} style={{ marginTop: '32px' }}>
              <p style={{ fontSize: '16px', lineHeight: 1.75, maxWidth: '380px' }}>
                Students aren't simply asking AI to make a website.
                They are directing the process — with more control, more
                experimentation, and more ownership.
              </p>
            </FadeUp>
          </div>

          <div ref={verbsRef} style={{ paddingTop: '52px' }}>
            {verbs.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: 0, x: 20 }}
                animate={verbsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '20px 0',
                  borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 'clamp(18px, 2.5vw, 28px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: i === verbs.length - 1 ? 'var(--text)' : 'var(--muted)',
                  fontStyle: i === verbs.length - 1 ? 'italic' : 'normal',
                }}
              >
                {v}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sy-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

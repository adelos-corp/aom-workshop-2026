import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Intro() {
  return (
    <section
      style={{
        padding: 'clamp(96px, 14vw, 180px) 0',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '760px' }}>
          <FadeUp>
            <h2
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: 'var(--text)',
                marginBottom: '40px',
              }}
            >
              An idea is only<br />the beginning.
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p
              style={{
                fontSize: 'clamp(16px, 1.6vw, 20px)',
                maxWidth: '520px',
                lineHeight: 1.75,
              }}
            >
              In this workshop, students learn to turn ideas into real, working
              websites — using modern <span className="william-graham">WG</span>-assisted development and code. Not by
              watching. By building.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

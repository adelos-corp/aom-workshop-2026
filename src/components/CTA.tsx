import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="cta"
      style={{
        padding: 'clamp(96px, 16vw, 200px) 0',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            style={{
              fontSize: 'clamp(52px, 10vw, 120px)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'var(--text)',
              marginBottom: '32px',
            }}
          >
            Make something.
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 19px)',
                color: 'var(--muted)',
                lineHeight: 2,
                marginBottom: '56px',
              }}
            >
              Bring an idea.<br />
              Build it.<br />
              Make it yours.<br />
              Put it on the internet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.a
              href="#"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              animate={{
                scale: hovered ? 1.03 : 1,
                backgroundColor: hovered ? 'var(--accent-hov)' : 'var(--accent)',
              }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                borderRadius: '100px',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
              }}
            >
              Start making
              <motion.span
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block', fontSize: '17px' }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

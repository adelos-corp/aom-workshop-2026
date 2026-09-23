import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const nodes = [
  { label: 'IDEA', sub: 'the spark' },
  { label: 'PROMPT', sub: 'the instruction' },
  { label: 'WG', sub: 'the collaborator' },
  { label: 'CODE', sub: 'the result' },
  { label: 'BROWSER', sub: 'the experience' },
];

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

export default function Build() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInView = useInView(diagramRef, { once: true, margin: '-80px' });

  return (
    <section
      id="build"
      style={{ padding: 'clamp(80px, 12vw, 160px) 0' }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(48px, 8vw, 120px)',
            alignItems: 'center',
          }}
          className="build-grid"
        >
          {/* Left: editorial diagram */}
          <div ref={diagramRef}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {nodes.map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={diagramInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px 0',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: i === 2 ? 'var(--accent)' : 'var(--text)',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text)' }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{node.sub}</div>
                    </div>
                  </div>
                  {i < nodes.length - 1 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={diagramInView ? { height: '20px' } : {}}
                      transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                      style={{
                        width: '1px',
                        background: 'var(--border)',
                        marginLeft: '4px',
                      }}
                    />
                  )}
                </motion.div>
              ))}
              <div style={{ height: '1px', background: 'var(--border)' }} />
            </div>
          </div>

          {/* Right: copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <FadeUp delay={0.1}>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                The Build Experience
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: 'var(--text)',
                }}
              >
                You don't need to know everything before you begin.
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p style={{ fontSize: '16px', lineHeight: 1.75, maxWidth: '400px' }}>
                You need an idea, curiosity, and the willingness to iterate.
                The rest comes from doing.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Idea', 'Prompt', 'WG', 'Code', 'Browser'].map((word, i) => (
                  <div key={word} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', minWidth: '16px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                      {word}
                    </span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .build-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

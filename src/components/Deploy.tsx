import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const chain = [
  { label: 'localhost', desc: 'running on your machine' },
  { label: 'GitHub', desc: 'version controlled' },
  { label: 'Vercel', desc: 'deployed to the cloud' },
  { label: 'LIVE', desc: 'on the internet', isLive: true },
];

export default function Deploy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: '-80px' });

  return (
    <section
      id="deploy"
      style={{ padding: 'clamp(80px, 12vw, 160px) 0' }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(56px, 10vw, 120px)', maxWidth: '640px' }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '20px' }}>
            Deployment
          </p>
          <h2
            style={{
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'var(--text)',
              marginBottom: '20px',
            }}
          >
            Then put it on<br />the internet.
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'var(--muted)', lineHeight: 1.7 }}>
            Your idea shouldn't live only on your laptop.
          </p>
        </motion.div>

        {/* Chain */}
        <div
          ref={ref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            flexWrap: 'wrap',
            rowGap: '32px',
          }}
          className="deploy-chain"
        >
          {chain.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '20px 28px',
                  borderRadius: '10px',
                  background: item.isLive ? 'var(--text)' : 'transparent',
                  border: item.isLive ? 'none' : '1px solid var(--border)',
                  position: 'relative',
                  minWidth: '120px',
                }}
              >
                <span
                  style={{
                    fontSize: item.isLive ? '20px' : '16px',
                    fontWeight: item.isLive ? 600 : 400,
                    letterSpacing: '-0.01em',
                    color: item.isLive ? 'var(--bg)' : 'var(--text)',
                  }}
                >
                  {item.label}
                  {item.isLive && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      style={{
                        display: 'inline-block',
                        marginLeft: '8px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: item.isLive ? 'rgba(250,250,249,0.5)' : 'var(--muted)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.desc}
                </span>
              </motion.div>

              {i < chain.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0 12px',
                    color: 'var(--muted)',
                    fontSize: '13px',
                    transformOrigin: 'left',
                  }}
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .deploy-chain {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const stages = [
  { label: 'have an idea', description: 'Something you wish existed.' },
  { label: 'type it here', description: 'Turn the idea into a prompt.' },
  { label: 'work with the code', description: 'Read it. Shape it. Own it.' },
  { label: 'deploy it to the internet', description: 'Make it real. Make it live.' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((s) => (s + 1) % stages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm radial hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 65% 25%, rgba(232,93,47,0.045) 0%, transparent 70%),' +
            'radial-gradient(ellipse 50% 60% at 20% 75%, rgba(0,0,0,0.018) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{ y, opacity, textAlign: 'center', position: 'relative', zIndex: 1, width: '100%' }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '52px',
              padding: '5px 14px',
              border: '1px solid var(--border)',
              borderRadius: '100px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            KES Polytechnic · Second Year / Final Year · 2026
          </motion.div>

          {/* Initiated by */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(12px, 1.5vw, 15px)',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '18px',
            }}
          >
            ADELOS Corp.
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(56px, 11vw, 136px)',
              fontWeight: 600,
              letterSpacing: '-0.045em',
              lineHeight: 0.94,
              color: 'var(--text)',
              marginBottom: '28px',
            }}
          >
            The Art of<br />Making
          </motion.h1>

          {/* Powered by */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(11px, 1.4vw, 14px)',
              color: 'var(--muted)',
              letterSpacing: '0.02em',
              marginTop: '-8px',
              marginBottom: '18px',
            }}
          >
            Powered by <span className="william-graham">William Graham</span>
          </motion.div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(15px, 2vw, 21px)',
              color: 'var(--muted)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              marginBottom: '72px',
            }}
          >
            whatever you want.&nbsp;&nbsp;however you want.
          </motion.p>

          {/* Stage sequence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {stages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                  animate={{
                    opacity: activeStage === i ? 1 : 0.2,
                    scale: activeStage === i ? 1 : 0.975,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => setActiveStage(i)}
                >
                  <div
                    style={{
                      fontSize: 'clamp(14px, 1.8vw, 18px)',
                      fontWeight: activeStage === i ? 500 : 400,
                      color: activeStage === i ? 'var(--text)' : 'var(--muted)',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.35s ease, font-weight 0.2s ease',
                    }}
                  >
                    {stage.label}
                  </div>
                  {/* Description — always in DOM, animated via opacity/maxHeight */}
                  <motion.div
                    animate={{
                      opacity: activeStage === i ? 1 : 0,
                      maxHeight: activeStage === i ? '28px' : '0px',
                    }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--muted)',
                        marginTop: '3px',
                        fontStyle: 'italic',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {stage.description}
                    </div>
                  </motion.div>
                </motion.div>

                {i < stages.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStage === i ? 0.7 : 0.12 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '1px',
                      height: '22px',
                      background: 'var(--border)',
                      margin: '1px 0',
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            opacity: 0.5,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '28px',
            background: 'linear-gradient(to bottom, var(--muted) 0%, transparent 100%)',
            opacity: 0.35,
          }}
        />
      </motion.div>
    </section>
  );
}

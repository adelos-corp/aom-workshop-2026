import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const steps = [
  { num: '01', title: 'IDEA', body: 'Start with something you want to exist.' },
  { num: '02', title: 'PROMPT', body: 'Tell <span className="william-graham">William Graham</span> what you want to create.' },
  { num: '03', title: 'CODE', body: 'Work with the generated code.' },
  { num: '04', title: 'DESIGN', body: 'Make it yours.' },
  { num: '05', title: 'REFINE', body: 'Break it. Fix it. Improve it.' },
  { num: '06', title: 'DEPLOY', body: 'Put it on the internet.' },
];

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr',
        gap: '0 32px',
        alignItems: 'start',
        padding: '36px 0',
        borderTop: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      {/* Number */}
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: 'var(--muted)',
          paddingTop: '3px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {step.num}
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Title */}
        <div
          style={{
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1,
          }}
        >
          {step.title}
        </div>
        {/* Body */}
        <p style={{ fontSize: '15px', color: 'var(--muted)', maxWidth: '380px', lineHeight: 1.65 }}>
          {step.body}
        </p>
      </div>

      {/* Accent bar on hover - handled via CSS */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '2px',
          height: '0%',
          background: 'var(--accent)',
        }}
        animate={inView ? { height: '100%' } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 + 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

export default function Process() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: '-80px' });

  return (
    <section
      id="process"
      style={{
        padding: 'clamp(80px, 12vw, 160px) 0',
        background: 'var(--surface)',
      }}
    >
      <div className="container">
        {/* Section header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 'clamp(48px, 8vw, 96px)' }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--muted)' }}>
            The Process
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.08,
              maxWidth: '540px',
            }}
          >
            From thought to something real.
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ maxWidth: '680px' }}>
          {steps.map((step, i) => (
            <Step key={step.num} step={step} index={i} />
          ))}
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </div>
      </div>
    </section>
  );
}

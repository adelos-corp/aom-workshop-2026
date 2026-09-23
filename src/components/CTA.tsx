import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import PromptBar from './PromptBar';
import GeneratedResult from './GeneratedResult';
import ThoughtLine from './ThoughtLine';

type GeneratedResultData = {
  title: string;
  understand: string;
  plan: string[];
  setup: {
    commands: string[];
  };
  structure: {
    path: string;
    purpose: string;
  }[];
  build: {
    path: string;
    language: string;
    content: string;
  }[];
  design: {
    style: string;
    intensity: number;
    decisions: string[];
  };
  run: {
    commands: string[];
  };
  walkthrough: {
    step: number;
    title: string;
    explanation: string;
  }[];
  refine: string[];
  deploy: {
    commands: string[];
    steps: string[];
  };
};

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GeneratedResultData | null>(null);

  const controller = useRef<AbortController | null>(null);

  const send = async (
    text: string,
    meta: {
  attachments: string[];
  effort: string;
  intensity: number;
  model?: {
    key: string;
    name: string;
    tag?: string;
  };
}
  ) => {
    if (!text.trim() || busy) return;

    setBusy(true);
    setResult(null);

    controller.current = new AbortController();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: text.trim(),
          style: meta.effort,
          intensity: meta.intensity,
        }),
        signal: controller.current.signal,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed.');
      }

      setResult(data.result);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      console.error('AOM generation error:', error);
    } finally {
      setBusy(false);
      controller.current = null;
    }
  };

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
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(52px, 10vw, 120px)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: 'var(--text)',
              marginBottom: '32px',
            }}
          >
            Make something.
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 19px)',
                color: 'var(--muted)',
                lineHeight: 2,
                marginBottom: '36px',
              }}
            >
              Bring an idea.<br />
              Build it.<br />
              Make it yours.<br />
              Put it on the internet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <PromptBar
              placeholder="Master the Art of Making"
              efforts={[
                'Minimalist',
                'Maximalist',
                'Brutalist',
                'Glassmorphic',
                'Neumorphic',
                'Cyberpunk',
                'Experimental',
              ]}
              defaultEffort="Glassmorphic"
              busy={busy}
              onSend={send}
              onStop={() => controller.current?.abort()}
              background="#ffffff"
              color="#111111"
              width={560}
              radius={40}
              maxRows={5}
              pressScale={0.96}
            />

            {(busy || result) && (
  <ThoughtLine
    label="Generating code..."
    doneLabel="Code generated by William Graham"
    renderLabel={(text, working) => {
      if (working || text !== 'Code generated by William Graham') return text;
      return (
        <>
          Code generated by <span className="thought-line__william">William Graham</span>
        </>
      );
    }}
    breathDepth={0.6}
    breathPeriod={1.9}
    settleDuration={400}
    settleBlur={3.5}
    working={busy}
    showTimer={false}
    collapsible={false}
    glyph="sparkle"
    color="var(--text)"
  />
)}

            {result && <GeneratedResult result={result} />}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
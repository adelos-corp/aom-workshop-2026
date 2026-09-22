import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Attachment01Icon, Globe02Icon } from '@hugeicons/core-free-icons';
import PromptBar from './PromptBar';

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');
  const controller = useRef<AbortController | null>(null);\n  const filePickerResolver = useRef<((files: string[]) => void) | null>(null);

  const send = async (text: string) => {
    setBusy(true);
    controller.current = new AbortController();
    try {
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(resolve, 650);
        controller.current?.signal.addEventListener('abort', () => {
          window.clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      });
      setLastPrompt(text);
    } catch {
      // Stopping a demo prompt is intentionally silent.
    } finally {
      setBusy(false);
      controller.current = null;
    }
  };

  const pickFiles = () => {
    fileRef.current?.click();
  };

  const onFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).map(file => file.name);
    event.target.value = '';
    return files;
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
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
          >
            <PromptBar
              placeholder="Describe what you want to make…"
              sources={[
                { key: 'files', name: 'Photos & files', description: 'Upload from this device', icon: Attachment01Icon, attach: true },
                { key: 'web', name: 'Web search', description: 'Live results', icon: Globe02Icon },
              ]}
              commands={[
                { key: 'summarize', name: '/summarize', description: 'Digest the thread so far' },
              ]}
              models={[
                { key: 'nova-3', name: 'Nova 3', tag: 'Flagship' },
                { key: 'nova-mini', name: 'Nova Mini', tag: 'Fast' },
              ]}
              efforts={['Low', 'Medium', 'High', 'Extra', 'Max']}
              defaultModel="nova-3"
              defaultEffort="Medium"
              busy={busy}
              onSend={send}
              onStop={() => controller.current?.abort()}
              onAttach={async () => {
                pickFiles();
                return undefined;
              }}
              background="#27272a"
              color="#f5f5f5"
              menuBackground="#323236"
              sparkColor="#b39dff"
              sparkBoost={1}
              width={560}
              radius={18}
              maxRows={5}
              morphDuration={240}
              squash={0.12}
              tilt={8}
              pressScale={0.96}
            />

            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={event => {
                const files = onFiles(event);
                if (files.length) {
                  // The prompt bar owns its visible chips. This picker is exposed for the workshop demo.
                  window.dispatchEvent(new CustomEvent('aom-files-picked', { detail: files }));
                }
              }}
            />

            {lastPrompt ? (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  maxWidth: '560px',
                  color: 'var(--muted)',
                  fontSize: '12px',
                  letterSpacing: '0.01em',
                }}
              >
                Idea captured. Now build it.
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: '28px' }}
          >
            <motion.a
              href="#build"
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

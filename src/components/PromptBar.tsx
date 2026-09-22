import { useEffect, useRef, useState } from 'react';
import { ChevronsUp } from 'lucide-react';
import './PromptBar.css';

type Model = {
  key: string;
  name: string;
  tag?: string;
};

type PromptBarProps = {
  placeholder?: string;
  efforts?: string[];
  defaultEffort?: string;
  onEffortChange?: (effort: string) => void;
  busy?: boolean;
  onSend?: (
    text: string,
    payload: {
      attachments: string[];
      model?: Model;
      effort: string;
      intensity: number;
  }
) => void | Promise<void>;  onStop?: () => void;
  background?: string;
  color?: string;
  width?: number;
  radius?: number;
  maxRows?: number;
  pressScale?: number;
  className?: string;
};

const LINE = 22;

export default function PromptBar({
  placeholder = 'Ask anything',
  efforts = [],
  defaultEffort = '',
  onEffortChange,
  busy = false,
  onSend,
  onStop,
  background = '#ffffff',
  color = '#111111',
  width = 400,
  radius = 40,
  maxRows = 1,
  pressScale = 0.96,
  className = '',
}: PromptBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingPercent = useRef(50);
  const [draft, setDraft] = useState('');
  const [effortPercent, setEffortPercent] = useState(() => {
    const index = efforts.indexOf(defaultEffort);
    return index >= 0 && efforts.length ? ((index + 0.5) / efforts.length) * 100 : 50;
  });
  const [pressed, setPressed] = useState(false);

  const effortIndex = efforts.length
    ? Math.min(efforts.length - 1, Math.floor((effortPercent / 100) * efforts.length))
    : 0;
  const level = efforts[effortIndex] ?? '';
  const canSend = draft.trim().length > 0;
  const armed = busy || canSend;

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = '0px';
    const max = LINE * maxRows;
    input.style.height = `${Math.min(input.scrollHeight, max)}px`;
    input.style.overflowY = 'hidden';
  }, [draft, maxRows]);

  const send = () => {
   if (busy) {
     onStop?.();
     return;
   }
 
   if (!canSend) return;
 
   onSend?.(draft.trim(), {
     attachments: [],
     effort: level,
     intensity: effortPercent,
   });

  setDraft('');
  inputRef.current?.focus({ preventScroll: true });
};

  const commitEffort = (percent: number) => {
    const next = Math.max(0, Math.min(100, percent));
    setEffortPercent(next);
    const index = efforts.length
      ? Math.min(efforts.length - 1, Math.floor((next / 100) * efforts.length))
      : 0;
    onEffortChange?.(efforts[index]);
  };

  const updateSlider = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pendingPercent.current = ((event.clientX - rect.left) / rect.width) * 100;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      commitEffort(pendingPercent.current);
    });
  };

  const style = {
    '--pb-bg': background,
    '--pb-ink': color,
    '--pb-w': `${width}px`,
    '--pb-radius': `${radius}px`,
    '--pb-press': pressScale,
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className={`prompt-bar${className ? ` ${className}` : ''}`} style={style}>
      <div className="prompt-bar__field">
        <textarea
          ref={inputRef}
          className="prompt-bar__input"
          rows={1}
          value={draft}
          placeholder={placeholder}
          aria-label="Prompt"
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              send();
            }
          }}
        />

        <button
          type="button"
          className="prompt-bar__send"
          disabled={!armed}
          aria-label={busy ? 'Stop' : 'Send'}
          data-armed={armed ? '' : undefined}
          data-pressed={pressed ? '' : undefined}
          onMouseDown={event => {
            event.preventDefault();
            if (armed) setPressed(true);
          }}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onClick={send}
        >
          <ChevronsUp size={19} strokeWidth={2.1} aria-hidden="true" />
        </button>
      </div>

      {efforts.length > 0 ? (
        <div className="prompt-bar__effort">
          <div className="prompt-bar__effort-label">{level}</div>
          <div
            className="prompt-bar__effort-track"
            role="slider"
            tabIndex={0}
            aria-label="Making style"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={effortPercent}
            onPointerDown={event => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updateSlider(event);
            }}
            onPointerMove={event => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) updateSlider(event);
            }}
            onPointerUp={event => event.currentTarget.releasePointerCapture(event.pointerId)}
            onKeyDown={event => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                commitEffort(effortPercent - 1);
              } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                commitEffort(effortPercent + 1);
              }
            }}
          >
            <span className="prompt-bar__effort-fill" style={{ width: `${effortPercent}%` }} />
            <span className="prompt-bar__effort-thumb" style={{ left: `${effortPercent}%` }} />
          </div>
          <div className="prompt-bar__effort-range"><span>Minimalist</span><span>Experimental</span></div>
        </div>
      ) : null}
    </div>
  );
}

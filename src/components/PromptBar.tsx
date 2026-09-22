import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  File02Icon,
  HelpCircleIcon,
  Mic01Icon,
  SparklesIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import './PromptBar.css';

type Source = {
  key: string;
  name: string;
  description?: string;
  icon?: any;
};

type Command = {
  key: string;
  name: string;
  description?: string;
};

type Model = {
  key: string;
  name: string;
  tag?: string;
};

type Attachment = string;

type PromptBarProps = {
  placeholder?: string;
  sources?: Source[];
  commands?: Command[];
  models?: Model[];
  defaultModel?: string;
  efforts?: string[];
  defaultEffort?: string;
  onEffortChange?: (effort: string) => void;
  busy?: boolean;
  onSend?: (text: string, payload: { attachments: Attachment[]; model: Model; effort: string }) => void | Promise<void>;
  onStop?: () => void;
  onDictate?: () => void | string | Promise<void | string>;
  background?: string;
  color?: string;
  menuBackground?: string;
  sparkColor?: string;
  width?: number;
  radius?: number;
  maxRows?: number;
  morphDuration?: number;
  squash?: number;
  tilt?: number;
  pressScale?: number;
  className?: string;
};

const ARROW_UP = [12, 4.5, 18.5, 11, 14.25, 11, 14.25, 19.5, 9.75, 19.5, 9.75, 11, 5.5, 11];
const SQUARE = [12, 6, 18, 6, 18, 12, 18, 18, 6, 18, 6, 12, 6, 6];
const EASE_IN_OUT = [0.77, 0, 0.175, 1];
const LINE = 22;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pathAt = (a: number[], b: number[], t: number) => {
  let d = '';
  for (let i = 0; i < a.length; i += 2) {
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(a[i + 1], b[i + 1], t).toFixed(2)}`;
  }
  return `${d}Z`;
};

function SendGlyph({ busy, morphDuration, squash, tilt }: { busy: boolean; morphDuration: number; squash: number; tilt: number }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dir = useRef(busy ? 1 : -1);
  const t = useMotionValue(busy ? 1 : 0);

  useEffect(() => {
    const target = busy ? 1 : 0;
    dir.current = busy ? 1 : -1;
    const controls = animate(t, target, reduce ? { duration: 0 } : { duration: morphDuration / 1000, ease: EASE_IN_OUT });
    return () => controls.stop();
  }, [busy, morphDuration, reduce, t]);

  useMotionValueEvent(t, 'change', value => {
    pathRef.current?.setAttribute('d', pathAt(ARROW_UP, SQUARE, value));
    const goo = reduce ? 0 : Math.sin(value * Math.PI);
    const sx = 1 - squash * goo;
    if (svgRef.current) svgRef.current.style.transform = goo ? `rotate(${dir.current * tilt * goo}deg) scale(${sx}, ${1 / sx})` : '';
  });

  return (
    <svg ref={svgRef} className="prompt-bar__glyph" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path ref={pathRef} d={pathAt(ARROW_UP, SQUARE, t.get())} />
    </svg>
  );
}

export default function PromptBar({
  placeholder = 'Ask anything',
  sources = [],
  commands = [],
  models = [],
  defaultModel = '',
  efforts = [],
  defaultEffort = '',
  onEffortChange,
  busy = false,
  onSend,
  onStop,
  onDictate,
  background = '#ffffff',
  color = '#111111',
  menuBackground = '#ffffff',
  sparkColor = '#8b7cf6',
  width = 400,
  radius = 16,
  maxRows = 5,
  morphDuration = 240,
  squash = 0.12,
  tilt = 8,
  pressScale = 0.96,
  className = '',
}: PromptBarProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [modelKey] = useState(defaultModel || models[0]?.key || '');
  const [effortIndex, setEffortIndex] = useState(() => {
    const index = efforts.indexOf(defaultEffort);
    return index >= 0 ? index : Math.max(0, Math.floor((efforts.length - 1) / 2));
  });
  const [open, setOpen] = useState<'sources' | 'commands' | 'model' | 'effort' | null>(null);
  const [active, setActive] = useState(0);
  const [listening, setListening] = useState(false);
  const [pressed, setPressed] = useState(false);
  const typing = useRef({ energy: 0, strokes: 0 });

  const model = models.find(item => item.key === modelKey) ?? models[0];
  const level = efforts[effortIndex] ?? '';
  const maxed = efforts.length > 1 && effortIndex === efforts.length - 1;
  const token = /(^|\s)([@/])([\w-]*)$/.exec(draft);
  const tokenKind = token ? (token[2] === '@' ? 'sources' : 'commands') : null;
  const query = token?.[3]?.toLowerCase() ?? '';
  const currentMenu = open ?? tokenKind;
  const list =
    currentMenu === 'sources'
      ? sources.filter(item => item.name.toLowerCase().includes(query))
      : currentMenu === 'commands'
        ? commands.filter(item => item.name.replace(/^\//, '').toLowerCase().startsWith(query))
        : [];
  const cursor = Math.min(active, Math.max(0, list.length - 1));
  const canSend = draft.trim().length > 0 || attachments.length > 0;
  const armed = busy || canSend;

  useEffect(() => {
    if (!maxed || reduce || !sparkRef.current) return undefined;
    const canvas = sparkRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let raf = 0;
    let last = performance.now();
    const particles: { x: number; y: number; life: number; span: number; vy: number; r: number; phase: number }[] = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = () => {
      const rect = canvas.getBoundingClientRect();
      particles.push({ x: Math.random() * rect.width, y: rect.height + 3, life: 0, span: 2.2 + Math.random() * 2, vy: -(7 + Math.random() * 9), r: 1 + Math.random(), phase: Math.random() * Math.PI * 2 });
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (particles.length < 26) spawn();
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = sparkColor;
      ctx.shadowColor = sparkColor;
      ctx.shadowBlur = 8;
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += dt;
        p.y += p.vy * dt;
        if (p.life > p.span || p.y < -5) {
          particles.splice(i, 1);
          continue;
        }
        const k = p.life / p.span;
        ctx.globalAlpha = Math.sin(k * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(now / 900 + p.phase) * 5, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [maxed, reduce, sparkColor]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = '0px';
    const max = LINE * maxRows;
    input.style.height = `${Math.min(input.scrollHeight, max)}px`;
    input.style.overflowY = input.scrollHeight > max ? 'auto' : 'hidden';
  }, [draft, maxRows]);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  const send = () => {
    if (!canSend || busy || !model) return;
    onSend?.(draft.trim(), { attachments, model, effort: level });
    setDraft('');
    setAttachments([]);
    setOpen(null);
    focusInput();
  };

  const pick = (item: Source | Command | Model) => {
    const head = token ? draft.slice(0, token.index + (token[1]?.length ?? 0)) : draft;
    if (currentMenu === 'sources') {
      setDraft(`${head}@${item.name} `);
    } else {
      setDraft(`${head}${item.name} `);
    }
    setOpen(null);
    focusInput();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (currentMenu && list.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setActive((cursor + (event.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length);
      return;
    }
    if (currentMenu && list.length && (event.key === 'Enter' || event.key === 'Tab')) {
      event.preventDefault();
      pick(list[cursor]);
      return;
    }
    if (event.key === 'Escape') {
      setOpen(null);
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  const setEffort = (index: number) => {
    const next = Math.max(0, Math.min(efforts.length - 1, index));
    setEffortIndex(next);
    onEffortChange?.(efforts[next]);
  };

  const style = {
    '--pb-bg': background,
    '--pb-ink': color,
    '--pb-menu': menuBackground,
    '--pb-w': `${width}px`,
    '--pb-radius': `${radius}px`,
    '--pb-spark': sparkColor,
    '--pb-press': pressScale,
  } as React.CSSProperties;

  return (
    <div ref={rootRef} className={`prompt-bar${className ? ` ${className}` : ''}`} data-max={maxed ? '' : undefined} style={style}>
      {currentMenu === 'effort' ? (
        <div className="prompt-bar__menu" data-kind="effort">
          <div className="prompt-bar__effort-head">
            <span className="prompt-bar__effort-title">Style</span>
            <span className="prompt-bar__effort-level">{level}</span>
            <span className="prompt-bar__effort-help"><HugeiconsIcon icon={HelpCircleIcon} size={14} /></span>
          </div>
          <div className="prompt-bar__effort-ends"><span>Minimal</span><span>Experimental</span></div>
          <div className="prompt-bar__effort-track" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={efforts.length - 1} aria-valuenow={effortIndex} onClick={event => {
            const rect = event.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
            setEffort(Math.min(efforts.length - 1, Math.floor(percent / 100 * efforts.length)));
          }}>
            <span className="prompt-bar__effort-fill" style={{ width: `${efforts.length ? ((effortIndex + 1) / efforts.length) * 100 : 0}%` }} />
            <span className="prompt-bar__effort-thumb" style={{ left: `${efforts.length ? ((effortIndex + 0.5) / efforts.length) * 100 : 0}%` }} />
          </div>
        </div>
      ) : null}

      <div className="prompt-bar__field" onClick={focusInput}>
        <canvas ref={sparkRef} className="prompt-bar__sparks" aria-hidden="true" />
        {attachments.length > 0 ? (
          <div className="prompt-bar__chips">
            {attachments.map((file, index) => (
              <span key={`${file}-${index}`} className="prompt-bar__chip">
                <HugeiconsIcon icon={File02Icon} size={12} />
                <span className="prompt-bar__chip-name">{file}</span>
                <button type="button" className="prompt-bar__chip-x" aria-label={`Remove ${file}`} onClick={event => { event.stopPropagation(); setAttachments(items => items.filter((_, i) => i !== index)); }}>
                  <HugeiconsIcon icon={Cancel01Icon} size={10} />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <textarea
          ref={inputRef}
          className="prompt-bar__input"
          rows={1}
          value={draft}
          placeholder={listening ? 'Listening…' : placeholder}
          aria-label="Prompt"
          onChange={event => {
            const value = event.target.value;
            setDraft(value);
            typing.current.strokes += 1;
            setOpen(null);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(null)}
        />

        <div className="prompt-bar__bar">
          <span className="prompt-bar__spacer" />

          {efforts.length > 0 ? (
            <button type="button" className="prompt-bar__pick" aria-label="Choose style" data-on={open === 'effort' ? '' : undefined} data-max={maxed ? '' : undefined} onMouseDown={event => event.preventDefault()} onClick={() => { setOpen(open === 'effort' ? null : 'effort'); focusInput(); }}>
              <HugeiconsIcon icon={SparklesIcon} size={13} /><span>{level}</span>
            </button>
          ) : null}

          {onDictate ? (
            <button type="button" className="prompt-bar__tool" aria-label={listening ? 'Stop dictation' : 'Dictate'} data-on={listening ? '' : undefined} onMouseDown={event => event.preventDefault()} onClick={() => {
              if (listening) { setListening(false); return; }
              setListening(true);
              Promise.resolve(onDictate()).then(text => { setListening(false); if (text) setDraft(current => current.trim() ? `${current.trimEnd()} ${text}` : text); focusInput(); }, () => setListening(false));
            }}>
              {listening ? <span className="prompt-bar__eq"><i /><i /><i /></span> : <HugeiconsIcon icon={Mic01Icon} size={15} />}
            </button>
          ) : null}

          <button type="button" className="prompt-bar__send" disabled={!armed} aria-label={busy ? 'Stop' : 'Send'} data-armed={armed ? '' : undefined} data-pressed={pressed ? '' : undefined}
            onMouseDown={event => { event.preventDefault(); if (armed) setPressed(true); }}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onClick={() => busy ? onStop?.() : send()}>
            <SendGlyph busy={busy} morphDuration={morphDuration} squash={squash} tilt={tilt} />
          </button>
        </div>
      </div>
    </div>
  );
}

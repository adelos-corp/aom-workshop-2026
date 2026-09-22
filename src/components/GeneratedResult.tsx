import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import './GeneratedResult.css';

type GeneratedFile = {
  path: string;
  language: string;
  content: string;
};

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
  build: GeneratedFile[];
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

type GeneratedResultProps = {
  result: GeneratedResultData;
};

export default function GeneratedResult({
  result,
}: GeneratedResultProps) {
  return (
    <article className="generated-result">
      <header className="generated-result__header">
        <span className="generated-result__eyebrow">
          Your project
        </span>

        <h3>{result.title}</h3>
      </header>

      <section className="generated-result__section">
        <span className="generated-result__label">
          01 · UNDERSTAND
        </span>

        <p>{result.understand}</p>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          02 · PLAN
        </span>

        <ol className="generated-result__list">
          {result.plan.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          03 · SET UP
        </span>

        <CodeBlock
          language="bash"
          content={result.setup.commands.join('\n')}
        />
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          04 · STRUCTURE
        </span>

        <div className="generated-result__structure">
          {result.structure.map((item) => (
            <div
              className="generated-result__file"
              key={item.path}
            >
              <code>{item.path}</code>
              <span>{item.purpose}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          05 · BUILD
        </span>

        <div className="generated-result__files">
          {result.build.map((file) => (
            <div
              className="generated-result__code-file"
              key={file.path}
            >
              <div className="generated-result__code-header">
                <code>{file.path}</code>
                <span>{file.language}</span>
              </div>

              <CodeBlock
                language={file.language}
                content={file.content}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          06 · DESIGN
        </span>

        <div className="generated-result__style">
          <strong>{result.design.style}</strong>
          <span>{Math.round(result.design.intensity)}%</span>
        </div>

        <ul className="generated-result__list">
          {result.design.decisions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          07 · RUN
        </span>

        <CodeBlock
          language="bash"
          content={result.run.commands.join('\n')}
        />
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          08 · WALKTHROUGH
        </span>

        <div className="generated-result__walkthrough">
          {result.walkthrough.map((item) => (
            <div
              className="generated-result__walkthrough-item"
              key={item.step}
            >
              <span>{String(item.step).padStart(2, '0')}</span>

              <div>
                <h4>{item.title}</h4>
                <p>{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="generated-result__section">
        <span className="generated-result__label">
          09 · REFINE
        </span>

        <ul className="generated-result__list">
          {result.refine.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="generated-result__section generated-result__section--last">
        <span className="generated-result__label">
          10 · DEPLOY
        </span>

        {result.deploy.commands.length > 0 && (
          <CodeBlock
            language="bash"
            content={result.deploy.commands.join('\n')}
          />
        )}

        <ol className="generated-result__list">
          {result.deploy.steps.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </section>
    </article>
  );
}

function CodeBlock({
  language,
  content,
}: {
  language: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="generated-result__code-wrap">
      <button
        type="button"
        className="generated-result__copy"
        onClick={copyCode}
        aria-label={copied ? 'Code copied' : 'Copy code'}
      >
        {copied ? (
          <>
            <Check size={13} strokeWidth={2.2} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={13} strokeWidth={2} />
            <span>Copy</span>
          </>
        )}
      </button>

      <pre
        className="generated-result__code"
        data-language={language}
      >
        <code>{content}</code>
      </pre>
    </div>
  );
}
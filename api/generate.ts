import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.WILLIAM_API_KEY;

if (!apiKey) {
  throw new Error("WILLIAM_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const styleProfiles = {
  Minimalist: {
    min: 0,
    max: 14.28,
    description:
      "Clean layouts, generous whitespace, restrained typography, simple navigation, minimal decoration, strong visual hierarchy.",
  },

  Maximalist: {
    min: 14.29,
    max: 28.57,
    description:
      "Dense visual composition, expressive typography, layered elements, rich decoration, multiple visual accents, intentionally abundant content.",
  },

  Brutalist: {
    min: 28.58,
    max: 42.86,
    description:
      "Raw web aesthetics, strong borders, bold typography, high contrast, rigid geometry, intentionally unconventional layouts, minimal visual polish.",
  },

  Glassmorphic: {
    min: 42.87,
    max: 57.14,
    description:
      "Translucent surfaces, blur, layered depth, subtle borders, soft highlights, floating panels, atmospheric backgrounds.",
  },

  Neumorphic: {
    min: 57.15,
    max: 71.43,
    description:
      "Soft dimensional surfaces, subtle inset and outset shadows, rounded components, tactile controls, low-contrast visual hierarchy.",
  },

  Cyberpunk: {
    min: 71.44,
    max: 85.71,
    description:
      "Dark foundations, vivid accent colors, glowing edges, futuristic typography, strong contrast, technical visual language and energetic interfaces.",
  },

  Experimental: {
    min: 85.72,
    max: 100,
    description:
      "Unconventional layouts, unusual interactions, unexpected composition, creative typography, distinctive visual systems and strong artistic direction.",
  },
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise title for the generated project.",
    },

    understand: {
      type: Type.STRING,
      description:
        "A clear explanation of what the student wants to build.",
    },

    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "The main implementation plan in logical order.",
    },

    setup: {
      type: Type.OBJECT,
      properties: {
        commands: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["commands"],
    },

    structure: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.STRING,
          },
          purpose: {
            type: Type.STRING,
          },
        },
        required: ["path", "purpose"],
      },
    },

    build: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.STRING,
          },
          language: {
            type: Type.STRING,
          },
          content: {
            type: Type.STRING,
          },
        },
        required: ["path", "language", "content"],
      },
    },

    design: {
      type: Type.OBJECT,
      properties: {
        style: {
          type: Type.STRING,
        },
        intensity: {
          type: Type.NUMBER,
        },
        decisions: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["style", "intensity", "decisions"],
    },

    run: {
      type: Type.OBJECT,
      properties: {
        commands: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["commands"],
    },

    walkthrough: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: {
            type: Type.NUMBER,
          },
          title: {
            type: Type.STRING,
          },
          explanation: {
            type: Type.STRING,
          },
        },
        required: ["step", "title", "explanation"],
      },
    },

    refine: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },

    deploy: {
      type: Type.OBJECT,
      properties: {
        commands: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
      required: ["commands", "steps"],
    },
  },

  required: [
    "title",
    "understand",
    "plan",
    "setup",
    "structure",
    "build",
    "design",
    "run",
    "walkthrough",
    "refine",
    "deploy",
  ],
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  try {
    const {
      idea,
      style = "Minimalist",
      intensity = 0,
    } = req.body;

    if (!idea || typeof idea !== "string") {
      return res.status(400).json({
        success: false,
        error: "An idea is required.",
      });
    }

    const selectedStyle =
      styleProfiles[style as keyof typeof styleProfiles] ??
      styleProfiles.Minimalist;

    const prompt = `
You are the AI engine for "The Art of Making", a college workshop
that teaches students how to turn an idea into a real website.

The student wants:

"${idea}"

DESIGN STYLE:
${style}

STYLE INTENSITY:
${intensity}%

STYLE DESCRIPTION:
${selectedStyle.description}

TECH STACK:
- Visual Studio Code
- Next.js App Router
- Node.js
- TypeScript
- TSX
- CSS
- HTML
- npm

IMPORTANT RULES:

1. Generate a real, coherent website based specifically on the student's idea.
   Never replace the idea with a generic template.

2. The project MUST use the Next.js App Router with TypeScript/TSX.

3. Use plain CSS. Do not use Tailwind CSS unless the student explicitly asks for it.
   Keep dependencies minimal.

4. The setup MUST begin from create-next-app. Do not manually construct the project scaffold.

5. The SET UP section MUST contain exactly these commands, in this exact order:
   npx create-next-app@latest <project-name> --typescript --eslint --app --use-npm
   cd <project-name>
   code .
   Do NOT use mkdir.
   Do NOT add npm install.
   create-next-app performs dependency installation.

6. Do NOT use --src-dir. The application MUST have a ROOT-LEVEL app/ directory.
   Never generate src/app/.

7. The generated project must run with npm run dev after the generated files are placed
   into the create-next-app scaffold.

8. NEXT.JS CONFIGURATION IS STRICT:
   Use a ROOT-LEVEL file named exactly next.config.ts.
   Never generate next.config.mjs or next.config.js.
   The complete next.config.ts file MUST be present in both structure and build.
   It must use valid TypeScript, for example:
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {};

   export default nextConfig;

9. REQUIRED STRUCTURE. The structure section MUST include:
   - index.html
   - package.json
   - tsconfig.json
   - next.config.ts
   - app/layout.tsx
   - app/page.tsx
   - app/globals.css

10. REQUIRED BUILD FILES. The build section MUST include complete contents for every file
    listed above. Never summarize a file, omit it, or say "same as above".

11. index.html is a REQUIRED WORKSHOP TEACHING FILE. It must be a complete valid HTML5 document
    containing <!doctype html>, <html>, <head>, charset, viewport, <title>, and <body>.
    It is teaching material only. Do not put React imports, JSX, Next.js imports, or a second
    application bootstrap script in it.

12. app/layout.tsx MUST import "./globals.css", export valid metadata, and render:
    <html lang="en"><body>{children}</body></html>.
    Do not import files that do not exist.

13. app/page.tsx MUST export a default React component and only import packages/files that exist.
    If it uses useState, useEffect, useRef, event handlers, window, document, localStorage,
    sessionStorage, or other browser-only APIs, put "use client"; as the FIRST statement.
    Otherwise keep it as a Server Component.

14. app/globals.css MUST contain complete valid CSS for the generated page. Do not reference
    missing files, missing fonts, or undefined CSS imports.

15. package.json MUST preserve a normal Next.js scaffold. It MUST contain:
    "dev": "next dev"
    "build": "next build"
    "start": "next start"
    and a valid lint script supported by the generated scaffold.
    Do not import any package that package.json does not declare.

16. tsconfig.json MUST be valid JSON and compatible with a current create-next-app TypeScript
    App Router project. Do not invent obsolete compiler options.

17. Keep the project understandable to a second-year college student. Avoid unnecessary
    libraries, state-management systems, databases, APIs, or abstractions.

18. Generate COMPLETE files. Never use placeholders such as:
    "// rest of code goes here"
    "...etc"
    "TODO: implement"
    "add your code here"

19. CODE FORMATTING IS MANDATORY. Every build file must be readable multi-line source code
    with normal indentation, line breaks, blank lines, and nested structure. Never compress
    an entire file into one line.

20. The content field must contain actual source code, not a summary, pseudo-code, Markdown
    fences, or prose. Do not wrap file contents in triple-backtick fences.

21. Do not place literal escaped newline sequences such as \\n inside source code. After JSON
    parsing, content must contain real line breaks.

22. TypeScript/TSX must be syntactically valid. Match braces, parentheses, brackets, quotes,
    JSX tags, imports, and exports. Do not reference undefined variables or components.

23. CSS must be syntactically valid with balanced braces and valid declarations.
    HTML must be valid and properly nested.

24. INTERNAL CONSISTENCY IS REQUIRED:
    - every local import must resolve to a file supplied by the scaffold or build section
    - every package import must be declared in package.json
    - no import may reference src/app
    - no import may reference next.config.mjs
    - every interactive browser feature must live in a Client Component
    - every component, function, variable, and CSS class used must be defined appropriately

25. Do not generate extra files unless genuinely necessary. If an extra local file is needed,
    include it completely in BOTH structure and build.

26. Avoid remote assets and external services unless they are guaranteed to work without setup.
    Prefer CSS, inline SVG, text, and built-in browser capabilities.

27. The design style and intensity should affect the visual result without sacrificing
    functionality, readability, accessibility, or valid code.

28. Accessibility basics are required: semantic HTML, keyboard-accessible interactions,
    buttons for actions, labels for form controls, meaningful alt text for actual images,
    and visible focus states.

29. The walkthrough must tell the student exactly which generated files to inspect and edit
    in Visual Studio Code.

30. The deploy section must NOT contain Vercel or cloud deployment. This workshop is local.

31. The run.commands array should normally contain only:
    npm run dev

32. Before returning the response, perform a final consistency pass over every generated file:
    verify paths, imports, client/server boundaries, CSS selectors, package dependencies,
    Next.js config format, JSON validity, and the scaffold/generated-file compatibility.

33. Return only the structured response matching the provided schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const result = JSON.parse(response.text);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Gemini generation error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate the AOM project.",
    });
  }
}

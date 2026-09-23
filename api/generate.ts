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
- Next.js
- Node.js
- TypeScript
- TSX
- CSS
- HTML
- npm

IMPORTANT RULES:

1. Generate a real, coherent website concept based specifically on
   the student's idea.

2. Do not replace the student's idea with a generic template.

3. The generated project must use Next.js and TypeScript/TSX.

4. Styling must use CSS. Do not use Tailwind CSS unless the student
   explicitly requests it.

5. Use npm commands.

6. Visual Studio Code is the assumed code editor, but do not generate
   instructions for installing VS Code or opening the project in VS Code.
   Assume the student has already opened the project there.

7. The generated project must be runnable with:

   npm install
   npm run dev

8. The intensity represents how strongly the style should influence
   the visual design:
   - low intensity = restrained interpretation
   - high intensity = much stronger interpretation

9. Generate code that is understandable to a second-year college
   student. Avoid unnecessary complexity.

10. Generate complete files where possible. Do not use placeholders
    such as "// rest of code goes here".

11. Keep the project reasonably small so a student can understand,
    modify and run it locally.

12. The final project must be runnable with:

    npm install
    npm run dev

13. The "deploy" section should NOT contain Vercel or cloud deployment.
    The students are running their projects locally.

14. Explain the project as a teaching exercise. Students should be able
    to inspect the generated code and understand what each important
    part does.

15. Visual Studio Code is the recommended development environment.

16. The setup instructions must explain how to open the generated
    project in Visual Studio Code using:

    code .

17. The walkthrough should explain how students can locate and edit
    the important files in Visual Studio Code.

18. Assume students are using Visual Studio Code as their primary
    code editor.
19. REQUIRED PROJECT STRUCTURE: Every generated project MUST include these files in the "structure" section:
    - index.html
    - package.json
    - tsconfig.json
    - next.config.ts
    - app/page.tsx
    - app/globals.css

20. The "build" section MUST also include the complete contents of "index.html".
    Do not omit it, even though Next.js normally manages the document shell.
    For this workshop, index.html is an explicitly required teaching file.

21. The index.html must be a complete, valid HTML5 document with <!doctype html>,
    <html>, <head>, <meta charset>, <meta name="viewport">, <title>, and <body>.
    It should describe the generated project and may contain a root element such as
    <div id="root"></div>. Do not use placeholders.

22. Never substitute index.html with layout.tsx or any other file. The required
    index.html must appear literally as "index.html" in both the structure and build sections.

23. CODE FORMATTING IS MANDATORY: Every file in the "build" section must be returned as properly formatted, multi-line source code. Preserve normal indentation, line breaks, blank lines, and nested structure. Never compress an entire file into one line.

24. The "content" field must contain the exact source code for that file, not a summary, escaped pseudo-code, minified code, or prose description. Use syntax appropriate to the declared "language".

25. TypeScript and TSX must use valid TypeScript/TSX syntax with consistent indentation. JSX elements, props, arrays, objects, functions, and nested blocks must be laid out across readable lines where appropriate.

26. CSS must be formatted as normal multi-line CSS with selectors, declarations, and closing braces on separate readable lines. HTML must be formatted as normal multi-line HTML.

27. Do not place literal escaped newline sequences such as \\n inside the code content. The "content" string must represent the file with actual line breaks after JSON parsing.

28. Before returning the response, validate the syntax and structure of every generated file in "build" as carefully as possible. Fix malformed brackets, tags, quotes, imports, indentation-sensitive structure, and incomplete statements before returning it.


Return only the structured response matching the provided schema.
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
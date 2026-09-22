export type LessonTone = 'violet' | 'blue' | 'cyan'

export type Lesson = {
  number: string
  kicker: string
  title: string
  copy: string
  points: string[]
  tone: LessonTone
}

export const lessons: Lesson[] = [
  { number: '01', kicker: 'PROMPT ENGINEERING', title: 'Speak clearly. Make better things.', copy: 'Learn to communicate with AI so your ideas come back sharper, more useful and distinctly yours.', points: ['Structure prompts', 'Give context', 'Define constraints', 'Iterate + debug'], tone: 'violet' },
  { number: '02', kicker: 'VIBE CODING', title: 'Code with a creative partner.', copy: 'Turn natural language into working software, then learn enough code to take the wheel.', points: ['Describe what you want', 'Generate a first version', 'Modify the output', 'Control the result'], tone: 'blue' },
  { number: '03', kicker: 'WEBSITE CREATION', title: 'Make the idea real.', copy: 'Shape layout, type, color and motion into an experience people can actually use.', points: ['Layout + typography', 'Responsive design', 'Interaction + motion', 'Publish to the web'], tone: 'cyan' },
]

export const workshopFlow = [
  ['01', 'IDEA', 'Start with something you want to create.'], ['02', 'PROMPT', 'Describe your idea clearly.'], ['03', 'GENERATE', 'Use AI to turn your idea into code.'],
  ['04', 'BUILD', 'Create the actual website.'], ['05', 'REFINE', 'Fix, redesign, animate and improve it.'], ['06', 'SHIP', 'Publish it to the web.'],
] as const

export const projects = [
  ['PORTFOLIO', 'Mina / Visual Archive', 'A collection of quiet things.', 'project-portfolio'],
  ['RESTAURANT', 'NOKO / Kitchen & Fire', 'Come hungry. Leave inspired.', 'project-restaurant'],
  ['GAME', 'ORBITAL / 03', 'A tiny game about going further.', 'project-game'],
  ['STARTUP', 'FIELD NOTES', 'Ideas, shipped weekly.', 'project-startup'],
] as const
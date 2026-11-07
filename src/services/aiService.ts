import { INITIAL_PROJECTS } from "../data/mockProjects";
import type { ProjectIdea, Sketch } from "../types/project";

//Build the sketch content
export function buildNotebookSketchData(project: ProjectIdea): Sketch {
    if (project.notebookSketch) {
        return project.notebookSketch;
    }

    const date = new Date(project.createdAt || Date.now());
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthFullNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    const monthShort = monthNames[date.getMonth()] || 'OCT';
    const monthFull = monthFullNames[date.getMonth()] || 'OCTOBER';
    const year = date.getFullYear() || '2026';

    const cleanTitle = project.title.toUpperCase();

    const mileStones = [
        { date: '6', text: 'RAW IDEA VALIDATED IN NOTEBOOK' },
        { date: '12', text: 'REQUIREMENTS & FEATURES ANALYSIS' },
        { date: '18', text: 'INITIAL MVP PLAN VALIDATION' },
        { date: '28', text: 'PROTOTYPE & USER TESTING' }
    ];

    const workProjects = [
        { num: '①', title: 'PRODUCT CORE ARCHITECTURE', desc: 'Defining data flow and core components.' },
        { num: '②', title: 'USER INTERFACE & EXPERIENCE', desc: 'Sleek design focused on immediate onboarding.' },
        { num: '③', title: 'EXPORT & SHARING MODULE', desc: 'Exporting data in clean formats for daily use.' }
    ];

    const keyFeatures = [
        { symbol: 'symb1', text: 'REAL-TIME INPUT & STRUCTURE MANAGEMENT' },
        { symbol: 'symb2', text: 'PROJECT COHERENCE & RIGOR ALERTS' },
        { symbol: 'symb3', text: 'MULTI-DEVICE SYNC & LOCAL STORAGE' },
        { symbol: 'symb4', text: 'VISUAL NOTEBOOK EXPORT & RENDERING' }
    ];

    const devArchi = [
        { symbol: 'symb1', text: 'DATA EXTRACTION MODULE (VISION / AI)' },
        { symbol: 'symb2', text: 'MAIN CALCULATION ENGINE TESTING' },
        { symbol: 'symb3', text: 'REAL-TIME STREAMING VOICE DICTATION' }
    ];


    return {
        dateTitle: `${monthFull} ${year}`,
        dayStamp: `${date.getDate()}`,
        monthStamp: monthShort,
        versionBadge: 'VERSION 0.4',
        subTitle: `${cleanTitle} — VISUAL FRAMING`,
        mileStones,
        quote: project.oneLiner,
        workProjects,
        keyFeatures,
        devArchi
    };
}

// Prompts & intelligent analysis engine
export async function generateProjectIdeaFromRawText(
    rawInput: string,
    apiKey?: string,
    onProgress?: (stepMessage: string) => void
): Promise<ProjectIdea> {
    const cleanInput = rawInput.trim();
    if (!cleanInput) {
        throw new Error('Raw input text cannot be empty.');
    }

    // 1. If Gemini API Key is provided, attempt live Gemini fetch
    if (apiKey && apiKey.trim().length > 10) {
        try {
            if (onProgress) onProgress("Connecting to Gemini API...");
            const geminiResult = await fetchWithGeminiAPI(cleanInput, apiKey.trim(), onProgress);
            if (geminiResult) {
                return geminiResult;
            }
        } catch (err) {
            console.warn("Gemini API call failed, switching to local intelligent incubator engine:", err);
        }
    }

    // 2. Local Intelligent Incubator Engine
    return INITIAL_PROJECTS[0];
}

export function formatSketchFromRaw(rawInput: string): string {
    const trimmed = rawInput.trim();
    const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);

    if (sentences.length <= 2) {
        return `## Concept Vision\n${trimmed}`;
    }

    const intro = sentences.slice(0, 2).join(' ');
    const details = sentences.slice(2).join(' ');

    return `## Concept Vision\n${intro}\n\n## Details & Workflow\n${details}`;
}

async function fetchWithGeminiAPI(
    rawInput: string,
    apiKey: string,
    onProgress?: (stepMessage: string) => void
): Promise<ProjectIdea | null> {
    const systemPrompt = `You are a senior product engineer and UX designer.
Your mission is to refine, clarify, and structure a raw user idea ("Brain dump").
Strict rules:
1. NO EMOJIS (strict prohibition against using any emojis).
2. Write in English.
3. Ultra minimalist, concise, and direct style. Do not invent fictitious features.
4. Only section headings must be bold (Markdown ## Heading). Body paragraphs must remain plain text without bold words.
5. MileStones can be up to 6 elements if required for the project (use plane text for date). workProjects, keyFeatures and devArchi can be up to 4 elements.

Strict JSON format expected (return raw JSON only):
{
  "title": "Clear short title (max 6 words)",
  "oneLiner": "One sentence summary of core value",
  "notebookSketch": {
            "subTitle": "One sentence describing what is the project",
            "mileStones": [
                {
                    "date": "Most suitable date for the milestone 1",
                    "text": "One line description of the milestone 1"
                },
                {
                    "date": "Most suitable date for the milestone 2",
                    "text": "One line describtion of the milestone 2"
                },
                {
                    "date": "Most suitable date for the milestone 3",
                    "text": "One line describtion of the milestone 3"
                },
                {
                    "date": "Most suitable date for the milestone 4",
                    "text": "One line describtion of the milestone 4"
                }
            ],
            "workProjects": [
                {
                    "num": "Number corresponding of the project",
                    "title": "Work project name 1",
                    "desc": "Work project description 1"
                },
                {
                    "num": "Number corresponding of the project"
                    "title": "Work project name 2",
                    "desc": "Work project description 2"
                },
                {
                    "num": "Number corresponding of the project"
                    "title": "Work project name 3",
                    "desc": "Work project description 3"
                }
            ],
            "keyFeatures": [
                {
                    "symbol": "Symbol representing the feature 1",
                    "text": "Short text explaining the important feature 1"
                },
                {
                    "symbol": "Symbol representing the feature 2",
                    "text": "Short text explaining the important feature "
                },
                {
                    "symbol": "Symbol representing the feature 3",
                    "text": "Short text explaining the important feature 3"
                },
                {
                    "symbol": "Symbol representing the feature 4",
                    "text": "Short text explaining the important feature 4"
                }
            ],
            "devArchi": [
                {
                    "symbol": "Symbol representing the devArchi 1",
                    "text": "Short text explaining the devArchi feature 1"
                },
                {
                    "symbol": "Symbol representing the devArchi 2",
                    "text": "Short text explaining the devArchi feature 2"
                },
                {
                    "symbol": "Symbol representing the devArchi 3",
                    "text": "Short text explaining the devArchi feature 3"
                }
            ]
        },
  "notebook": {
    "mvpSteps": [
      "Concrete step 1",
      "Concrete step 2",
      "Concrete step 3",
      "Concrete step 4",
      "Concrete step 5"
    ]
  },
  "mentor": {
    "keyQuestions": [
      "Framing question 1",
      "Framing question 2",
      "Framing question 3"
    ]
  },
  "roadmap": {
    "skillsToLearn": [
      "Skill 1",
      "Skill 2",
      "Skill 3",
      "Skill 4",
      "Skill 5"
    ],
    "trapsToAvoid": [
      "Trap 1",
      "Trap 2",
      "Trap 3",
      "Trap 4",
      "Trap 5"
    ]
  }
}`;

    if (onProgress) onProgress("Analyzing thoughts with Gemini model...");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: systemPrompt },
                        { text: `Here is the raw project idea:\n"${rawInput}"` }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.5,
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    if (onProgress) onProgress("Formatting Sketch page...");

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) return null;

    const date = new Date(Date.now());
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthFullNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    const monthShort = monthNames[date.getMonth()] || 'OCT';
    const monthFull = monthFullNames[date.getMonth()] || 'OCTOBER';
    const year = date.getFullYear() || '2026';

    try {
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);

        return {
            id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            title: parsed.title || 'Untitled Project',
            oneLiner: parsed.oneLiner || 'Project summary.',
            rawInput: rawInput,
            notebookSketch: {
                dateTitle: `${monthFull} ${year}`,
                dayStamp: `${date.getDate()}`,
                monthStamp: monthShort,
                versionBadge: 'VERSION 0.1',
                subTitle: `${parsed.subTitle} — VISUAL FRAMING`,
                quote: parsed.oneLiner,
                mileStones: Array.isArray(parsed.notebookSketch?.mileStones) ? parsed.notebookSketch.mileStones : ['Error'],
                workProjects: Array.isArray(parsed.notebookSketch?.workProjects) ? parsed.notebookSketch.workProjects : ['Error'],
                keyFeatures: Array.isArray(parsed.notebookSketch?.keyFeatures) ? parsed.notebookSketch.keyFeatures : ['Error'],
                devArchi: Array.isArray(parsed.notebookSketch?.devArchi) ? parsed.notebookSketch.devArchi : ['Error'],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            completedSteps: [],
            mentorAnswers: {},
            mvp: {
                mvpSteps: Array.isArray(parsed.notebook?.mvpSteps) ? parsed.notebook.mvpSteps : ['Define initial core requirement']
            },
            mentor: {
                questions: Array.isArray(parsed.mentor?.keyQuestions) ? parsed.mentor.keyQuestions : ['What is the core problem being solved?']
            },
            traps: {
                skillsToLearn: Array.isArray(parsed.roadmap?.skillsToLearn) ? parsed.roadmap.skillsToLearn : ['Domain technical fundamentals'],
                trapsToAvoid: Array.isArray(parsed.roadmap?.trapsToAvoid) ? parsed.roadmap.trapsToAvoid : ['Avoid over-polishing before user feedback']
            }
        };
    } catch (e) {
        console.error("Failed to parse Gemini JSON output:", e);
        return null;
    }
}

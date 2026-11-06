import type { ProjectIdea, Sketch } from "../types/project";

//Build the sketch content
export function buildNotebookSketchData(project: ProjectIdea): Sketch {
    if(project.notebookSketch){
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
        { symbol: 'symb1', text: 'REAL-TIME INPUT & STRUCTURE MANAGEMENT'},
        { symbol: 'symb2', text: 'PROJECT COHERENCE & RIGOR ALERTS'},
        { symbol: 'symb3', text: 'MULTI-DEVICE SYNC & LOCAL STORAGE'},
        { symbol: 'symb4', text: 'VISUAL NOTEBOOK EXPORT & RENDERING'}
    ];

    const devArchi = [
        { symbol: 'symb1', text: 'DATA EXTRACTION MODULE (VISION / AI)'},
        { symbol: 'symb2', text: 'MAIN CALCULATION ENGINE TESTING'},
        { symbol: 'symb3', text: 'REAL-TIME STREAMING VOICE DICTATION'}
    ];




    return {
        dateTitle: `${monthFull} ${year}`,
        subTitle: `${cleanTitle} — VISUAL FRAMING`,
        dayStamp: `${date.getDate()}`,
        monthStamp: monthShort,
        versionBadge: 'VERSION 0.4',
        mileStones,
        quote: project.oneLiner,
        workProjects,
        keyFeatures,
        devArchi
    };
}
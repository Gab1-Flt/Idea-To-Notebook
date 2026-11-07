import { useEffect, useState } from "react";
import { type TabType, type ProjectIdea } from "../types/project"
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, BookOpen, Check, CheckCircle2, Circle, Compass, Copy, Feather, FileText, GraduationCap, ShieldAlert, Star, Trash2 } from "lucide-react";
import { buildNotebookSketchData } from "../services/aiService";


interface ProjectViewProps {
    project: ProjectIdea;
    onUpdateProject: (updated: ProjectIdea) => void;
    onBackToHome: () => void;
    onDeleteProject: (deletedId: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
    project,
    onUpdateProject,
    onBackToHome,
    onDeleteProject
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('Sketch');
    const [copied, setCopied] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [editingAnswers, setEditingAnswers] = useState<Record<string, string>>(
        project.mentorAnswers || {}
    );

    useEffect(() => {
        setActiveTab('Sketch');
        setIsConfirmingDelete(false);
    }, [project.id]);

    const handleToggleFavorite = () => {
        onUpdateProject({
            ...project,
            isFavorite: !project.isFavorite
        })
    }

    const handleCopyMarkdown = () => {
        const md = `# ${project.title}
            > ${project.oneLiner}

            ## MVP Action Plan
            ${project.mvp.mvpSteps.map((step, i) => `${project.completedSteps?.includes(step) ? '[x]' : '[ ]'} ${i + 1}. ${step}`).join('\n')}

            ## Mentor & Framing Questions
            ${project.mentor.questions.map((q, i) => `### Q${i + 1}: ${q}\n*Answer:* ${project.mentorAnswers?.[i] || ''}`).join('\n\n')}

            ## Skills to Acquire
            ${project.traps.skillsToLearn.map(s => `- ${s}`).join('\n')}

            ## Traps to Avoid
            ${project.traps.trapsToAvoid.map(t => `- ${t}`).join('\n')}

            ---
            *Original Raw Idea:*
            ${project.rawInput}
            `;

        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'Sketch', label: 'Sketch', icon: Feather },
        { id: 'MVP', label: 'MVP', icon: BookOpen },
        { id: 'Mentor', label: 'Mentor', icon: Compass },
        { id: 'Traps', label: 'Traps & Prerequisites', icon: ShieldAlert },
        { id: 'Raw', label: 'Original Raw Idea', icon: FileText },
    ];

    const completedStepsCount = project.completedSteps?.length || 0;
    const totalStepsCount = project.mvp.mvpSteps.length;
    const progressPercentage = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

    const handleToggleStep = (stepText: string) => {
        const currentCompleted = project.completedSteps || [];
        let updated: string[];

        if (currentCompleted.includes(stepText)) {
            updated = currentCompleted.filter((s) => s !== stepText);
        } else {
            updated = [...currentCompleted, stepText];
        }

        onUpdateProject({
            ...project,
            completedSteps: updated,
            updatedAt: new Date().toISOString()
        });
    };

    const handleSaveMentorAnswer = (index: number, answer: string) => {
        const newAnswers = { ...editingAnswers, [index.toString()]: answer };
        setEditingAnswers(newAnswers);
        onUpdateProject({
            ...project,
            mentorAnswers: newAnswers,
            updatedAt: new Date().toISOString()
        });
    };

    const sketchData = buildNotebookSketchData(project);

    return (
        <div className="flex flex-1 flex-col overscroll-none w-full min-h-screen bg-[#f4f2ed] animate-fade-in overflow-auto">
            {/* Top Header Bar*/}
            <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-20">
                <motion.button
                    whileHover={{ scale: 1.04, x: -2 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={onBackToHome}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors focus-ring px-10 py-1.5 rounded-full hover:bg-neutral-100 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>New note</span>
                </motion.button>



                {/*Action buttons right*/}
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.75, rotate: 18 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={handleToggleFavorite}
                        className={`p-2 rounded-full border transition-all cursor-pointer ${project.isFavorite
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'bg-white border-neutral-200/80 text-neutral-400 hover:text-neutral-700'
                            }`}
                        title={project.isFavorite ? "Favorite" : "Add to favorites"}
                    >
                        <Star className={`w-3.5 h-3.5 ${project.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={handleCopyMarkdown}
                        className="p-2 rounded-full bg-white border border-neutral-200/80 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Copy"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </motion.button>

                    {isConfirmingDelete ? (
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onDeleteProject(project.id)}
                            onMouseLeave={() => setIsConfirmingDelete(false)}
                            className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                            Confirm?
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={() => setIsConfirmingDelete(true)}
                            className="p-2 rounded-full bg-white border border-neutral-200/80 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/*Navigation Bar Tabs*/}
            <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-4 flex items-center justify-center shadow-subtle sticky top-14 z-20">
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-full border border-neutral-200/80 overflow-x-auto max-w-full">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`relative flex items-center gap-2 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-colors duration-200 whitespace-nowrap focus-ring cursor-pointer ${isActive
                                    ? 'text-white'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                                    }`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-neutral-900 rounded-full shadow-xs z-0"
                                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <motion.span
                                        animate={{ scale: isActive ? 1.15 : 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </motion.span>
                                    <span>{tab.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/*Main Worksapce Container*/}
            <div className="flex-1 p-4 md:p-8 flex justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.995 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="w-full flex justify-center"
                    >
                        {/* TAB 0: SKETCH (Notebook Simulation) */}
                        {activeTab === 'Sketch' && (
                            <div className="w-full max-w-4xl">
                                {/* Physical Notebook Sheet Page */}
                                <div className="flex flex-col w-full bg-white notebook-dot-grid rounded-[2.5rem] p-6 md:p-12 shadow-notebook border border-neutral-300/80 relative space-y-7 font-hand">
                                    {/* Top Left Bookmark Tab */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, y: 2 }}
                                        whileTap={{ scale: 0.8 }}
                                        onClick={handleToggleFavorite}
                                        className={`absolute -top-1 left-10 w-5 h-8 rounded-b-xs shadow-xs z-10 flex items-center justify-center font-bold text-[10px] transition-colors cursor-pointer ${project.isFavorite
                                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                                            : 'bg-neutral-200 text-neutral-400 border-x border-b border-neutral-300/60 hover:bg-amber-100 hover:text-amber-600'
                                            }`}
                                        title={project.isFavorite ? "Favorite (click to remove)" : "Not favorite (click to add)"}
                                    >
                                        ★
                                    </motion.button>

                                    {/* Header Title & Date Stamp Box */}
                                    <div className="flex items-start justify-between gap-4 pt-2">
                                        <div className="space-y-1 flex-1">
                                            <h1 className="font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-wider uppercase font-hand leading-none">
                                                {sketchData.dateTitle}
                                            </h1>
                                            <p className="font-bold text-xs md:text-sm text-neutral-600 tracking-widest uppercase font-hand">
                                                {sketchData.subTitle}
                                            </p>
                                        </div>

                                        {/* Date Stamp Badge Box */}
                                        <div className="flex items-center gap-2.5 font-sans border border-rose-200 bg-rose-50/40 rounded-2xl p-2 shrink-0">
                                            <div className="border border-rose-400 rounded-xl px-3 py-1 text-center bg-white shadow-xs">
                                                <span className="block font-black text-xl leading-none text-neutral-900 font-mono">{sketchData.dayStamp}</span>
                                                <span className="block text-[9px] font-black text-rose-600 tracking-widest font-mono uppercase mt-0.5">{sketchData.monthStamp}</span>
                                            </div>
                                            <div className="text-[10px] space-y-0.5 font-hand">
                                                <span className="font-bold text-rose-600 flex items-center gap-1">
                                                    ★ {sketchData.versionBadge}
                                                </span>
                                                <span className="block text-neutral-500 font-medium">
                                                    Active Synthesis
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 1: KEY MILESTONES & TARGETS */}
                                    <div className="space-y-3 pt-2">
                                        <div className="text-rose-600 font-hand font-extrabold text-sm tracking-widest uppercase flex items-center gap-1">
                                            <span>✱ KEY MILESTONES & TARGETS ✱</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-hand text-xs md:text-sm font-bold text-neutral-800">
                                            {sketchData.mileStones.map((m, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-neutral-900 font-black">{m.date}</span>
                                                    <span className="text-neutral-900 font-extrabold">➔</span>
                                                    <span className="tracking-tight">{m.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quote Box Card */}
                                    <div className="my-6 p-4 md:p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle border-l-4 border-l-neutral-900 font-hand text-sm md:text-base font-medium italic text-neutral-800 leading-relaxed">
                                        "{sketchData.quote}"
                                    </div>

                                    {/* SECTION 2: WORK PROJECTS */}
                                    <div className="space-y-3">
                                        <div className="text-sky-600 font-hand font-extrabold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <span>WORK PROJECTS</span>
                                            <span className="flex-1 h-px bg-sky-200"></span>
                                        </div>

                                        <div className="space-y-3 font-hand">
                                            {sketchData.workProjects.map((wp, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed">
                                                    <span className="font-bold text-sky-700 text-sm shrink-0 mt-0.5">{wp.num}</span>
                                                    <div>
                                                        <strong className="font-bold text-neutral-900 uppercase tracking-tight">{wp.title}</strong>
                                                        <span className="text-neutral-400 mx-1.5">—</span>
                                                        <span className="font-medium text-neutral-700">{wp.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    {/* SECTION 3: KEY FEATURES & ACTIONS */}
                                    <div className="space-y-3 pt-2">
                                        <div className="text-emerald-700 font-hand font-extrabold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <span>KEY FEATURES & ACTIONS</span>
                                            <span className="flex-1 h-px bg-emerald-200"></span>
                                        </div>

                                        <div className="space-y-2 font-hand text-xs md:text-sm">
                                            {sketchData.keyFeatures.map((kf, idx) => (
                                                <div key={idx} className="flex items-center justify-between pb-1.5 border-b border-dashed border-neutral-200/90">
                                                    <span className="font-bold text-neutral-800 tracking-tight">{kf.text}</span>
                                                    <div className="flex items-center gap-1.5 font-mono text-emerald-700">
                                                        {/*Array.from({ length: kf.boxesCount }).map((_, i) => (
                                                <span key={i} className="inline-block w-3.5 h-3.5 border border-emerald-600 rounded-xs"></span>
                                                ))*/}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION 4: DEVELOPMENT & ARCHITECTURE */}
                                    <div className="space-y-3 pt-2">
                                        <div className="text-amber-700 font-hand font-extrabold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <span>DEVELOPMENT & ARCHITECTURE</span>
                                            <span className="flex-1 h-px bg-amber-200"></span>
                                        </div>

                                        <div className="space-y-2 font-hand text-xs md:text-sm">
                                            {sketchData.devArchi.map((da, idx) => (
                                                <div key={idx} className="flex items-center justify-between pb-1.5 border-b border-dashed border-neutral-200/90">
                                                    <span className="font-bold text-neutral-800 tracking-tight">{da.text}</span>
                                                    <div className="flex items-center gap-1.5 font-mono text-rose-500">
                                                        {/*Array.from({ length: da.boxesCount }).map((_, i) => (
                                                <span key={i} className="inline-block w-3.5 h-3.5 border border-rose-400 rounded-xs"></span>
                                                ))*/}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* TAB 1: NOTEBOOK */}
                        {activeTab === 'MVP' && (
                            <div className="w-full max-w-4xl space-y-8 animate-fade-in font-sans">
                                <div className="paper-card rounded-3xl p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                                        <h2 className="text-base font-bold text-neutral-900">
                                            MVP Action Plan
                                        </h2>

                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-neutral-500">
                                                {completedStepsCount}/{totalStepsCount} ({progressPercentage}%)
                                            </span>
                                            <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {project.mvp.mvpSteps.map((step, idx) => {
                                            const isDone = project.completedSteps?.includes(step);
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleToggleStep(step)}
                                                    className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer ${isDone
                                                        ? 'bg-emerald-50/40 border-emerald-200/60 text-emerald-900 line-through opacity-80 font-normal'
                                                        : 'bg-white border-neutral-200/70 hover:border-neutral-400 text-neutral-800 font-normal'
                                                        }`}
                                                >
                                                    <button className="mt-0.5 shrink-0 text-neutral-300 hover:text-emerald-600">
                                                        {isDone ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-neutral-300" />
                                                        )}
                                                    </button>

                                                    <div className="flex-1 text-xs md:text-sm leading-snug font-normal">
                                                        <span className="font-mono text-neutral-400 mr-2">0{idx + 1}.</span>
                                                        {step}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: MENTOR */}
                        {activeTab === 'Mentor' && (
                            <div className="w-full max-w-4xl space-y-6 animate-fade-in font-sans">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
                                        Framing Questions
                                    </h3>

                                    <div className="space-y-4">
                                        {project.mentor.questions.map((q, idx) => {
                                            const answer = editingAnswers[idx.toString()] || '';

                                            return (
                                                <div
                                                    key={idx}
                                                    className="paper-card rounded-2xl p-5 space-y-3"
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                            Q{idx + 1}
                                                        </span>
                                                        <h4 className="text-xs md:text-sm font-normal text-neutral-900 leading-snug">
                                                            {q}
                                                        </h4>
                                                    </div>

                                                    <div className="pl-8">
                                                        <textarea
                                                            value={answer}
                                                            onChange={(e) => handleSaveMentorAnswer(idx, e.target.value)}
                                                            placeholder="Write your answer..."
                                                            className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 font-normal focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none h-20 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: TRAPS & PREREQUISITES */}
                        {activeTab === 'Traps' && (
                            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in font-sans">
                                <div className="paper-card rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-neutral-900">
                                        <GraduationCap className="w-4 h-4 text-neutral-700" />
                                        <h3 className="font-bold text-sm">
                                            Skills to Acquire (5)
                                        </h3>
                                    </div>

                                    <ul className="space-y-2.5">
                                        {project.traps.skillsToLearn.map((skill, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-neutral-700 font-normal leading-relaxed">
                                                <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span>{skill}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="paper-card rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-neutral-900">
                                        <AlertTriangle className="w-4 h-4 text-neutral-700" />
                                        <h3 className="font-bold text-sm">
                                            Traps to Avoid (5)
                                        </h3>
                                    </div>

                                    <ul className="space-y-2.5">
                                        {project.traps.trapsToAvoid.map((trap, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-neutral-700 font-normal leading-relaxed">
                                                <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span>{trap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: ORIGINAL RAW IDEA */}
                        {activeTab === 'Raw' && (
                            <div className="w-full max-w-4xl animate-fade-in font-sans">
                                <div className="paper-card rounded-3xl p-6 md:p-8 space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                            Original Raw Input
                                        </h3>
                                        <span className="text-[11px] font-mono text-neutral-400">
                                            {project.rawInput.length} chars.
                                        </span>
                                    </div>

                                    <div className="bg-neutral-50/70 rounded-2xl p-5 border border-neutral-200/80">
                                        <p className="text-xs md:text-sm text-neutral-800 leading-relaxed font-mono whitespace-pre-wrap">
                                            {project.rawInput}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
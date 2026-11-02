import { useEffect, useState } from "react";
import { type TabType, type ProjectIdea } from "../types/project"
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Check, Compass, Copy, Feather, FileText, ShieldAlert, Star, Trash2 } from "lucide-react";


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
    
    return (
        <div className="flex flex-1 flex-col w-full min-h-screen bg-[#f4f2ed] animate-fade-in">
            {/* Top Header Bar*/}
            <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-3">
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
            <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 md:px-8 py-4 flex items-center justify-center sticky top-13.25 z-20 shadow-subtle">
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
                                <div className="bg-white notebook-dot-grid rounded-[2.5rem] p-6 md:p-12 shadow-notebook border border-neutral-300/80 relative space-y-7 font-hand">
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
                                    
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
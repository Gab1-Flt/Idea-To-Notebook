import { useState } from 'react';
import type { ProjectIdea } from '../types/project';
import { BookOpen, FileText, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, Star, Trash2 } from 'lucide-react';
import {motion, spring} from 'framer-motion';

interface SidebarProps {
    projectList: ProjectIdea[];
    activeProjectId: string | null;
    onSelectProject: (id: string) => void
    onNewProject: () => void;
    onDeleteProjecte: (id: string) => void;
    onToggleFavorite: (id:string) => void;
    isOpen: boolean;
    onToggleOpen: () => void;
    onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    projectList,
    activeProjectId,
    onSelectProject,
    onNewProject,
    onDeleteProjecte,
    onToggleFavorite,
    isOpen,
    onToggleOpen,
    onOpenSettings
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFavorite, setFilterFavorite] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const filteredProjects = projectList.filter((p) => {
        const matchesSearch = 
            p.title.toLocaleLowerCase().includes(searchQuery.toLowerCase()) ||
            p.oneLiner.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            p.rawInput.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());

        const matchesFavorite = filterFavorite ? p.isFavorite : true;
        return matchesSearch && matchesFavorite;
    });

    const formatDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch {
            return '';
        }
    };

    return (
        <>
            {/** Mobile blure*/}
            {isOpen && (
                <div className='fixed inset-0 bg-neutral-900/10 backdrop-blur-xs z-30 md:hidden'
                onClick={onToggleOpen}/>
            )}

            <aside className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-[#f5f5f7]/90 backdrop-blur-md border-r border-neutral-200/80 transition-all duration-350 ease-in-out ${
            isOpen ? 'w-80 translate-x-0 overflow-hidden' : 'w-0 -translate-x-full border-r-0 md:border-r-0 md:w-0 md:translate-x-0 overflow-hidden'
            }`}
            >
                {isOpen && (
                    <div className='flex flex-col h-full w-80 p-4'>
                        {/*Header Sidebar*/}
                        <div className='flex items-center justify-between pb-3 mb-2 border-b border-neutral-200/60'>
                            <div className='flex items-center gap-2.5'>
                                <div className='w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs'>
                                    <BookOpen className='w-4 h-4'/>
                                </div>
                                <div>
                                    <h1 className='font-semibold text-sm tracking-tight text-neutral-900'>BrainOut</h1>
                                    <p className='text-xs text-neutral-500 font-medium'>Notebook generator</p>
                                </div>
                            </div>

                            <button onClick={onToggleOpen} 
                            className='p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors rounded-full focus-ring' 
                            title='Hide sidebar'>
                                <PanelLeftClose className='w-4 h-4'/>
                            </button>
                        </div>

                        {/*Main Button 'New Idea'*/}
                        <motion.button
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.94}}
                        transition={{type:"spring", stiffness: 250, damping: 25}}
                        onClick={onNewProject}
                        className='w-full mt-1 mb-4 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs flex items-center justify-center text-white font-medium gap-2 text-xs tracking-wide focus-ring rounded-full group cursor-pointer'
                        >
                            <Plus className='w-4 h-4 group-hover:rotate-90 transition-transform duration-200'/>
                            <span>New raw idea</span>
                            <span className='ml-auto bg-neutral-700/50 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full font-mono'>Cmd + K</span>
                        </motion.button>

                        {/*Search + Fav filter*/}
                        <div className='space-y-2 mb-3'>
                            <div className='relative'>
                                <Search className='w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400'/>
                                <input type="text" 
                                placeholder='Search an idea...'
                                value={searchQuery}
                                onChange={(e)=> setSearchQuery(e.target.value)}
                                className='w-full pl-8 pr-3 py-1.5 bg-white/80 border border-neutral-200/90 rounded-full text-xs placeholder:text-neutral-400 text-neutral-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-all'
                                />
                            </div>

                            <div className='flex justify-between items-center px-1'>
                                <span className='font-medium text-neutral-400 text-xs uppercase tracking-wider'>
                                    projects ({filteredProjects.length})
                                </span>
                                <button 
                                className={`px-2 py-0.5 flex items-center gap-1 font-medium text-[11px] rounded-full transition-colors
                                ${filterFavorite?'bg-amber-100/80 text-amber-800' : 'text-neutral-400 hover:text-neutral-600'}`}
                                onClick={() => setFilterFavorite(!filterFavorite)}
                                title='Filter favorites'
                                >
                                    <Star className={`w-3 h-3 ${filterFavorite? 'text-amber-500 fill-amber-500' : 'text-neutal-400'}`}/>
                                    <span>Favorite</span>
                                </button>
                            </div>
                        </div>

                        {/*Projevct List*/}
                        <div>
                            {filteredProjects.length === 0 ? (
                                <div className='mt-50 space-y-3'>
                                    <FileText className='w-9 h-9 text-neutral-300 mx-auto mb-2'/>
                                    <p className='flex text-s text-neutral-500 justify-center'>No projects found...</p>
                                    <p className='flex text-s text-neutral-500 justify-center'>{searchQuery ? "Change your search term." : "Start by unloading your thoughts."}</p>
                                </div>
                            ) : (
                                filteredProjects.map((project) => {
                                    const isActive = project.id === activeProjectId;
                                    const totalSteps = project.mvp.mvpSteps.length;
                                    const completedSteps = project.completedSteps?.length || 0;
                                    const isCompleted = totalSteps > 0 && completedSteps === totalSteps;
                                    const isDeletingThis = confirmDeleteId === project.id    

                                    return (
                                        <motion.div
                                            key={project.id}
                                            onClick={() => onSelectProject(project.id)}
                                            whileHover={{x:3, scale: 1.01}}
                                            whileTap={{scale: 0.97}}
                                            transition={{type: spring, stiffness:400, damping: 25}}
                                            className={`group relative flex flex-col p-3 rounded-2xl bg-amber-300 transition-all duration-150 cursor-pointer border
                                                ${isActive? 'bg-white border-neutral-300/90 shadow-xs text-neutral-900' 
                                                : 'bg-transparent border-transparent hover:bg-white/60 hover:text-neutral-900'
                                            }`}
                                        >
                                            <div className='flex items-start justify-between gap-2'>
                                                <h3 className='text-xs font-medium leading-snug line-clamp-1 flex-1'>{project.title}</h3>
                                                
                                                <button
                                                onClick={(e)=> {
                                                    e.stopPropagation();
                                                    onToggleFavorite(project.id);
                                                }}
                                                className={`rounded-full hover:bg-neutral-100 transition-colors 
                                                    ${project.isFavorite? 'opacity-100' : 'opacity-0 group-hover: opacity-100'}`}
                                                >
                                                    <Star className={`w-3.5 h-3.5 
                                                    ${project.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-neutral-300 hover:text-neutral-500'}`}
                                                    />
                                                </button>
                                            </div>

                                            <p className='text-[11px] text-neutral-500 line-clamp-1 mt-1 font-normal'>{project.oneLiner}</p>
                                            
                                            <div className='flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100/80 text-[10px] text-neutral-400'>
                                                <span>{formatDate(project.createdAt)}</span>

                                                <div className='flex items-center gap-2'>
                                                    {totalSteps > 0 && (
                                                        <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] 
                                                        ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'text-neutral-500'}`}>
                                                            {completedSteps}/{totalSteps} MVP
                                                        </span>
                                                    )}

                                                    {isDeletingThis? 
                                                        (<button 
                                                        onClick={(e) => {e.stopPropagation(); onDeleteProjecte(project.id); setConfirmDeleteId(null)}}
                                                        onMouseLeave={() => setConfirmDeleteId(null)}
                                                        className='px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-medium hover:bg-rose-200 transition-colors'
                                                        title="Click to confirm deletion">
                                                            Confirm?
                                                        </button>) : (
                                                        <button 
                                                        onClick={(e) => {e.stopPropagation(); setConfirmDeleteId(project.id)}}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-300 hover:text-rose-600 transition-opacity"
                                                        title="Delete">
                                                            <Trash2 className='w-3 h-3'/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>

                        {/*Footer & Settings*/}
                        <div className="mt-auto pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500">
                            <button onClick={onOpenSettings}
                            className='flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-white/80 transition-colors text-neutral-600 font-medium focus-ring'
                            >
                                <Settings className='w-4 h-4'/>
                                <span className='text-xs'>Settings & API Key</span>
                            </button>
                        </div>
                    </div>
                )}
            </aside>
            
            {/*Button when sibebar is closed*/}
            {!isOpen && (
                <button
                onClick={onToggleOpen}
                className="fixed top-4 left-4 z-20 p-2.5 bg-white/90 backdrop-blur-md border border-neutral-200/90 rounded-full shadow-subtle hover:bg-neutral-50 transition-all text-neutral-700 focus-ring"
                title="Open sidebar">
                    <PanelLeftOpen className='w-4 h-4'/>
                </button>
            )}
        </>
    );
};
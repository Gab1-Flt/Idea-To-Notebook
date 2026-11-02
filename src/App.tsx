import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar';
import './index.css'
import { INITIAL_PROJECTS } from './data/mockProjects';
import { BrainDumpZone } from './components/BrainDumpZone';
import { ProjectView } from './components/ProjectView';
import { type ProjectIdea } from './types/project';

export const App: React.FC = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeProjectId, setActiveProjectID] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectIdea[]>(()=>{
    try {
      const saved = localStorage.getItem('notebook_projects');
      if (saved){
        const parsed = JSON.parse(saved);
        if(Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load data from localStorage :", e);
    }
    return INITIAL_PROJECTS;
  })

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className='min-h-screen flex'>
      <Sidebar projectList={INITIAL_PROJECTS} isOpen={isSidebarOpen} activeProjectId={activeProjectId} onSelectProject={(id) => setActiveProjectID(id)} onDeleteProjecte={()=>{}} onNewProject={()=>setActiveProjectID(null)} onOpenSettings={()=>{}} onToggleFavorite={()=>{}} onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}/>
      {activeProject ? (
        <ProjectView project={activeProject} onBackToHome={() => {}} onUpdateProject={() => {}}/>
      ) : (
        <BrainDumpZone onSubmitIdea={async (rawInput) => { await null; }} isLoading={false} loadingProgressBar='' />
      )}
      
      
    </div> 
  )
};

export default App

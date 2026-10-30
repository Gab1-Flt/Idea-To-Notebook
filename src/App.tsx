import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar';
import './index.css'
import { INITIAL_PROJECTS } from './data/mockProjects';
import { BrainDumpZone } from './components/BrainDumpZone';

export const App: React.FC = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='min-h-screen flex'>
      <Sidebar projectList={INITIAL_PROJECTS} isOpen={isSidebarOpen} activeProjectId={null} onSelectProject={()=>{}} onDeleteProjecte={()=>{}} onNewProject={()=>{}} onOpenSettings={()=>{}} onToggleFavorite={()=>{}} onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <BrainDumpZone onSubmitIdea={async (rawInput) => { await null; }} isLoading={false} loadingProgressBar='' />
    </div>
  )
};

export default App

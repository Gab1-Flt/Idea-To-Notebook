import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar';
import './index.css'
import { INITIAL_PROJECTS } from './data/mockProjects';

export const App: React.FC = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='min-h-screen flex'>
      <Sidebar projectList={INITIAL_PROJECTS} isOpen={isSidebarOpen} activeProjectId={null} onSelectProject={()=>{}} onDeleteProjecte={()=>{}} onNewProject={()=>{}} onOpenSettings={()=>{}} onToggleFavorite={()=>{}} onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className='w-1/4 bg-amber-200'>Left Container</div>
      <div className='w-3/4 bg-blue-500'>Right Container</div>
    </div>
  )
};

export default App

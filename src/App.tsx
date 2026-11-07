import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar';
import './index.css'
import { INITIAL_PROJECTS } from './data/mockProjects';
import { BrainDumpZone } from './components/BrainDumpZone';
import { ProjectView } from './components/ProjectView';
import { type ProjectIdea } from './types/project';
import { SettingsModal } from './components/SettingsModal';
import { generateProjectIdeaFromRawText } from './services/aiService';

export const App: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeProjectId, setActiveProjectID] = useState<string | null>(null);

  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('notebook_gemini_api_key') || '';
  });

  const [projects, setProjects] = useState<ProjectIdea[]>(() => {
    try {
      const saved = localStorage.getItem('notebook_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load data from localStorage :", e);
    }
    return INITIAL_PROJECTS;
  })

  // Update a project
  const handleUpdateProject = (updated: ProjectIdea) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleDeleteProject = (deletedId: string) => {
    setProjects((prev) => prev.filter((p) => (p.id !== deletedId)));
  }

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('notebook_gemini_api_key', key);
  }

  const handleImportProjects = (imported: ProjectIdea[]) => {
    setProjects(imported);
    if (imported.length > 0) {
      setActiveProjectID(imported[0].id)
    }
  }

  const handleSubmitIdea = async (rawInput: string) => {
    setIsLoading(true);
    setLoadingStep("Initializing analysis...");

    try {
      if (apiKey) {
        const newProject = await generateProjectIdeaFromRawText(
          rawInput,
          apiKey,
          (step) => setLoadingStep(step)
        );

        setProjects((prev) => [newProject, ...prev]);
        setActiveProjectID(newProject.id);
      }
      else {
        setIsSettingOpen(true);
      }

    } catch (err: any) {
      console.error("Structuring error:", err);
      alert(err.message || "An error occurred while structuring the idea.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className='flex h-screen bg-[#fafafa] overflow-hidden text-neutral-900 font-sans selection:bg-neutral-200'>
      <Sidebar projectList={projects} isOpen={isSidebarOpen} activeProjectId={activeProjectId} onSelectProject={(id) => setActiveProjectID(id)} onDeleteProjecte={handleDeleteProject} onNewProject={() => setActiveProjectID(null)} onOpenSettings={() => setIsSettingOpen(true)} onToggleFavorite={handleToggleFavorite} onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {activeProject ? (
          <ProjectView project={activeProject} onBackToHome={() => setActiveProjectID(null)} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} />
        ) : (
          <BrainDumpZone onSubmitIdea={handleSubmitIdea} isLoading={isLoading} loadingProgressBar={loadingStep} />
        )}
      </main>

      <SettingsModal isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} apiKey={apiKey} onSaveApi={handleSaveApiKey} projects={projects} onImportProjects={handleImportProjects} />

    </div>
  )
};

export default App

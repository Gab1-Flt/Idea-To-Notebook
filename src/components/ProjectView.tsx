import { useEffect, useState } from "react";
import { type TabType, type ProjectIdea } from "../types/project"


interface ProjectViewProps {
    project: ProjectIdea;
    onUpdateProject: (updated: ProjectIdea) => void;
    onBackToHome: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
    project,
    onUpdateProject,
    onBackToHome
}) => {
    const [activeTab, setActiveTab] = useState<TabType>("Sketch");
    const [copied, setCopied] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    useEffect(() => {
        setActiveTab("Sketch");
        setIsConfirmingDelete(false);
    }, [project.id]);

    
    return (
        <div>
            
        </div>
    )
}
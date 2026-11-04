import { AnimatePresence, motion } from 'framer-motion';
import type { ProjectIdea } from '../types/project';
import { useState } from 'react';
import { Check, Download, Info, Key, Upload, X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    onSaveApi: (key: string) => void;
    projects: ProjectIdea[];
    onImportProjects: (imported: ProjectIdea[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    apiKey,
    onSaveApi,
    projects,
    onImportProjects
}) => {
    const [inputKey, setInputKey] = useState(apiKey);
    const [savedSuccess, setSavedSuccess]= useState(false);

    const handleSave = () => {
        onSaveApi(inputKey.trim());
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
    }

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `notebook_projects_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target?.result as string);
                    if (Array.isArray(parsed)) {
                        onImportProjects(parsed);
                        alert(`Success: ${parsed.length} project(s) imported!`);
                    } else {
                        alert("Invalid JSON format. File must contain an array of projects.");
                    }
                } catch (err) {
                    alert("Error reading JSON file.");
                }
            };
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >

                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-white rounded-4xl max-w-lg w-full p-6 md:p-8 shadow-float border border-neutral-200 space-y-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >


                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                                    <Key className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-base text-neutral-900">
                                        Settings & API Key
                                    </h2>
                                    <p className="text-xs text-neutral-500">
                                        Configure Gemini AI or manage your backups.
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus-ring cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Gemini API Key Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
                                <span>Google Gemini API Key (Optional):</span>
                                <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-600 hover:underline text-[11px] font-medium flex items-center gap-1"
                                >
                                    <Info className="w-3 h-3" /> Get a free key
                                </a>
                            </label>

                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full px-4 py-2.5 rounded-full bg-neutral-50 border border-neutral-200/90 text-xs font-mono text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-all"
                            />

                            <div className="flex items-center justify-between pt-1">
                                <p className="text-[11px] text-neutral-400 leading-snug">
                                If no key is provided, the app runs incubation using the offline intelligent engine.
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.93 }}
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors shrink-0 flex items-center gap-1.5 focus-ring cursor-pointer"
                                >
                                    {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                                    <span>{savedSuccess ? 'Saved!' : 'Save'}</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Backup & Data Management */}
                        <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <h3 className="text-xs font-semibold text-neutral-800">
                                Data Management ({projects.length} projects)
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleExportJSON}
                                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
                                >
                                    <Download className="w-4 h-4 text-neutral-500" />
                                    <span>Export JSON</span>
                                </motion.button>

                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-4 h-4 text-neutral-500" />
                                    <span>Import JSON</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportJSON}
                                        className="hidden"
                                    />
                                </motion.label>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
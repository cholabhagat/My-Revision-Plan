import React, { useState } from 'react';
import { suggestTopics } from '../services/gemini';
import { SparklesIcon, XMarkIcon } from './Icons';
import { REVISION_INTERVALS } from '../hooks/constants';

interface SuggestTopicsModalProps {
    onClose: () => void;
    onAddTopics: (titles: string[], intervals: number[], tags: string[]) => void;
}

const SuggestTopicsModal: React.FC<SuggestTopicsModalProps> = ({ onClose, onAddTopics }) => {
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});

    const handleGenerate = async () => {
        if (!subject.trim()) {
            setError('Please enter a subject.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestedTopics([]);
        setSelectedTopics({});

        try {
            const topics = await suggestTopics(subject);
            setSuggestedTopics(topics);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleTopic = (topic: string) => {
        setSelectedTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };
    
    const handleAddSelected = () => {
        const topicsToAdd = Object.keys(selectedTopics).filter(topic => selectedTopics[topic]);
        if (topicsToAdd.length > 0) {
            // For simplicity, we add the subject as a tag and use default intervals.
            // This could be made more configurable.
            onAddTopics(topicsToAdd, REVISION_INTERVALS, [subject.trim()]);
        }
    };
    
    const numSelected = Object.values(selectedTopics).filter(Boolean).length;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-indigo-400"/>
                        Suggest Topics with AI
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700" aria-label="Close">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                            Enter a broad subject (e.g., "React Hooks", "Italian Renaissance Art")
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What do you want to learn about?"
                                className="flex-grow bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait transition-colors"
                            >
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>

                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto"></div>
                            <p className="mt-4 text-slate-400">AI is thinking...</p>
                        </div>
                    )}

                    {suggestedTopics.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium text-slate-200 mb-3">Suggested Topics:</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto p-3 bg-slate-900/50 rounded-md border border-slate-700">
                                {suggestedTopics.map((topic, index) => (
                                    <label key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedTopics[topic]}
                                            onChange={() => handleToggleTopic(topic)}
                                            className="h-5 w-5 rounded border-slate-500 text-indigo-600 bg-slate-800 focus:ring-indigo-500"
                                        />
                                        <span className="text-slate-300">{topic}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-lg">
                    <button
                        onClick={handleAddSelected}
                        disabled={numSelected === 0}
                        className="bg-emerald-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-emerald-500 disabled:bg-emerald-800/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Add {numSelected > 0 ? `${numSelected} ` : ''}Selected Topics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestTopicsModal;
import React, { useState, useMemo } from 'react';
import { RevisionItem } from '../types';
import { XMarkIcon, SitemapIcon, PlusIcon, TrashIcon } from './Icons';

interface PrerequisiteEditorModalProps {
    item: RevisionItem;
    allItems: RevisionItem[];
    onClose: () => void;
    onSave: (itemId: string, newPrereqIds: string[]) => void;
}

const PrerequisiteEditorModal: React.FC<PrerequisiteEditorModalProps> = ({ item, allItems, onClose, onSave }) => {
    const [selectedPrereqIds, setSelectedPrereqIds] = useState<string[]>(item.prerequisiteIds || []);
    const [searchQuery, setSearchQuery] = useState('');

    const availableTopics = useMemo(() => {
        // Exclude current item, its direct children, and already selected prerequisites
        const excludedIds = new Set([item.id, ...selectedPrereqIds]);
        // Basic circular dependency prevention: also exclude items that depend on this one
        allItems.forEach(i => {
            if (i.prerequisiteIds?.includes(item.id)) {
                excludedIds.add(i.id);
            }
        });

        return allItems.filter(i => 
            !excludedIds.has(i.id) &&
            !i.archivedAt &&
            i.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a,b) => a.title.localeCompare(b.title));
    }, [item, allItems, selectedPrereqIds, searchQuery]);

    const selectedTopics = useMemo(() => {
        return selectedPrereqIds.map(id => allItems.find(i => i.id === id)).filter((i): i is RevisionItem => !!i);
    }, [selectedPrereqIds, allItems]);

    const handleAdd = (id: string) => {
        setSelectedPrereqIds(prev => [...prev, id]);
    };
    
    const handleRemove = (id: string) => {
        setSelectedPrereqIds(prev => prev.filter(prereqId => prereqId !== id));
    };

    const handleSave = () => {
        onSave(item.id, selectedPrereqIds);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <SitemapIcon className="w-6 h-6 text-indigo-400"/>
                        Manage Dependencies
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700" aria-label="Close">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <p className="text-slate-400">Set topics that must be mastered before <strong className="text-slate-200">"{item.title}"</strong> can be reviewed.</p>
                    
                    {/* Current Prerequisites */}
                    <div>
                        <h3 className="font-semibold text-slate-300 mb-2">Current Prerequisites ({selectedTopics.length})</h3>
                        <div className="p-3 bg-slate-900/50 rounded-md border border-slate-700 space-y-2 min-h-[4rem]">
                            {selectedTopics.length > 0 ? selectedTopics.map(topic => (
                                <div key={topic.id} className="flex items-center justify-between bg-slate-800 p-2 rounded-md">
                                    <span className="text-slate-200">{topic.title}</span>
                                    <button onClick={() => handleRemove(topic.id)} className="p-1 text-slate-400 hover:text-red-400" title="Remove Prerequisite">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-2">No prerequisites set.</p>}
                        </div>
                    </div>

                    {/* Add Prerequisites */}
                    <div>
                        <h3 className="font-semibold text-slate-300 mb-2">Add a Prerequisite</h3>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a topic to add..."
                            className="w-full bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 mb-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                        />
                         <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                            {availableTopics.length > 0 ? availableTopics.slice(0, 50).map(topic => ( // Limit to 50 results for performance
                                <div key={topic.id} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md group">
                                    <span className="text-slate-300">{topic.title}</span>
                                    <button onClick={() => handleAdd(topic.id)} className="p-1 text-slate-400 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Add as Prerequisite">
                                        <PlusIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-2">No available topics match your search.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-lg gap-2">
                    <button onClick={onClose} className="bg-slate-700 text-slate-300 font-semibold py-2 px-5 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-500 transition-colors">Save Dependencies</button>
                </div>
            </div>
        </div>
    );
};

export default PrerequisiteEditorModal;
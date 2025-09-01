
import React, { useState } from 'react';
import { LightbulbIcon, PlusIcon, TrashIcon, ArrowUpCircleIcon, BoltIcon } from './Icons';

interface InboxProps {
    items: string[];
    onAddItem: (title: string) => void;
    onRemoveItem: (index: number) => void;
    onPromoteItem: (title: string, index: number) => void;
    onPromoteAll: () => void;
}

const Inbox: React.FC<InboxProps> = ({ items, onAddItem, onRemoveItem, onPromoteItem, onPromoteAll }) => {
    const [newItem, setNewItem] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAddItem(newItem.trim());
            setNewItem('');
        }
    };
    
    if (!isOpen && items.length === 0) {
       return (
         <div className="mb-8 text-center">
            <button onClick={() => setIsOpen(true)} className="text-slate-400 hover:text-indigo-400 font-semibold text-sm flex items-center gap-2 mx-auto">
                <LightbulbIcon className="w-5 h-5"/>
                <span>Have an idea? Open Brain Dump Inbox</span>
            </button>
         </div>
       )
    }

    return (
        <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-300">
                    <LightbulbIcon className="w-6 h-6 text-yellow-400"/>
                    Brain Dump Inbox
                </h3>
                <span className="text-sm font-medium bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">{items.length}</span>
            </button>
            
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add a quick idea..."
                            className="flex-grow bg-slate-900/80 border border-slate-600 rounded-md py-2 px-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button type="submit" className="flex-shrink-0 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 disabled:opacity-50" disabled={!newItem.trim()}>
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </form>
                    {items.length > 0 && (
                        <>
                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {items.map((item, index) => (
                                    <li key={index} className="flex items-center justify-between gap-2 p-2 rounded-md bg-slate-800 group">
                                        <span className="text-slate-300 text-sm">{item}</span>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onPromoteItem(item, index)} className="p-1 text-slate-400 hover:text-emerald-400" title="Promote to Topic">
                                                <ArrowUpCircleIcon className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => onRemoveItem(index)} className="p-1 text-slate-400 hover:text-red-400" title="Remove from Inbox">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-2 border-t border-slate-700/50">
                                <button onClick={onPromoteAll} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors py-2 rounded-md hover:bg-slate-700/50">
                                    <BoltIcon className="w-5 h-5"/>
                                    Promote All ({items.length}) to Topics
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inbox;

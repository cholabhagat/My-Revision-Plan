
import React, { useState } from 'react';
import { XMarkIcon, PlayCircleIcon } from './Icons';

interface SessionConfigModalProps {
    dueItemsCount: number;
    onStart: (limit?: number) => void;
    onClose: () => void;
}

const SessionConfigModal: React.FC<SessionConfigModalProps> = ({ dueItemsCount, onStart, onClose }) => {
    const [customLimit, setCustomLimit] = useState(10);

    const handleCustomStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (customLimit > 0) {
            onStart(customLimit);
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <PlayCircleIcon className="w-6 h-6 text-indigo-400"/>
                        Start Review Session
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700" aria-label="Close">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-300">You have <strong>{dueItemsCount}</strong> item(s) due for review.</p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => onStart()}
                            className="w-full text-left p-4 rounded-lg border-2 border-slate-600 hover:border-indigo-500 bg-slate-900/50 transition-colors"
                        >
                            <h3 className="font-semibold text-slate-100">Review All Due Items</h3>
                            <p className="text-sm text-slate-400">Go through all {dueItemsCount} items that are currently due or overdue.</p>
                        </button>
                        <div 
                            className="w-full text-left p-4 rounded-lg border-2 border-slate-600 bg-slate-900/50"
                        >
                            <h3 className="font-semibold text-slate-100">Review a Batch</h3>
                            <p className="text-sm text-slate-400 mb-3">Review just the most overdue items.</p>
                             <div className="flex items-center gap-2 mb-3">
                                <button onClick={() => onStart(10)} className="flex-1 bg-slate-700 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={dueItemsCount < 1}>10 items</button>
                                <button onClick={() => onStart(20)} className="flex-1 bg-slate-700 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={dueItemsCount < 10}>20 items</button>
                                <button onClick={() => onStart(50)} className="flex-1 bg-slate-700 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={dueItemsCount < 20}>50 items</button>
                             </div>
                             <form onSubmit={handleCustomStart} className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={customLimit}
                                    onChange={e => setCustomLimit(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max={dueItemsCount}
                                    className="w-24 bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-slate-200"
                                    disabled={dueItemsCount < 1}
                                />
                                <button type="submit" className="flex-1 bg-slate-700 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={dueItemsCount < 1}>
                                    Review Custom
                                </button>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionConfigModal;

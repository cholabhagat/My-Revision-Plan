
import React, { useState, useMemo } from 'react';
import { RevisionItem } from '../types';
import { getDaysUntil, formatDate } from '../utils/date';
import { XMarkIcon, CheckCircleIcon, DocumentTextIcon } from './Icons';

interface SessionModalProps {
    mode: 'review' | 'cram';
    sessionItems: RevisionItem[];
    tag?: string;
    onClose: () => void;
    onCompleteItem?: (id: string, confidence: 'hard' | 'good' | 'easy') => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ mode, sessionItems, tag, onClose, onCompleteItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (sessionItems.length === 0) {
        return (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-lg text-center p-8">
                    <CheckCircleIcon className="w-12 h-12 mx-auto text-emerald-400 mb-4"/>
                    <h2 className="text-xl font-semibold text-slate-200">All Caught Up!</h2>
                    <p className="text-slate-400 mt-2">There are no items for this session.</p>
                    <button onClick={onClose} className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-500 transition-colors">Close</button>
                </div>
            </div>
        );
    }

    const currentItem = sessionItems[currentIndex];

    const goToNext = () => {
        if (currentIndex < sessionItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(); // End of session
        }
    };
    
    const handleConfidence = (confidence: 'hard' | 'good' | 'easy') => {
        if (mode === 'review' && onCompleteItem) {
            onCompleteItem(currentItem.id, confidence);
        }
        goToNext();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-2xl min-h-[50vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold">
                        {mode === 'review' ? 'Review Session' : `Cram Session: ${tag}`}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">{currentIndex + 1} / {sessionItems.length}</span>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-center items-center text-center">
                    <h3 className="text-3xl font-bold text-slate-100">{currentItem.title}</h3>
                    
                    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg w-full max-w-lg max-h-48 overflow-y-auto">
                        {currentItem.notes ? (
                            <p className="text-slate-300 whitespace-pre-wrap">{currentItem.notes}</p>
                        ) : (
                            <p className="text-slate-500 italic">No notes for this topic.</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-lg">
                    {mode === 'review' ? (
                        <div className="flex justify-center items-center gap-4">
                            <button onClick={() => handleConfidence('hard')} className="flex-1 font-semibold py-3 px-6 rounded-md bg-red-800 hover:bg-red-700 text-white transition-colors">Hard</button>
                            <button onClick={() => handleConfidence('good')} className="flex-1 font-semibold py-3 px-6 rounded-md bg-sky-600 hover:bg-sky-500 text-white transition-colors">Good</button>
                            <button onClick={() => handleConfidence('easy')} className="flex-1 font-semibold py-3 px-6 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">Easy</button>
                        </div>
                    ) : (
                         <div className="flex justify-center items-center gap-4">
                            {currentIndex > 0 && (
                                <button onClick={() => { setCurrentIndex(c => c-1); }} className="font-semibold py-3 px-6 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors">Previous</button>
                            )}
                            <button onClick={goToNext} className="flex-1 font-semibold py-3 px-6 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                                {currentIndex === sessionItems.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionModal;

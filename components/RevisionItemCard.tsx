import React, { useState, useMemo, useRef, useEffect } from 'react';
import { RevisionItem } from '../types';
import { getDaysUntil, formatDate, addDays } from '../utils/date';
import { CalendarIcon, CheckIcon, TrashIcon, LevelUpIcon, BadgeCheckIcon, PencilIcon, ArrowUturnLeftIcon, DocumentTextIcon, TagIcon, ClockIcon, LinkIcon, XMarkIcon, LockClosedIcon, PlusCircleIcon, SitemapIcon, EllipsisVerticalIcon, ChevronRightIcon } from './Icons';

type Confidence = 'hard' | 'good' | 'easy';

interface RevisionItemCardProps {
  item: RevisionItem;
  allItems: RevisionItem[];
  onComplete?: (id: string, confidence: Confidence) => void;
  onUpdateItem?: (id: string, updates: Partial<RevisionItem>) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeletePermanently?: (id: string) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelectItem?: (id: string) => void;
  onNoteLinkClick?: (title: string) => void;
  isValidTopicTitle?: (title: string) => boolean;
  isLocked: boolean;
  onAddSubtopic: (parentId: string) => void;
  onEditPrereqs: (item: RevisionItem) => void;
  childCount: number;
  isExpanded: boolean;
  onToggleExpand: (itemId: string) => void;
  indentationLevel: number;
}

const parseNotes = (notes: string, isValidTopic: (title: string) => boolean, onClick: (title: string) => void) => {
    const parts = notes.split(/(\[\[.*?\]\])/g);
    return parts.map((part, index) => {
        const match = part.match(/^\[\[(.*?)\]\]$/);
        if (match) {
            const topicTitle = match[1];
            const isValid = isValidTopic(topicTitle);
            return (
                <button
                    key={index}
                    onClick={() => isValid && onClick(topicTitle)}
                    className={`font-semibold rounded ${isValid ? 'text-indigo-400 hover:bg-indigo-900/50 cursor-pointer' : 'text-slate-500 cursor-not-allowed'}`}
                    disabled={!isValid}
                    title={isValid ? `Go to topic: ${topicTitle}` : `Topic not found: ${topicTitle}`}
                >
                    <LinkIcon className="w-4 h-4 inline-block mr-1"/>
                    {topicTitle}
                </button>
            );
        }
        return <span key={index}>{part}</span>;
    });
};


const RevisionItemCard: React.FC<RevisionItemCardProps> = (props) => {
  const { 
  item, allItems, onComplete, onUpdateItem, onArchive, onRestore, onDeletePermanently,
  selectionMode, isSelected, onToggleSelectItem, onNoteLinkClick = () => {}, isValidTopicTitle = () => false,
  isLocked, onAddSubtopic, onEditPrereqs, childCount, isExpanded, onToggleExpand, indentationLevel
} = props;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newNotes, setNewNotes] = useState(item.notes || '');
  const [showHistory, setShowHistory] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cardBaseClasses = "p-4 border rounded-lg shadow-md transition-all duration-200";
  const cardContainerClasses = "flex gap-4 items-start";
  
  const handleReview = (confidence: Confidence) => {
    onComplete?.(item.id, confidence);
    setIsReviewing(false);
  };
   
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const cardContent = () => {
    // Archived Card View
    if (item.archivedAt) {
      const deletionDate = addDays(new Date(item.archivedAt), 7);
      const daysUntilDeletion = getDaysUntil(deletionDate.toISOString());
      return (
          <div className={`${cardBaseClasses} bg-slate-800/50 border-slate-700 border-l-4 border-l-slate-600 opacity-60 flex-grow`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex-grow mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-400 line-through">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Archived on {formatDate(item.archivedAt)}. Auto-deletes {daysUntilDeletion < 1 ? 'today' : `in ${daysUntilDeletion} days`}.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                    <button onClick={() => onRestore?.(item.id)} className="flex items-center gap-2 text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700 hover:text-sky-400 transition-colors">
                        <ArrowUturnLeftIcon className="w-5 h-5" /><span>Restore</span>
                    </button>
                    <button onClick={() => onDeletePermanently?.(item.id)} className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
          </div>
      );
    }
    
    // Completed Card View
    if (item.completedAt) {
      return (
          <div className={`${cardBaseClasses} bg-emerald-900/30 border-emerald-800/50 border-l-4 border-l-emerald-500 flex-grow`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex-grow mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-200">{item.title}</h3>
                    <p className="flex items-center gap-2 text-sm text-emerald-400 mt-1">
                        <BadgeCheckIcon className="w-4 h-4" /> Mastered on {formatDate(item.completedAt)}.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                    <button onClick={() => onDeletePermanently?.(item.id)} className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-red-400 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
          </div>
      );
    }

    // Active Card View
    const daysUntil = getDaysUntil(item.nextRevisionDate);
    const getStatus = (): { text: string; colorClasses: string; } => {
      if (isLocked) return { text: 'Locked', colorClasses: 'border-l-slate-500 bg-slate-800' };
      if (daysUntil < 0) return { text: `Overdue by ${Math.abs(daysUntil)} ${Math.abs(daysUntil) === 1 ? 'day' : 'days'}`, colorClasses: 'border-l-red-500 bg-red-900/30' };
      if (daysUntil === 0) return { text: 'Due today', colorClasses: 'border-l-amber-500 bg-amber-900/30' };
      return { text: `Due in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`, colorClasses: 'border-l-sky-500 bg-sky-900/30' };
    };
    const { text: statusText, colorClasses } = getStatus();
    const handleSaveTitle = () => { onUpdateItem?.(item.id, { title: newTitle.trim() }); setIsEditingTitle(false); };
    const handleSaveNotes = () => { onUpdateItem?.(item.id, { notes: newNotes.trim() }); setIsEditingNotes(false); };
    
    const renderedNotes = useMemo(() => {
        if (!item.notes) return null;
        return parseNotes(item.notes, isValidTopicTitle, onNoteLinkClick);
    }, [item.notes, isValidTopicTitle, onNoteLinkClick]);
    
    const prerequisites = useMemo(() => {
        return (item.prerequisiteIds || [])
            .map(id => allItems.find(i => i.id === id))
            .filter((i): i is RevisionItem => !!i);
    }, [item.prerequisiteIds, allItems]);


    return (
      <div className={`${cardBaseClasses} border-slate-700 border-l-4 ${selectionMode ? 'border-indigo-500' : colorClasses} flex-grow ${isLocked ? 'opacity-70' : ''}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
           <div className="flex items-center gap-2 flex-grow mb-4 md:mb-0 w-full md:w-auto">
             {childCount > 0 && (
                 <button onClick={() => onToggleExpand(item.id)} className="p-1 text-slate-400 rounded-full hover:bg-slate-700">
                    <ChevronRightIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`}/>
                </button>
             )}
             {childCount === 0 && <div className="w-7 h-7"></div>}
            <div className="flex-grow">
              {isEditingTitle ? (
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-slate-900/80 border border-slate-600 rounded-md py-1 px-2 text-lg font-semibold text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()} onBlur={handleSaveTitle}/>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                  <button onClick={() => setIsEditingTitle(true)} className="p-1 text-slate-400 rounded-full hover:bg-slate-700 hover:text-indigo-400 transition-colors opacity-50 hover:opacity-100 focus:opacity-100" aria-label={`Edit title`}>
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 mt-2">
                <div className="flex items-center gap-1.5" title="Current Level"><LevelUpIcon className="w-4 h-4 text-indigo-400" /><span>Level {item.level}</span></div>
                <div className="flex items-center gap-1.5" title="Next Revision Date">
                   {isLocked ? <LockClosedIcon className="w-4 h-4 text-slate-500" /> : <CalendarIcon className="w-4 h-4 text-indigo-400" />}
                   <span>{isLocked ? 'Locked' : `${formatDate(item.nextRevisionDate)} (${statusText})`}</span>
                </div>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3"><TagIcon className="w-4 h-4 text-slate-500"/>{item.tags.map(tag => (<span key={tag} className="px-2 py-0.5 text-xs font-medium bg-slate-700 text-slate-300 rounded-full">{tag}</span>))}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 self-end md:self-center">
            {isReviewing ? (
                <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-md">
                    <button onClick={() => handleReview('hard')} className="font-semibold py-1.5 px-3 rounded-md bg-red-800/80 hover:bg-red-700 text-white transition-colors text-sm">Hard</button>
                    <button onClick={() => handleReview('good')} className="font-semibold py-1.5 px-3 rounded-md bg-sky-600/80 hover:bg-sky-500 text-white transition-colors text-sm">Good</button>
                    <button onClick={() => handleReview('easy')} className="font-semibold py-1.5 px-3 rounded-md bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors text-sm">Easy</button>
                    <button onClick={() => setIsReviewing(false)} className="p-1.5 text-slate-400 rounded-full hover:bg-slate-600" aria-label="Cancel review"><XMarkIcon className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setIsReviewing(true)} disabled={isLocked} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"><CheckIcon className="w-5 h-5" /><span>Review</span></button>
              )}
               <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-indigo-400 transition-colors" aria-label="More options"><EllipsisVerticalIcon className="w-5 h-5" /></button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                           <button onClick={() => { onAddSubtopic(item.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><PlusCircleIcon className="w-5 h-5"/> Add Sub-topic</button>
                           <button onClick={() => { onEditPrereqs(item); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><SitemapIcon className="w-5 h-5"/> Dependencies</button>
                           <button onClick={() => { setShowHistory(!showHistory); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><ClockIcon className="w-5 h-5"/> View History</button>
                           <button onClick={() => { setIsEditingNotes(!isEditingNotes); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"><DocumentTextIcon className="w-5 h-5"/> Edit Notes</button>
                           <div className="my-1 h-px bg-slate-700"></div>
                           <button onClick={() => { onArchive?.(item.id); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700"><TrashIcon className="w-5 h-5"/> Archive</button>
                        </div>
                    )}
                </div>
          </div>
        </div>
        {isLocked && prerequisites.length > 0 && (
             <div className="mt-4 pt-4 border-t border-slate-700 w-full">
                <h4 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2"><LockClosedIcon className="w-4 h-4"/> Locked</h4>
                <p className="text-xs text-slate-400">Complete the following topics to unlock:</p>
                <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
                    {prerequisites.map(p => <li key={p.id}>{p.title}</li>)}
                </ul>
            </div>
        )}
        {showHistory && (
          <div className="mt-4 pt-4 border-t border-slate-700 w-full">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Revision History</h4>
            {item.history && item.history.length > 0 ? (
              <ul className="space-y-1 text-sm text-slate-400 list-disc list-inside">
                {[...item.history].reverse().map((h, i) => (
                  <li key={i}>Reviewed on <strong>{formatDate(h.revisionDate)}</strong> (was Level {h.previousLevel}, marked as <span className="font-semibold">{h.confidence || 'Good'}</span>)</li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">No revision history yet.</p>}
          </div>
        )}
        {(isEditingNotes || (!isEditingNotes && item.notes)) && (
          <div className="mt-4 pt-4 border-t border-slate-700 w-full">
            {isEditingNotes ? (
              <div>
                <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Add notes... Use [[Topic Title]] to link to other topics." className="w-full h-24 bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none" autoFocus/>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => { setIsEditingNotes(false); setNewNotes(item.notes || ''); }} className="text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700">Cancel</button>
                  <button onClick={handleSaveNotes} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500">Save Notes</button>
                </div>
              </div>
            ) : (
                <div className="text-slate-300 whitespace-pre-wrap text-sm">{renderedNotes}</div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={cardContainerClasses}>
      {selectionMode && (
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={() => onToggleSelectItem?.(item.id)}
            className="h-6 w-6 rounded border-slate-500 text-indigo-600 bg-slate-800 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      )}
      {cardContent()}
    </div>
  );
};

export default RevisionItemCard;
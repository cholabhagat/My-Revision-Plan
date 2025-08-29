import React, { useState } from 'react';
import { RevisionItem } from '../types';
import { REVISION_INTERVALS } from '../constants';
import { getDaysUntil, formatDate } from '../utils/date';
import { CalendarIcon, CheckIcon, TrashIcon, LevelUpIcon, BadgeCheckIcon, PencilIcon, ListBulletIcon } from './Icons';

interface RevisionItemCardProps {
  item: RevisionItem;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

const RevisionItemCard: React.FC<RevisionItemCardProps> = ({ item, onComplete, onDelete, onUpdateTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(item.title);

  const schedule = item.revisionIntervals || REVISION_INTERVALS;
  const daysUntil = getDaysUntil(item.nextRevisionDate);
  const isMastered = item.level >= schedule.length;

  const getStatus = (): { text: string; colorClasses: string; } => {
    if (daysUntil < 0) {
      const dayText = Math.abs(daysUntil) === 1 ? 'day' : 'days';
      return { text: `Overdue by ${Math.abs(daysUntil)} ${dayText}`, colorClasses: 'border-l-red-500 bg-red-900/30' };
    }
    if (daysUntil === 0) {
      return { text: 'Due today', colorClasses: 'border-l-amber-500 bg-amber-900/30' };
    }
    const dayText = daysUntil === 1 ? 'day' : 'days';
    return { text: `Due in ${daysUntil} ${dayText}`, colorClasses: 'border-l-sky-500 bg-sky-900/30' };
  };

  const { text: statusText, colorClasses: statusColorClasses } = getStatus();

  const cardColorClasses = isMastered
    ? 'border-l-emerald-500 bg-emerald-900/30'
    : statusColorClasses;
    
  const handleSave = () => {
    if (newTitle.trim() && newTitle.trim() !== item.title) {
      onUpdateTitle(item.id, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(item.title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-slate-800/70 border border-indigo-500 rounded-lg shadow-md ring-2 ring-indigo-500/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-grow bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={handleCancel}
              className="text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700 transition-colors"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
              disabled={!newTitle.trim() || newTitle.trim() === item.title}
              aria-label="Save new title"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/70 border border-slate-700 border-l-4 rounded-lg shadow-md transition-transform hover:scale-[1.02] ${cardColorClasses}`}>
      <div className="flex-grow mb-4 md:mb-0">
        <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
          {isMastered ? (
            <div className="flex items-center gap-1.5" title="Mastered">
              <BadgeCheckIcon className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Mastered</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5" title="Current Level">
              <LevelUpIcon className="w-4 h-4 text-indigo-400" />
              <span>Level {item.level}</span>
            </div>
          )}
          {!isMastered && (
            <div className="flex items-center gap-1.5" title="Next Revision Date">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>{formatDate(item.nextRevisionDate)} ({statusText})</span>
            </div>
          )}
           <div className="flex items-center gap-1.5" title="Revision Pattern">
            <ListBulletIcon className="w-4 h-4 text-indigo-400" />
            <span>{schedule.join(', ')}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-center">
        {!isMastered && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
            aria-label={`Edit ${item.title}`}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
          aria-label={`Delete ${item.title}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onComplete(item.id)}
          disabled={isMastered}
          className="flex items-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500"
          aria-label={isMastered ? `Topic ${item.title} is mastered` : `Complete revision for ${item.title}`}
        >
          <CheckIcon className="w-5 h-5" />
          <span>{isMastered ? 'Mastered' : 'Complete'}</span>
        </button>
      </div>
    </div>
  );
};

export default RevisionItemCard;
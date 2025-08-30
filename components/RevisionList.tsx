import React, { useMemo, useState } from 'react';
import { RevisionItem } from '../types';
import RevisionItemCard from './RevisionItemCard';
import { BellIcon, CheckCircleIcon, CalendarClockIcon, CalendarDaysIcon, ArchiveBoxIcon, BadgeCheckIcon, TrashIcon } from './Icons';
import { getDaysUntil } from '../utils/date';

interface RevisionListProps {
  items: RevisionItem[];
  archivedItems: RevisionItem[];
  completedItems: RevisionItem[];
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onClearCompleted: () => void;
}

const ListSection: React.FC<{
  title: string;
  items: RevisionItem[];
  icon: React.ReactNode;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDeletePermanently: (id: string) => void;
}> = ({ title, items, icon, onComplete, onArchive, onUpdateTitle, onDeletePermanently }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-3 mb-4 text-xl font-semibold text-slate-300">
        {icon}
        {title}
      </h2>
      <div className="space-y-4">
        {items.map(item => (
          <RevisionItemCard 
            key={item.id} 
            item={item} 
            onComplete={onComplete} 
            onArchive={onArchive} 
            onUpdateTitle={onUpdateTitle}
            onDeletePermanently={onDeletePermanently}
          />
        ))}
      </div>
    </section>
  );
};

const RevisionList: React.FC<RevisionListProps> = ({ items, archivedItems, completedItems, onComplete, onArchive, onRestore, onDeletePermanently, onUpdateTitle, onClearCompleted }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const { overdue, dueToday, upcoming } = useMemo(() => {
    const groups: {
      overdue: RevisionItem[];
      dueToday: RevisionItem[];
      upcoming: RevisionItem[];
    } = {
      overdue: [],
      dueToday: [],
      upcoming: [],
    };
    
    const sorted = [...items].sort((a, b) => new Date(a.nextRevisionDate).getTime() - new Date(b.nextRevisionDate).getTime());
    
    sorted.forEach(item => {
        const days = getDaysUntil(item.nextRevisionDate);
        if (days < 0) {
            groups.overdue.push(item);
        } else if (days === 0) {
            groups.dueToday.push(item);
        } else {
            groups.upcoming.push(item);
        }
    });

    return groups;
  }, [items]);
  
  const sortedArchivedItems = useMemo(() => {
    return [...archivedItems].sort((a,b) => new Date(b.archivedAt!).getTime() - new Date(a.archivedAt!).getTime())
  }, [archivedItems]);

  const sortedCompletedItems = useMemo(() => {
    return [...completedItems].sort((a,b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
  }, [completedItems]);

  if (items.length === 0 && archivedItems.length === 0 && completedItems.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-inner">
        <BellIcon className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300">No Revisions Yet</h3>
        <p className="text-slate-400 mt-2">Add a topic above to start your learning journey!</p>
      </div>
    );
  }

  return (
    <>
      <ListSection
        title="Overdue"
        items={overdue}
        icon={<CalendarClockIcon className="w-6 h-6 text-red-400" />}
        onComplete={onComplete}
        onArchive={onArchive}
        onUpdateTitle={onUpdateTitle}
        onDeletePermanently={onDeletePermanently}
      />
      <ListSection
        title="Due Today"
        items={dueToday}
        icon={<CheckCircleIcon className="w-6 h-6 text-amber-400" />}
        onComplete={onComplete}
        onArchive={onArchive}
        onUpdateTitle={onUpdateTitle}
        onDeletePermanently={onDeletePermanently}
      />
      <ListSection
        title="Upcoming"
        items={upcoming}
        icon={<CalendarDaysIcon className="w-6 h-6 text-sky-400" />}
        onComplete={onComplete}
        onArchive={onArchive}
        onUpdateTitle={onUpdateTitle}
        onDeletePermanently={onDeletePermanently}
      />

      {(archivedItems.length > 0 || completedItems.length > 0) && (
        <div className="mt-12 border-t border-slate-700 pt-8 space-y-8">
            {completedItems.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
                        >
                        {showCompleted ? 'Hide' : 'Show'} {completedItems.length} Mastered Item(s)
                    </button>
                    {showCompleted && (
                        <section className="mt-8 text-left">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-300">
                                    <BadgeCheckIcon className="w-6 h-6 text-emerald-400" />
                                    Mastered
                                </h2>
                                <button 
                                  onClick={onClearCompleted}
                                  className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors"
                                  aria-label="Clear all mastered items"
                                >
                                  <TrashIcon className="w-4 h-4"/>
                                  Clear All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {sortedCompletedItems.map(item => (
                                <RevisionItemCard
                                    key={item.id}
                                    item={item}
                                    onDeletePermanently={onDeletePermanently}
                                />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {archivedItems.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
                        >
                        {showArchived ? 'Hide' : 'Show'} {archivedItems.length} Archived Item(s)
                    </button>
                    {showArchived && (
                        <section className="mt-8 text-left">
                        <h2 className="flex items-center gap-3 mb-4 text-xl font-semibold text-slate-300">
                            <ArchiveBoxIcon className="w-6 h-6 text-slate-400" />
                            Archived
                        </h2>
                        <div className="space-y-4">
                            {sortedArchivedItems.map(item => (
                            <RevisionItemCard
                                key={item.id}
                                item={item}
                                onRestore={onRestore}
                                onDeletePermanently={onDeletePermanently}
                            />
                            ))}
                        </div>
                        </section>
                    )}
                </div>
            )}
        </div>
      )}
    </>
  );
};

export default RevisionList;
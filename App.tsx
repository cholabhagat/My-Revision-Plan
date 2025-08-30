import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { RevisionItem } from './types';
import { REVISION_INTERVALS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { addDays } from './utils/date';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import RevisionList from './components/RevisionList';

const AUTO_DELETE_DAYS = 7;

const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<RevisionItem[]>('revisionItems', []);

  useEffect(() => {
    const now = new Date();
    const itemsToKeep = items.filter(item => {
      if (!item.archivedAt) {
        return true; // Keep non-archived items
      }
      const archiveDate = new Date(item.archivedAt);
      const deletionDate = addDays(archiveDate, AUTO_DELETE_DAYS);
      return now < deletionDate; // Keep if not past deletion date
    });

    if (itemsToKeep.length < items.length) {
      setItems(itemsToKeep);
    }
  }, [items, setItems]);

  const handleAddItem = useCallback((title: string, intervals: number[]) => {
    if (!title.trim() || intervals.length === 0) return;

    const now = new Date();
    const nextRevisionDate = addDays(now, intervals[0]);

    const newItem: RevisionItem = {
      id: crypto.randomUUID(),
      title,
      level: 0,
      lastRevisionDate: now.toISOString(),
      nextRevisionDate: nextRevisionDate.toISOString(),
      createdAt: now.toISOString(),
      revisionIntervals: intervals,
    };
    setItems(prevItems => [...prevItems, newItem]);
  }, [setItems]);

  const handleCompleteRevision = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const schedule = item.revisionIntervals || REVISION_INTERVALS;
          const newLevel = item.level + 1;
          const now = new Date();
          
          if (newLevel >= schedule.length) {
            return {
              ...item,
              level: newLevel,
              lastRevisionDate: now.toISOString(),
              nextRevisionDate: now.toISOString(), // No next revision
              completedAt: now.toISOString(),
            };
          }

          const intervalDays = schedule[newLevel];
          const nextRevisionDate = addDays(now, intervalDays);

          return {
            ...item,
            level: newLevel,
            lastRevisionDate: now.toISOString(),
            nextRevisionDate: nextRevisionDate.toISOString(),
          };
        }
        return item;
      })
    );
  }, [setItems]);

  const handleArchiveItem = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, archivedAt: new Date().toISOString() } : item
      )
    );
  }, [setItems]);
  
  const handleRestoreItem = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const { archivedAt, ...rest } = item;
          return rest;
        }
        return item;
      })
    );
  }, [setItems]);

  const handleDeleteItemPermanently = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);

  const handleClearCompletedItems = useCallback(() => {
    setItems(prevItems => prevItems.filter(item => !item.completedAt));
  }, [setItems]);


  const handleUpdateItemTitle = useCallback((id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, title: newTitle.trim() } : item
      )
    );
  }, [setItems]);
  
  const { activeItems, archivedItems, completedItems } = useMemo(() => {
    return items.reduce<{ activeItems: RevisionItem[]; archivedItems: RevisionItem[]; completedItems: RevisionItem[]; }>(
      (acc, item) => {
        if (item.archivedAt) {
          acc.archivedItems.push(item);
        } else if (item.completedAt) {
          acc.completedItems.push(item);
        } else {
          acc.activeItems.push(item);
        }
        return acc;
      },
      { activeItems: [], archivedItems: [], completedItems: [] }
    );
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-900 -z-10"></div>
      <div className="container mx-auto max-w-3xl p-4 md:p-8 relative">
        <Header />
        <main>
          <AddItemForm onAddItem={handleAddItem} />
          <RevisionList 
            items={activeItems}
            archivedItems={archivedItems}
            completedItems={completedItems}
            onComplete={handleCompleteRevision} 
            onArchive={handleArchiveItem}
            onRestore={handleRestoreItem}
            onDeletePermanently={handleDeleteItemPermanently}
            onUpdateTitle={handleUpdateItemTitle}
            onClearCompleted={handleClearCompletedItems}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
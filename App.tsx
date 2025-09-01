
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { RevisionItem, RevisionHistory, Settings, Achievement } from './types';
import { REVISION_INTERVALS } from './hooks/constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { addDays, getStartOfWeek } from './utils/date';
import { ACHIEVEMENTS, getAchievementById } from './hooks/achievementsData';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import RevisionList from './components/RevisionList';
import SuggestTopicsModal from './components/SuggestTopicsModal';
import DashboardModal from './components/DashboardModal';
import SessionModal from './components/SessionModal';
import SessionConfigModal from './components/SessionConfigModal';
import AchievementToast from './components/AchievementToast';
import Inbox from './components/Inbox';
import PrerequisiteEditorModal from './components/PrerequisiteEditorModal';


const AUTO_DELETE_DAYS = 7;

export type Goal = {
  type: 'master';
  target: number;
  startOfWeek: string;
} | null;

type Session = {
  items: RevisionItem[];
  mode: 'review' | 'cram';
  tag?: string;
}

const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<RevisionItem[]>('revisionItems', []);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSessionConfigOpen, setIsSessionConfigOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  
  // Search and Filter State
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Edit State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  // Goal State
  const [goal, setGoal] = useLocalStorage<Goal>('learningGoal', null);

  // New Features State
  const [inboxItems, setInboxItems] = useLocalStorage<string[]>('inboxItems', []);
  const [topicToPromote, setTopicToPromote] = useState<string | null>(null);
  const [settings, setSettings] = useLocalStorage<Settings>('appSettings', {});
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage<Record<string, string>>('unlockedAchievements', {});
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [editingPrereqs, setEditingPrereqs] = useState<RevisionItem | null>(null);

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
  }, []); // Runs once on app load
  
  const handleSetNewlyUnlockedAchievement = (achievement: Achievement) => {
    setNewlyUnlockedAchievement(achievement);
    setTimeout(() => setNewlyUnlockedAchievement(null), 5000); // Toast disappears after 5s
  };

  const checkAchievements = useCallback((updatedItems: RevisionItem[], lastAction: 'review' | 'master') => {
      const stats = {
          mastered: updatedItems.filter(i => !!i.completedAt).length,
          reviews: updatedItems.reduce((sum, item) => sum + (item.history?.length || 0), 0),
          streak: 0,
      };

      // Calculate streak
      const reviewDates = new Set<string>();
      updatedItems.forEach(item => {
          if (item.history) item.history.forEach(h => reviewDates.add(new Date(h.revisionDate).toISOString().split('T')[0]));
      });
      const sortedDates = Array.from(reviewDates).sort();
      if (sortedDates.length > 0) {
          let currentStreak = 1;
          const today = new Date(); today.setHours(0,0,0,0);
          const yesterday = addDays(new Date(), -1); yesterday.setHours(0,0,0,0);
          const lastDate = new Date(sortedDates[sortedDates.length-1] + 'T00:00:00');

          if(lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()){
              for (let i = sortedDates.length - 1; i > 0; i--) {
                  const currentDate = new Date(sortedDates[i] + 'T00:00:00');
                  const prevDate = new Date(sortedDates[i-1] + 'T00:00:00');
                  if ((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
                      currentStreak++;
                  } else {
                      break;
                  }
              }
          } else {
             currentStreak = 0;
          }
          stats.streak = currentStreak;
      }
      
      const newAchievements: string[] = [];
      Object.keys(ACHIEVEMENTS).forEach(key => {
          if (unlockedAchievements[key]) return;
          const [type, value] = key.split('_');
          if ((type === 'mastered' && stats.mastered >= parseInt(value)) ||
              (type === 'reviews' && stats.reviews >= parseInt(value)) ||
              (type === 'streak' && stats.streak >= parseInt(value))) {
              newAchievements.push(key);
          }
      });
      
      if (newAchievements.length > 0) {
        const now = new Date().toISOString();
        const updatedUnlocks = { ...unlockedAchievements };
        newAchievements.forEach(key => { updatedUnlocks[key] = now; });
        setUnlockedAchievements(updatedUnlocks);
        // Show toast for the first new achievement
        const firstNew = getAchievementById(newAchievements[0]);
        if(firstNew) handleSetNewlyUnlockedAchievement(firstNew);
      }

  }, [unlockedAchievements, setUnlockedAchievements]);

  const handleAddItem = useCallback((title: string, intervals: number[], tags: string[], parentId: string | null = null) => {
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
      tags: tags.filter(t => t.trim() !== ''),
      notes: '',
      history: [],
      parentId,
      prerequisiteIds: [],
    };
    setItems(prevItems => {
        const newItems = [...prevItems, newItem];
        checkAchievements(newItems, 'master'); // Check achievements on add
        return newItems;
    });
  }, [setItems, checkAchievements]);

  const handleAddSubtopic = (parentId: string) => {
    // TODO: Replace with a more elegant modal/inline form
    const title = window.prompt("Enter title for the new sub-topic:");
    if (title) {
        handleAddItem(title, REVISION_INTERVALS, [], parentId);
    }
  };
  
  const handleAddMultipleItems = useCallback((titles: string[], intervals: number[], tags: string[]) => {
    const now = new Date();
    const nextRevisionDate = addDays(now, intervals[0]);
    
    const newItems: RevisionItem[] = titles.map(title => ({
      id: crypto.randomUUID(),
      title,
      level: 0,
      lastRevisionDate: now.toISOString(),
      nextRevisionDate: nextRevisionDate.toISOString(),
      createdAt: now.toISOString(),
      revisionIntervals: intervals,
      tags: tags.filter(t => t.trim() !== ''),
      notes: '',
      history: [],
      parentId: null,
      prerequisiteIds: [],
    }));
    
    setItems(prevItems => {
        const updatedItems = [...prevItems, ...newItems];
        checkAchievements(updatedItems, 'master');
        return updatedItems;
    });
  }, [setItems, checkAchievements]);

  const isLocked = useCallback((item: RevisionItem, allItems: RevisionItem[]): boolean => {
      if (!item.prerequisiteIds || item.prerequisiteIds.length === 0) {
          return false;
      }
      for (const prereqId of item.prerequisiteIds) {
          const prereqItem = allItems.find(i => i.id === prereqId);
          // If prerequisite is not found, or not completed, item is locked.
          if (!prereqItem || !prereqItem.completedAt) {
              return true;
          }
      }
      return false;
  }, []);

  const handleCompleteRevision = useCallback((id: string, confidence: 'hard' | 'good' | 'easy' = 'good') => {
    let wasMastered = false;
    let itemsAfterRevision: RevisionItem[] = [];

    setItems(currentItems => {
        const updatedItems = currentItems.map(item => {
            if (item.id === id) {
              const schedule = item.revisionIntervals || REVISION_INTERVALS;
              const now = new Date();
              const newHistoryEntry: RevisionHistory = { revisionDate: now.toISOString(), previousLevel: item.level, confidence };
              const newHistory = [...(item.history || []), newHistoryEntry];
              
              let newLevel = item.level;
              switch (confidence) {
                case 'hard':
                  newLevel = Math.max(0, item.level - 1);
                  break;
                case 'good':
                  newLevel = item.level + 1;
                  break;
                case 'easy':
                  newLevel = item.level + 2;
                  break;
              }

              if (newLevel >= schedule.length) {
                wasMastered = !item.completedAt;
                return {
                  ...item,
                  level: newLevel,
                  lastRevisionDate: now.toISOString(),
                  nextRevisionDate: now.toISOString(),
                  completedAt: now.toISOString(),
                  history: newHistory,
                };
              }

              const intervalDays = schedule[newLevel];
              const nextRevisionDate = addDays(now, intervalDays);

              return {
                ...item,
                level: newLevel,
                lastRevisionDate: now.toISOString(),
                nextRevisionDate: nextRevisionDate.toISOString(),
                history: newHistory,
                completedAt: undefined,
              };
            }
            return item;
          });
        
        itemsAfterRevision = updatedItems;
        checkAchievements(updatedItems, wasMastered ? 'master' : 'review');
        
        // Check if this completion unlocked other items
        if (wasMastered) {
            const newlyUnlockedItems = updatedItems.filter(item => {
                const oldVersion = currentItems.find(i => i.id === item.id);
                // Was locked before, and is not locked now
                return oldVersion && isLocked(oldVersion, currentItems) && !isLocked(item, updatedItems);
            });

            if (newlyUnlockedItems.length > 0) {
                return updatedItems.map(item => {
                    if (newlyUnlockedItems.some(unlocked => unlocked.id === item.id)) {
                        // It's unlocked! Reset its schedule to start now.
                        const now = new Date();
                        const schedule = item.revisionIntervals || REVISION_INTERVALS;
                        return {
                            ...item,
                            lastRevisionDate: now.toISOString(),
                            nextRevisionDate: addDays(now, schedule[0]).toISOString(),
                        };
                    }
                    return item;
                });
            }
        }
        return updatedItems;
    });
  }, [items, setItems, checkAchievements, isLocked]);

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
          // When restoring, reset next revision date based on last revision
          const lastRevisionDate = new Date(rest.lastRevisionDate);
          const schedule = rest.revisionIntervals || REVISION_INTERVALS;
          const intervalDays = schedule[rest.level] || 30; // Fallback interval
          rest.nextRevisionDate = addDays(lastRevisionDate, intervalDays).toISOString();
          return rest;
        }
        return item;
      })
    );
  }, [setItems]);

  const handleDeleteItemPermanently = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);

  const handleUpdateItem = useCallback((id: string, updates: Partial<RevisionItem>) => {
     setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updates } : item));
  }, [setItems]);

  const handleExportData = useCallback(() => {
    const dataStr = JSON.stringify({ items, goal, inboxItems, settings, unlockedAchievements }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spaced-revision-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [items, goal, inboxItems, settings, unlockedAchievements]);
  
  const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("Invalid file content");
        const data = JSON.parse(text);
        if (Array.isArray(data.items)) setItems(data.items);
        if (data.goal) setGoal(data.goal);
        if (Array.isArray(data.inboxItems)) setInboxItems(data.inboxItems);
        if (data.settings) setSettings(data.settings);
        if (data.unlockedAchievements) setUnlockedAchievements(data.unlockedAchievements);

        alert("Data imported successfully!");
      } catch (error) {
        console.error("Failed to import data:", error);
        alert("Failed to import data. The file might be corrupted or in the wrong format.");
      }
    };
    reader.readAsText(file);
  }, [setItems, setGoal, setInboxItems, setSettings, setUnlockedAchievements]);

  const handleToggleSelection = (id: string) => {
    setSelectedItems(prev => ({...prev, [id]: !prev[id]}));
  };

  const clearSelection = () => {
    setSelectedItems({});
    setSelectionMode(false);
  }

  const handleBulkArchive = useCallback(() => {
    const idsToArchive = Object.keys(selectedItems).filter(id => selectedItems[id]);
    if (idsToArchive.length === 0 || !window.confirm(`Are you sure you want to archive ${idsToArchive.length} items?`)) return;
    
    setItems(prev => prev.map(item => idsToArchive.includes(item.id) ? { ...item, archivedAt: new Date().toISOString() } : item));
    clearSelection();
  }, [selectedItems, setItems]);

  const handleBulkDelete = useCallback(() => {
    const idsToDelete = Object.keys(selectedItems).filter(id => selectedItems[id]);
     if (idsToDelete.length === 0 || !window.confirm(`Are you sure you want to permanently delete ${idsToDelete.length} items? This cannot be undone.`)) return;
    
    setItems(prev => prev.filter(item => !idsToDelete.includes(item.id)));
    clearSelection();
  }, [selectedItems, setItems]);

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

  const handleStartReviewSession = (limit?: number) => {
    const dueItems = activeItems
      .filter(item => !isLocked(item, items) && new Date(item.nextRevisionDate) <= new Date())
      .sort((a, b) => new Date(a.nextRevisionDate).getTime() - new Date(b.nextRevisionDate).getTime());
    
    const itemsForSession = limit ? dueItems.slice(0, limit) : dueItems;
    setSession({ items: itemsForSession, mode: 'review' });
    setIsSessionConfigOpen(false);
  };

  const handleStartCramSession = (tag: string) => {
    const itemsForSession = activeItems.filter(item => item.tags?.includes(tag) && !isLocked(item, items));
    setSession({ items: itemsForSession, mode: 'cram', tag });
  };

  const handleStartProblemTopicsSession = (problemItems: RevisionItem[]) => {
    setSession({ items: problemItems.filter(i => !isLocked(i, items)), mode: 'review' });
    setIsDashboardOpen(false); // Close dashboard
  };
  
  const handlePromoteAllInboxItems = () => {
    if (inboxItems.length === 0 || !window.confirm(`This will create ${inboxItems.length} new topics with default settings. Are you sure?`)) {
        return;
    }
    handleAddMultipleItems(inboxItems, REVISION_INTERVALS, []); // Add with default intervals and no tags
    setInboxItems([]);
  };
  
  const handleNoteLinkClick = useCallback((title: string) => {
    setSearchQuery(`"${title}"`);
    setActiveTag(null);
  }, []);

  const isValidTopicTitle = useCallback((title: string) => {
    return items.some(item => item.title.toLowerCase() === title.toLowerCase());
  }, [items]);

  const uniqueTags = useMemo(() => {
    const allTags = new Set<string>();
    items.forEach(item => {
      if (!item.archivedAt && item.tags) {
        item.tags.forEach(tag => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }, [items]);

  const filteredActiveItems = useMemo(() => {
    let filtered = activeItems;

    if (activeTag) {
      filtered = filtered.filter(item => item.tags?.includes(activeTag));
    }

    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase().trim();
      // Handle exact match for linked notes
      if (lowercasedQuery.startsWith('"') && lowercasedQuery.endsWith('"')) {
        const exactMatch = lowercasedQuery.slice(1, -1);
        return filtered.filter(item => item.title.toLowerCase() === exactMatch);
      }

      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowercasedQuery) ||
        (item.notes && item.notes.toLowerCase().includes(lowercasedQuery))
      );
    }

    return filtered;
  }, [activeItems, activeTag, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-900 -z-10"></div>
       {newlyUnlockedAchievement && <AchievementToast achievement={newlyUnlockedAchievement} />}
      <div className="container mx-auto max-w-3xl p-4 md:p-8 relative">
        <Header onOpenDashboard={() => setIsDashboardOpen(true)} />
        <main>
          <AddItemForm 
            onAddItem={handleAddItem} 
            onAddMultipleItems={handleAddMultipleItems}
            onSuggestTopics={() => setIsSuggestModalOpen(true)}
            topicToPromote={topicToPromote}
            onPromotionHandled={() => setTopicToPromote(null)}
          />
          <Inbox
            items={inboxItems}
            onAddItem={(title) => setInboxItems(prev => [...prev, title])}
            onRemoveItem={(index) => setInboxItems(prev => prev.filter((_, i) => i !== index))}
            onPromoteItem={(title, index) => {
                setTopicToPromote(title);
                setInboxItems(prev => prev.filter((_, i) => i !== index));
            }}
            onPromoteAll={handlePromoteAllInboxItems}
          />
          {isSuggestModalOpen && (
              <SuggestTopicsModal
                onClose={() => setIsSuggestModalOpen(false)}
                onAddTopics={(titles, intervals, tags) => {
                    handleAddMultipleItems(titles, intervals, tags);
                    setIsSuggestModalOpen(false);
                }}
              />
          )}
          {isDashboardOpen && (
            <DashboardModal
              items={items}
              goal={goal}
              onSetGoal={setGoal}
              onClose={() => setIsDashboardOpen(false)}
              unlockedAchievements={unlockedAchievements}
              onStartProblemTopicsSession={handleStartProblemTopicsSession}
            />
          )}
          {isSessionConfigOpen && (
              <SessionConfigModal
                  dueItemsCount={activeItems.filter(item => !isLocked(item, items) && new Date(item.nextRevisionDate) <= new Date()).length}
                  onStart={handleStartReviewSession}
                  onClose={() => setIsSessionConfigOpen(false)}
              />
          )}
          {session && (
             <SessionModal
                sessionItems={session.items}
                mode={session.mode}
                tag={session.tag}
                onClose={() => setSession(null)}
                onCompleteItem={handleCompleteRevision}
             />
          )}
           {editingPrereqs && (
            <PrerequisiteEditorModal
                item={editingPrereqs}
                allItems={items}
                onClose={() => setEditingPrereqs(null)}
                onSave={(itemId, newPrereqIds) => {
                    handleUpdateItem(itemId, { prerequisiteIds: newPrereqIds });
                    setEditingPrereqs(null);
                }}
            />
          )}
          
          <RevisionList 
            items={filteredActiveItems}
            allItems={items}
            archivedItems={archivedItems}
            completedItems={completedItems}
            onComplete={handleCompleteRevision} 
            onArchive={handleArchiveItem}
            onRestore={handleRestoreItem}
            onDeletePermanently={handleDeleteItemPermanently}
            onUpdateItem={handleUpdateItem}
            uniqueTags={uniqueTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectionMode={selectionMode}
            onToggleSelectionMode={() => {
              setSelectionMode(!selectionMode);
              setSelectedItems({});
            }}
            selectedItems={selectedItems}
            onToggleSelectItem={handleToggleSelection}
            onBulkArchive={handleBulkArchive}
            onBulkDelete={handleBulkDelete}
            onExport={handleExportData}
            onImport={handleImportData}
            onStartReviewSession={() => setIsSessionConfigOpen(true)}
            onStartCramSession={handleStartCramSession}
            onNoteLinkClick={handleNoteLinkClick}
            isValidTopicTitle={isValidTopicTitle}
            isLocked={isLocked}
            onAddSubtopic={handleAddSubtopic}
            onEditPrereqs={(item) => setEditingPrereqs(item)}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
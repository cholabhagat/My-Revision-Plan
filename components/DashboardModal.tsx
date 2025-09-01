
import React, { useMemo, useState } from 'react';
import { RevisionItem, Achievement } from '../types';
import { Goal } from '../App';
import { XMarkIcon, FireIcon, TrophyIcon, CheckCircleIcon, QueueListIcon, BadgeCheckIcon, TrendingDownIcon, AwardIcon, ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon } from './Icons';
import { getStartOfWeek, addDays, formatDate } from '../utils/date';
import { getAchievementById, ACHIEVEMENTS } from '../hooks/achievementsData';

interface DashboardModalProps {
    items: RevisionItem[];
    goal: Goal;
    onSetGoal: (goal: Goal) => void;
    onClose: () => void;
    unlockedAchievements: Record<string, string>;
    onStartProblemTopicsSession: (items: RevisionItem[]) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className={`p-4 rounded-lg bg-slate-900/50 flex items-center gap-4 border-l-4 ${color}`}>
        <div className={`p-2 rounded-full bg-slate-700`}>{icon}</div>
        <div>
            <div className="text-2xl font-bold text-slate-100">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    </div>
);

const Calendar: React.FC<{items: RevisionItem[]}> = ({ items }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const { reviewCounts, forecastCounts, maxCount } = useMemo(() => {
        const reviewCounts: Record<string, number> = {};
        const forecastCounts: Record<string, number> = {};
        let maxCount = 0;

        items.forEach(item => {
            // Heatmap data from history
            item.history?.forEach(h => {
                const dateStr = new Date(h.revisionDate).toISOString().split('T')[0];
                reviewCounts[dateStr] = (reviewCounts[dateStr] || 0) + 1;
                if (reviewCounts[dateStr] > maxCount) maxCount = reviewCounts[dateStr];
            });
            // Forecast data for active items
            if(!item.completedAt && !item.archivedAt) {
                const dateStr = new Date(item.nextRevisionDate).toISOString().split('T')[0];
                if (new Date(item.nextRevisionDate) > new Date()) {
                    forecastCounts[dateStr] = (forecastCounts[dateStr] || 0) + 1;
                }
            }
        });
        return { reviewCounts, forecastCounts, maxCount: Math.max(1, maxCount) };
    }, [items]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const renderDay = (day: number) => {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const reviews = reviewCounts[dateStr] || 0;
        const forecast = forecastCounts[dateStr] || 0;
        const today = new Date();
        today.setHours(0,0,0,0);
        const isToday = date.getTime() === today.getTime();

        let bgColor = 'bg-slate-800/50';
        let title = `${formatDate(dateStr)}: No reviews`;
        if (reviews > 0) {
            title = `${formatDate(dateStr)}: ${reviews} review${reviews > 1 ? 's' : ''}`;
            const intensity = reviews / maxCount;
            if (intensity > 0.66) {
                bgColor = 'bg-emerald-500/90';
            } else if (intensity > 0.33) {
                bgColor = 'bg-emerald-500/60';
            } else {
                bgColor = 'bg-emerald-500/30';
            }
        }

        return (
            <div 
                key={day}
                className={`w-full aspect-square flex items-center justify-center rounded-md text-xs relative ${isToday ? 'ring-2 ring-indigo-500' : ''} ${bgColor}`}
                title={title}
            >
                {day}
                {forecast > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 text-white text-[8px] items-center justify-center">{forecast}</span></span>}
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-2 px-2">
                <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
                <h4 className="font-semibold">{monthName} {year}</h4>
                <button onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-1">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({length: firstDay}).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({length: daysInMonth}).map((_, i) => renderDay(i + 1))}
            </div>
             <div className="flex items-center justify-end gap-4 mt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/30"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/90"></div>
                    <span>More</span>
                </div>
                <div className="flex items-center gap-1">Forecast <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></div>
            </div>
        </div>
    );
};


const DashboardModal: React.FC<DashboardModalProps> = ({ items, goal, onSetGoal, onClose, unlockedAchievements, onStartProblemTopicsSession }) => {
    const [newGoalTarget, setNewGoalTarget] = useState(goal?.target || 5);
    const [activeTab, setActiveTab] = useState('overview');

    const stats = useMemo(() => {
        const reviewDates = new Set<string>();
        items.forEach(item => {
            if (item.history) {
                item.history.forEach(h => reviewDates.add(new Date(h.revisionDate).toISOString().split('T')[0]));
            }
        });
        const sortedDates = Array.from(reviewDates).sort();

        let currentStreak = 0;
        if (sortedDates.length > 0) {
            const today = new Date(); today.setHours(0,0,0,0);
            const yesterday = addDays(new Date(), -1); yesterday.setHours(0,0,0,0);
            const lastDate = new Date(sortedDates[sortedDates.length-1] + 'T00:00:00');

            if(lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()){
                currentStreak = 1;
                for (let i = sortedDates.length - 1; i > 0; i--) {
                    const currentDate = new Date(sortedDates[i] + 'T00:00:00');
                    const previousDate = new Date(sortedDates[i-1] + 'T00:00:00');
                    if ((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }
        
        const problemTopics = items
            .map(item => ({
                ...item,
                hardReviews: item.history?.filter(h => h.confidence === 'hard').length || 0,
            }))
            .filter(item => item.hardReviews > 0 && !item.archivedAt && !item.completedAt)
            .sort((a, b) => b.hardReviews - a.hardReviews)
            .slice(0, 5);

        const activeItems = items.filter(i => !i.completedAt && !i.archivedAt).length;
        const masteredItems = items.filter(i => !!i.completedAt).length;
        const totalReviews = items.reduce((sum, item) => sum + (item.history?.length || 0), 0);

        return { currentStreak, activeItems, masteredItems, totalReviews, problemTopics };
    }, [items]);

    const goalProgress = useMemo(() => {
        if (!goal || goal.type !== 'master') return { current: 0, target: 0 };
        const start = new Date(goal.startOfWeek);
        const end = addDays(start, 7);
        const current = items.filter(item => 
            item.completedAt && 
            new Date(item.completedAt) >= start &&
            new Date(item.completedAt) < end
        ).length;
        return { current, target: goal.target };
    }, [items, goal]);

    const handleSetNewGoal = () => {
        const startOfWeek = getStartOfWeek(new Date()).toISOString().split('T')[0];
        onSetGoal({ type: 'master', target: newGoalTarget, startOfWeek });
    };
    
    const isGoalOutdated = !goal || new Date(goal.startOfWeek).getTime() !== getStartOfWeek(new Date()).getTime();
    
    const sortedAchievements = useMemo(() => {
        return Object.values(ACHIEVEMENTS).sort((a, b) => {
            const unlockedA = !!unlockedAchievements[a.id];
            const unlockedB = !!unlockedAchievements[b.id];
            if (unlockedA === unlockedB) return 0;
            return unlockedA ? -1 : 1;
        });
    }, [unlockedAchievements]);

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold flex items-center gap-2">Progress Dashboard</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700" aria-label="Close"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="flex border-b border-slate-700 px-6">
                    <button onClick={() => setActiveTab('overview')} className={`py-3 px-4 font-semibold ${activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>Overview</button>
                    <button onClick={() => setActiveTab('calendar')} className={`py-3 px-4 font-semibold ${activeTab === 'calendar' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>Calendar</button>
                    <button onClick={() => setActiveTab('achievements')} className={`py-3 px-4 font-semibold ${activeTab === 'achievements' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}>Achievements</button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <>
                        <section>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon={<FireIcon className="w-6 h-6 text-amber-400"/>} label="Current Streak" value={`${stats.currentStreak} days`} color="border-l-amber-500" />
                                <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-sky-400"/>} label="Total Reviews" value={stats.totalReviews} color="border-l-sky-500" />
                                <StatCard icon={<QueueListIcon className="w-6 h-6 text-indigo-400"/>} label="Active Topics" value={stats.activeItems} color="border-l-indigo-500" />
                                <StatCard icon={<BadgeCheckIcon className="w-6 h-6 text-emerald-400"/>} label="Mastered Topics" value={stats.masteredItems} color="border-l-emerald-500" />
                            </div>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold text-slate-300 mb-3">Weekly Goal</h3>
                            {isGoalOutdated ? (
                                <div className="p-4 rounded-lg bg-slate-900/50 space-y-3">
                                    <p className="text-slate-400">Set a goal for this week!</p>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="goal-input" className="text-slate-300">Master</label>
                                        <input id="goal-input" type="number" min="1" value={newGoalTarget} onChange={(e) => setNewGoalTarget(parseInt(e.target.value, 10))} className="w-20 bg-slate-800 border border-slate-600 rounded-md py-1 px-2 text-center"/>
                                        <span className="text-slate-300">topics this week.</span>
                                        <button onClick={handleSetNewGoal} className="bg-indigo-600 text-white font-semibold py-1 px-4 rounded-md hover:bg-indigo-500">Set Goal</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-slate-900/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-slate-300">Master {goal.target} topics this week</p>
                                        <p className="font-semibold text-slate-100">{goalProgress.current} / {goal.target}</p>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-4"><div className="bg-emerald-500 h-4 rounded-full transition-all" style={{ width: `${Math.min((goalProgress.current / goal.target) * 100, 100)}%` }}></div></div>
                                    {goalProgress.current >= goal.target && (<p className="text-center mt-3 font-semibold text-emerald-400 flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5"/> Goal Achieved! Great work!</p>)}
                                </div>
                            )}
                        </section>
                        <section>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-300"><TrendingDownIcon className="w-5 h-5"/> Problem Topics</h3>
                                {stats.problemTopics.length > 0 && (
                                    <button onClick={() => onStartProblemTopicsSession(stats.problemTopics)} className="flex items-center gap-2 text-sm bg-slate-700 text-slate-300 font-semibold py-1 px-3 rounded-md hover:bg-slate-600 transition-colors">
                                        <PlayCircleIcon className="w-4 h-4"/>
                                        Review ({stats.problemTopics.length})
                                    </button>
                                )}
                            </div>
                            <div className="p-4 rounded-lg bg-slate-900/50">
                                {stats.problemTopics.length > 0 ? (
                                    <ul className="space-y-2">
                                        {stats.problemTopics.map(item => (
                                            <li key={item.id} className="text-sm text-slate-300 flex justify-between">
                                                <span>{item.title}</span>
                                                <span className="font-semibold text-red-400">{item.hardReviews} hard review(s)</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-slate-500 text-sm">No topics seem to be giving you trouble. Keep it up!</p>}
                            </div>
                        </section>
                        </>
                    )}
                    {activeTab === 'calendar' && <Calendar items={items} />}
                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {sortedAchievements.map(ach => {
                                const isUnlocked = !!unlockedAchievements[ach.id];
                                const Icon = ach.icon;
                                return (
                                    <div key={ach.id} className={`p-4 rounded-lg text-center transition-opacity ${isUnlocked ? 'bg-slate-900/50 border border-amber-500/50' : 'bg-slate-800/60 opacity-50'}`} title={isUnlocked ? `Unlocked on ${formatDate(unlockedAchievements[ach.id])}` : 'Locked'}>
                                        <Icon className={`w-10 h-10 mx-auto ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`} />
                                        <h4 className="font-semibold mt-2 text-sm text-slate-200">{ach.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                 <div className="flex justify-end p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-lg">
                    <button onClick={onClose} className="bg-slate-700 text-slate-300 font-semibold py-2 px-5 rounded-md hover:bg-slate-600 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardModal;
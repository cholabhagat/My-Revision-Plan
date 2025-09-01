import React, { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { AwardIcon } from './Icons';

interface AchievementToastProps {
    achievement: Achievement;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4500); // Should be slightly less than the timeout in App.tsx
            return () => clearTimeout(timer);
        }
    }, [achievement]);
    
    const Icon = achievement.icon;

    return (
        <div 
            aria-live="assertive"
            className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
           {achievement && (
                <div className="flex items-center gap-4 p-4 rounded-lg shadow-lg bg-slate-700 border border-amber-500/50">
                    <div className="flex-shrink-0">
                        <AwardIcon className="w-10 h-10 text-amber-400"/>
                    </div>
                    <div>
                        <p className="font-bold text-slate-100">Achievement Unlocked!</p>
                        <p className="text-sm text-slate-300">{achievement.name}</p>
                    </div>
                </div>
           )}
        </div>
    );
};

export default AchievementToast;

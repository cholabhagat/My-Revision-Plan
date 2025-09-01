import { Achievement } from '../types';
import { FireIcon, BadgeCheckIcon, CheckCircleIcon, TrophyIcon } from '../components/Icons';

export const ACHIEVEMENTS: Record<string, Achievement> = {
    // Streaks
    'streak_3': { id: 'streak_3', name: 'On a Roll', description: 'Maintain a 3-day study streak.', icon: FireIcon },
    'streak_7': { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day study streak.', icon: FireIcon },
    'streak_14': { id: 'streak_14', name: 'Consistent Scholar', description: 'Maintain a 14-day study streak.', icon: FireIcon },
    'streak_30': { id: 'streak_30', name: 'Habitual Learner', description: 'Maintain a 30-day study streak.', icon: TrophyIcon },

    // Mastered Topics
    'mastered_1': { id: 'mastered_1', name: 'First Steps', description: 'Master your first topic.', icon: BadgeCheckIcon },
    'mastered_10': { id: 'mastered_10', name: 'Knowledge Builder', description: 'Master 10 topics.', icon: BadgeCheckIcon },
    'mastered_25': { id: 'mastered_25', name: 'Subject Novice', description: 'Master 25 topics.', icon: BadgeCheckIcon },
    'mastered_50': { id: 'mastered_50', name: 'Domain Expert', description: 'Master 50 topics.', icon: TrophyIcon },
    
    // Total Reviews
    'reviews_10': { id: 'reviews_10', name: 'Getting Started', description: 'Complete 10 reviews.', icon: CheckCircleIcon },
    'reviews_50': { id: 'reviews_50', name: 'Reviewer', description: 'Complete 50 reviews.', icon: CheckCircleIcon },
    'reviews_100': { id: 'reviews_100', name: 'Diligent Student', description: 'Complete 100 reviews.', icon: CheckCircleIcon },
    'reviews_500': { id: 'reviews_500', name: 'Memory Master', description: 'Complete 500 reviews.', icon: TrophyIcon },
};

export const getAchievementById = (id: string): Achievement | null => ACHIEVEMENTS[id] || null;

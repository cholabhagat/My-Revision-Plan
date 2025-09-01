import React, { useState, useEffect } from 'react';
import { PlusIcon, CogIcon, SparklesIcon } from './Icons';
import { REVISION_INTERVALS } from '../hooks/constants';

interface AddItemFormProps {
  onAddItem: (title: string, intervals: number[], tags: string[]) => void;
  onAddMultipleItems: (titles: string[], intervals: number[], tags: string[]) => void;
  onSuggestTopics: () => void;
  topicToPromote?: string | null;
  onPromotionHandled?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onSuggestTopics, topicToPromote, onPromotionHandled }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [intervals, setIntervals] = useState(REVISION_INTERVALS.join(', '));
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (topicToPromote) {
      setTitle(topicToPromote);
      // focus the input
      document.getElementById('topic-title')?.focus();
      onPromotionHandled?.();
    }
  }, [topicToPromote, onPromotionHandled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIntervals = intervals
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);
      
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (title.trim() && parsedIntervals.length > 0) {
      onAddItem(title.trim(), parsedIntervals, parsedTags);
      setTitle('');
      setTags('');
      // Optionally reset intervals and hide advanced
      // setIntervals(REVISION_INTERVALS.join(', '));
      // setShowAdvanced(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label htmlFor="topic-title" className="sr-only">Topic Title</label>
                <input
                    id="topic-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a new topic to master..."
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                />
            </div>
            <div>
                <label htmlFor="topic-tags" className="sr-only">Tags (comma-separated)</label>
                <input
                    id="topic-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (e.g., react, javascript, hooks)"
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                />
            </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
            <button
                type="button"
                onClick={onSuggestTopics}
                className="flex items-center gap-2 text-indigo-400 font-semibold py-2 px-4 rounded-md hover:bg-indigo-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                title="Suggest topics with AI"
            >
                <SparklesIcon className="w-5 h-5" />
                <span>Suggest Topics</span>
            </button>
            <div className="flex-grow"></div>
            <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                aria-label="Customize revision schedule"
                title="Customize revision schedule"
            >
                <CogIcon className="w-6 h-6" />
            </button>
            <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                disabled={!title.trim()}
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add</span>
            </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-md border border-slate-700">
            <label htmlFor="intervals" className="block text-sm font-medium text-slate-400 mb-2">
              Revision Intervals (days, comma-separated)
            </label>
            <input
              id="intervals"
              type="text"
              value={intervals}
              onChange={(e) => setIntervals(e.target.value)}
              placeholder="e.g., 1, 3, 7, 14, 30"
              className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AddItemForm;
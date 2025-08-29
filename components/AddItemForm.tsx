import React, { useState } from 'react';
import { PlusIcon, CogIcon } from './Icons';
import { REVISION_INTERVALS } from '../constants';

interface AddItemFormProps {
  onAddItem: (title: string, intervals: number[]) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [title, setTitle] = useState('');
  const [intervals, setIntervals] = useState(REVISION_INTERVALS.join(', '));
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedIntervals = intervals
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);
      
    if (title.trim() && parsedIntervals.length > 0) {
      onAddItem(title.trim(), parsedIntervals);
      setTitle('');
      setIntervals(REVISION_INTERVALS.join(', '));
      setShowAdvanced(false);
    }
  };

  return (
    <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new topic to master..."
            className="flex-grow bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-slate-400 rounded-full hover:bg-slate-700 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            aria-label="Customize revision schedule"
            title="Customize revision schedule"
          >
            <CogIcon className="w-6 h-6" />
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            disabled={!title.trim()}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
        {showAdvanced && (
          <div className="mt-4">
            <label htmlFor="intervals" className="block text-sm font-medium text-slate-400 mb-2">
              Revision Intervals (days, comma-separated)
            </label>
            <input
              id="intervals"
              type="text"
              value={intervals}
              onChange={(e) => setIntervals(e.target.value)}
              placeholder="e.g., 1, 3, 7, 14, 30"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-md py-2 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AddItemForm;
import React from 'react';
import { BrainCircuitIcon, ChartBarIcon } from './Icons';

interface HeaderProps {
    onOpenDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenDashboard }) => {
  return (
    <header className="relative text-center mb-8">
      <div className="inline-flex items-center gap-3">
        <BrainCircuitIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-100">
          Spaced Revision
        </h1>
      </div>
      <p className="mt-2 text-lg text-slate-400">
        Master anything by reviewing at the right time.
      </p>
      <div className="absolute top-0 right-0">
          <button 
            onClick={onOpenDashboard}
            className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
            title="Open Progress Dashboard"
          >
              <ChartBarIcon className="w-5 h-5" />
              <span>Dashboard</span>
          </button>
      </div>
    </header>
  );
};

export default Header;

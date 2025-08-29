
import React from 'react';
import { BrainCircuitIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center gap-3">
        <BrainCircuitIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-100">
          Spaced Revision
        </h1>
      </div>
      <p className="mt-2 text-lg text-slate-400">
        Master anything by reviewing at the right time.
      </p>
    </header>
  );
};

export default Header;

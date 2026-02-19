import React, { useEffect } from 'react';

const SourcingStatusTracking: React.FC = () => {
  useEffect(() => {
    document.title = 'Sourcing Status Tracking | Atlas Construction Intelligence';
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-950 text-white py-20 px-4">
      <div className="max-w-xl mx-auto border border-slate-700 bg-slate-900/70 rounded-xl p-8 md:p-10 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-400 mb-4">Client Access Portal</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Sourcing Status Tracking</h1>
        <p className="text-slate-300 mb-8 leading-relaxed">
          This is a secure client-portal placeholder for institutional procurement tracking. Live authentication will
          be activated under enterprise onboarding.
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Client ID</label>
            <input
              type="text"
              placeholder="Client reference"
              disabled
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              disabled
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-400 cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full rounded-md bg-orange-500 text-slate-950 font-semibold py-2.5 opacity-70 cursor-not-allowed"
          >
            Login (Placeholder)
          </button>
        </form>
      </div>
    </div>
  );
};

export default SourcingStatusTracking;

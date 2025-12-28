import React from 'react';

const LivePlayerModal = ({ show, onClose, match }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-3xl mx-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Live Match</h2>
              <p className="text-sm text-gray-300">{match?.teams} • {match?.tournament}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <div className="mt-4 bg-black rounded-md overflow-hidden">
            <div className="w-full h-60 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">Now Playing</div>
                <div className="mt-2 text-lg">{match?.teams}</div>
                <div className="mt-1 text-sm text-gray-300">{match?.score}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white">Close</button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white">Controls</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePlayerModal;

import React from 'react';

const Account = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 w-full max-w-md p-8 rounded-2xl border border-neutral-800 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* User Profile Avatar Icon */}
        <div className="w-24 h-24 bg-[#1ed760] text-black mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
          {user.username ? user.username[0].toUpperCase() : '👤'}
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">@{user.username}</h2>
        <p className="text-neutral-400 text-sm mb-6">{user.email}</p>

        <div className="border-t border-neutral-800 pt-5 flex flex-col gap-3">
          <button 
            onClick={() => { onLogout(); onClose(); }} 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-full py-3 transition-all"
          >
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
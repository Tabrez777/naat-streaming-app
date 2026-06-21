import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    if (email && password) {
      // Mock login - we just pass the email part before the '@' as the username
      const username = email.split('@')[0];
      onLogin(username);
    }
  };

  return (
    // Fixed full-screen overlay with a glassy background blur
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      
      {/* The Modal Box */}
      <div className="bg-neutral-900 w-full max-w-md p-8 rounded-2xl border border-neutral-800 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Log in to listen</h2>
          <p className="text-neutral-400">Save your favorite Naats and create playlists.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Email or username</label>
            <input 
              type="text" 
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white border border-transparent focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white border border-transparent focus:border-transparent transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1ed760] text-black font-bold rounded-full py-3.5 mt-4 hover:scale-[1.02] hover:bg-[#1fdf64] transition-all"
          >
            Log In
          </button>
          
        </form>

      </div>
    </div>
  );
};

export default LoginModal;
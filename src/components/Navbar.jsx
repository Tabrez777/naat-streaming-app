import React from 'react'; 
import LoginModal from './LoginModel';   // [cite: 1]
import SignupModal from './SignUpModel'; // [cite: 1]
import Account from './Account';         // [cite: 2]
import SearchBar from './SearchBar';     // [cite: 2]
import { useNavigation } from '../hooks/useNavigation'; // [cite: 3]

const Navbar = ({ user, onLogin, onLogout, toggleSidebar,onAdminClick }) => {
  
  // Clean routing system tracking the URL paths [cite: 7]
  const [currentPath, navigateTo] = useNavigation();

  // Centralized authentication completion pipeline [cite: 6]
  const handleAuthSuccess = (userData) => {
    onLogin(userData); 
    navigateTo('/'); 
  };

  return (
    <nav className='w-full flex justify-between items-center py-3 px-6 text-white border-neutral-900' style={{background:'transparent', borderBottom:'1.3px solid #77686856'}}>
      
      {/* 🍔 Left Side Group */}
      <div className="flex items-center gap-4">
        
        <button 
          onClick={toggleSidebar} // ✨ Fixed: Triggers the actual sidebar component drawer toggle
          className="text-white hover:bg-neutral-800 p-2 rounded-full transition duration-200 focus:outline-none md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-6 h-6 bg-[#FF0000] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight font-sans">TEZ</span>
        </div>
      </div>

      {/* 🔍 Center Search Component Area */}
      <SearchBar /> {/* [cite: 11] */}
      
      {/* 📡 Right Utility Panel */}
      <div className="flex items-center gap-6 flex-shrink-0">

        <button className="text-neutral-300 hover:text-white transition duration-200 focus:outline-none" aria-label="Chromecast">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v2m0 4h.01M2 17h.01M2 14h.01M6 17a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {/* DYNAMIC PROFILE ICON CONTROLLER */}
        <button 
          onClick={() => navigateTo(user ? '/account' : '/login')} // ✨ Fixed: Explicitly changes the browser URL path
          className="focus:outline-none transition transform hover:scale-105"
        >
          {user ? (
            // Logged In Status [cite: 14]
            <div className="w-9 h-9 bg-[#1ed760] text-black rounded-full flex items-center justify-center font-bold text-sm">
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
          ) : (
            // Logged Out Status [cite: 14, 15]
            <div className="w-9 h-9 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center border border-neutral-700 hover:text-white hover:border-neutral-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* MODAL SWITCH LAYER ROUTER */}
      {currentPath === '/login' && (
        <LoginModal 
          onClose={() => navigateTo('/')} 
          onLoginSuccess={handleAuthSuccess} 
          onSwitchToSignup={() => navigateTo('/signup')} 
        />
      )}

      {currentPath === '/signup' && (
        <SignupModal 
          onClose={() => navigateTo('/')} 
          onSignupSuccess={handleAuthSuccess} 
          onSwitchToLogin={() => navigateTo('/login')} 
        />
      )}

      {currentPath === '/account' && user && (
        <Account 
          user={user} 
          onClose={() => navigateTo('/')} 
          onLogout={onLogout} 
        />
      )}
  
    </nav>
  );
};

export default Navbar;
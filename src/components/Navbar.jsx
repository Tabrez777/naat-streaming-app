import React, { useState } from 'react'; 
import LoginModal from './LoginModel';   
import SignupModal from './SignUpModel'; 
import Account from './Account';         
import SearchBar from './SearchBar';     
import { useNavigation } from '../hooks/useNavigation'; 

const Navbar = ({ user, onLogin, onLogout, toggleSidebar, onAdminClick, userProfile, songs = [], onPlay }) => {
  
  const [currentPath, navigateTo] = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleAuthSuccess = (userData) => {
    onLogin(userData); 
    navigateTo('/'); 
  };

  return (
    // ✨ FIX 1: Added `flex-wrap` and `gap-y-3` so elements can wrap to a new line on mobile safely
    <nav className='w-full flex flex-wrap justify-between items-center py-3 px-4 md:px-6 text-white border-neutral-800 gap-y-3 md:gap-y-0' style={{background:'transparent', borderBottom:'1.3px solid rgba(119, 104, 104, 0.337)'}}>
      
      {/* 🍔 Left Side Group (Stays on the top left) */}
      <div className="flex items-center gap-4 order-1">
        <button 
          onClick={toggleSidebar} 
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

      {/* 🔍 Center Search Component Area 
          ✨ FIX 2: Added `order-3 w-full` for mobile so it drops to the second line. 
          On desktop (`md:`), it switches back to `order-2 w-auto` to sit in the middle!
      */}
      <div className="w-full md:w-auto md:flex-1 md:max-w-lg mx-auto order-3 md:order-2">
        {/* ✨ FIX 3: Corrected typo 'onplay' to 'onPlay' */}
        <SearchBar songs={songs} onPlay={onPlay}/> 
      </div>
      
      {/* 📡 Right Utility Panel (Stays on the top right) */}
      {/* ✨ FIX 4: Made this `order-2` on mobile, but `order-3` on desktop */}
      <div className="flex items-center gap-4 md:gap-6 shrink-0 relative order-2 md:order-3">

        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative text-neutral-300 cursor-pointer hover:text-white transition duration-200 focus:outline-none p-2 rounded-full hover:bg-neutral-800" 
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>
        </button>

        {/* RESPONSIVE DROPDOWN MENU */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 max-w-[90vw] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
            
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="text-white font-bold text-lg">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-xs text-[#1ed760] cursor-pointer hover:text-white font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide flex flex-col bg-neutral-900/90 backdrop-blur-md">
              <div className="p-4 hover:bg-neutral-800/80 cursor-pointer transition-colors border-b border-neutral-800/50 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0 text-lg">🎵</div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">New Naat Added</p>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">"Tajdar-e-Haram" is now available in your library. Tap to listen.</p>
                  <p className="text-xs text-neutral-500 mt-2 font-medium">2 hours ago</p>
                </div>
              </div>
              <div className="p-4 hover:bg-neutral-800/80 cursor-pointer transition-colors flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 text-lg">🔔</div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">System Update</p>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">The Quran Tilawat section has been successfully synced and sorted.</p>
                  <p className="text-xs text-neutral-500 mt-2 font-medium">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC PROFILE ICON CONTROLLER */}
        <button 
          onClick={() => navigateTo(user ? '/account' : '/login')}
          className="focus:outline-none transition transform hover:scale-105"
        >
          {user ? (
            userProfile?.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
              />
            ) : (
              <div className="w-9 h-9 bg-[#1ed760] text-black rounded-full flex items-center justify-center font-bold text-sm">
                {userProfile?.name ? userProfile.name[0].toUpperCase() : (user.username ? user.username[0].toUpperCase() : 'U')}
              </div>
            )
          ) : (
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
          onAdminClick={onAdminClick}
        />
      )}
  
    </nav>
  );
};

export default Navbar;
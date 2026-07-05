import React,{useState} from 'react'; 
import LoginModal from './LoginModel';   // [cite: 1]
import SignupModal from './SignUpModel'; // [cite: 1]
import Account from './Account';         // [cite: 2]
import SearchBar from './SearchBar';     // [cite: 2]
import { useNavigation } from '../hooks/useNavigation'; // [cite: 3]

const Navbar = ({ user, onLogin, onLogout, toggleSidebar,onAdminClick,userProfile,songs = [] , onPlay}) => {
  
  // Clean routing system tracking the URL paths [cite: 7]
  const [currentPath, navigateTo] = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

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
      <SearchBar 
      songs={songs}
      onPlay={onplay}/> {/* [cite: 11] */}
      
      {/* 📡 Right Utility Panel */}
      <div className="flex items-center gap-6 shrink-0 relative">

        <button 
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative text-neutral-300 cursor-pointer hover:text-white transition duration-200 focus:outline-none p-2 rounded-full hover:bg-neutral-800" 
    aria-label="Notifications"
  >
    {/* New Notification Bell SVG */}
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    {/* Red Unread Badge Indicator */}
    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>
  </button>

  {/* ✨ RESPONSIVE DROPDOWN MENU ✨ */}
  {showNotifications && (
    <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 max-w-[90vw] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50">
        <h3 className="text-white font-bold text-lg">Notifications</h3>
        <button 
          onClick={() => setShowNotifications(false)}
          className="text-xs text-[#1ed760] hover:text-white font-medium transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Notification List Area */}
      <div className="max-h-[60vh] overflow-y-auto scrollbar-hide flex flex-col bg-neutral-900/90 backdrop-blur-md">
        
        {/* Sample Notification 1 */}
        <div className="p-4 hover:bg-neutral-800/80 cursor-pointer transition-colors border-b border-neutral-800/50 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#1ed760]/20 text-[#1ed760] flex items-center justify-center shrink-0 text-lg">
            🎵
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">New Naat Added</p>
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">"Tajdar-e-Haram" is now available in your library. Tap to listen.</p>
            <p className="text-xs text-neutral-500 mt-2 font-medium">2 hours ago</p>
          </div>
        </div>

        {/* Sample Notification 2 */}
        <div className="p-4 hover:bg-neutral-800/80 cursor-pointer transition-colors flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 text-lg">
            🔔
          </div>
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
            /* ✨ FIXED: Check for the uploaded image first! */
            userProfile?.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
              />
            ) : (
              /* Fallback: Show the green circle with their initial if no image exists */
              <div className="w-9 h-9 bg-[#1ed760] text-black rounded-full flex items-center justify-center font-bold text-sm">
                {userProfile?.name ? userProfile.name[0].toUpperCase() : (user.username ? user.username[0].toUpperCase() : 'U')}
              </div>
            )
          ) : (
            // Logged Out Status 
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
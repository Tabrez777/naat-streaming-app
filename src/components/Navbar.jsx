import React, { useState, useEffect } from 'react'; 
import LoginModal from './LoginModel';   
import SignupModal from './SignUpModel'; 
import Account from './Account';         
import SearchBar from './SearchBar';     
import { useNavigation } from '../hooks/useNavigation'; 

const Navbar = ({ user, onLogin, onLogout, toggleSidebar, onAdminClick, userProfile, songs = [], onPlay, closeSidebar }) => {
  
  const [currentPath, navigateTo] = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoginViewOpen, setIsLoginViewOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(true);
  
  const isAuthViewOpen = currentPath === '/login' || currentPath === '/signup' || currentPath === '/account';
  
  // ✨ 1. NOTIFICATION STATES
  const [hasUnread, setHasUnread] = useState(false);
  
  // ✨ 2. NEW: Track which songs have been cleared/hidden by the user
  const [clearedUntilId, setClearedUntilId] = useState(() => localStorage.getItem('clearedUntilId') || null);

  useEffect(() => {
    if (songs.length > 0) {
      const latestSongId = songs[songs.length - 1]?.id;
      const seenId = localStorage.getItem('lastSeenSongId');
      
      // If the latest song is different from what they last saw, trigger the Red Dot!
      if (latestSongId && String(latestSongId) !== seenId) {
        setHasUnread(true);
      }
    }
  }, [songs]);

  const handleOpenNotifications = () => {
    const willShow = !showNotifications;
    setShowNotifications(willShow);
    
    // Opening the menu removes the red dot, but keeps the items in the list
    if (willShow && songs.length > 0) {
      setHasUnread(false);
      const latestSongId = songs[songs.length - 1]?.id;
      if (latestSongId) {
        localStorage.setItem('lastSeenSongId', String(latestSongId));
      }
    }
  };

  // ✨ 3. NEW: This function empties the list!
  const handleMarkAllAsRead = () => {
    setHasUnread(false); 
    if (songs.length > 0) {
      const latestSongId = songs[songs.length - 1]?.id;
      if (latestSongId) {
        const idStr = String(latestSongId);
        localStorage.setItem('clearedUntilId', idStr);
        setClearedUntilId(idStr); // This instantly empties the visible list
      }
    }
  };

  const handleOpenLogin = () => {
    setIsLoginViewOpen(true);
    if(closeSidebar){
      closeSidebar();
    }
    setIsSearchBarOpen(false);
  }

  const handleAuthSuccess = (userData) => {
    onLogin(userData); 
    navigateTo('/'); 
  };

  // ✨ 4. LOGIC TO HIDE CLEARED NOTIFICATIONS:
  // Find the exact index of the last song the user cleared
  const clearedIndex = clearedUntilId ? songs.findIndex(s => String(s.id) === clearedUntilId) : -1;
  // Only grab the songs that were uploaded AFTER the cleared one
  const newSongs = clearedIndex !== -1 ? songs.slice(clearedIndex + 1) : songs;
  // Take the 4 most recent un-cleared songs to show in the dropdown
  const displaySongs = [...newSongs].reverse().slice(0, 4);

  return (
    <nav className='w-full flex flex-wrap justify-between items-center py-3 px-4 md:px-6 text-white border-neutral-800 gap-y-3 md:gap-y-0' style={{background:'transparent', borderBottom:'1.3px solid rgba(119, 104, 104, 0.337)'}}>
      
      {/* 🍔 Left Side Group */}
      <div className="flex items-center gap-4 order-1">
        <button onClick={toggleSidebar} className="text-white hover:bg-neutral-800 p-2 rounded-full transition duration-200 focus:outline-none md:hidden">
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
      <div className="w-full md:w-auto md:flex-1 md:max-w-lg mx-auto order-3 md:order-2">
        {!isAuthViewOpen && (
           <SearchBar songs={songs} onPlay={onPlay}/> 
        )}
      </div>
      
      {/* 📡 Right Utility Panel */}
      <div className="flex items-center gap-4 md:gap-6 shrink-0 relative order-2 md:order-3">

        {/* NOTIFICATION BELL BUTTON */}
        <button 
          onClick={handleOpenNotifications}
          className="relative text-neutral-300 cursor-pointer hover:text-white transition duration-200 focus:outline-none p-2 rounded-full hover:bg-neutral-800" 
          aria-label="Notifications"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
          )}
        </button>

        {/* 📋 DYNAMIC NOTIFICATION DROPDOWN */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-3 w-80 sm:w-[400px] max-w-[90vw] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
            
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="text-white font-bold text-lg">Recent Updates</h3>
              
              {/* Only show the clear button if there are actually notifications to clear */}
              {displaySongs.length > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#1ed760] cursor-pointer hover:text-white font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide flex flex-col bg-neutral-900/90 backdrop-blur-md">
              
              {/* ✨ 5. RENDERS BASED ON displaySongs */}
              {displaySongs.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                   <p className="font-medium text-white">No new notifications</p>
                   <p className="text-xs mt-1">We'll let you know when new tracks arrive!</p>
                </div>
              ) : (
                displaySongs.map((song, index) => (
                  <div 
                    key={song.id || index}
                    onClick={() => {
                      if(onPlay) onPlay(song);
                      setShowNotifications(false);
                    }}
                    className="p-4 hover:bg-neutral-800/80 cursor-pointer transition-colors border-b border-neutral-800/50 flex gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform relative">
                      {song.coverUrl ? (
                        <img src={song.coverUrl} alt="cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1ed760]">🎵</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">
                        New {song.category ? song.category.charAt(0).toUpperCase() + song.category.slice(1) : 'Track'}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        <span className="text-white">"{song.title}"</span> by {song.artist} is now available. Tap to play!
                      </p>
                      <p className="text-[10px] text-[#1ed760] mt-2 font-bold uppercase tracking-wider">Recently Added</p>
                    </div>
                  </div>
                ))
              )}

              {/* Only show "caught up" message if there are notifications being shown */}
              {displaySongs.length > 0 && (
                <div className="p-4 text-center bg-neutral-950/50 border-t border-neutral-800/50">
                  <p className="text-xs text-neutral-500 font-medium">You're all caught up!</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* PROFILE ICON CONTROLLER */}
        <button 
          onClick={() => { navigateTo(user ? '/account' : '/login') }}
          className="focus:outline-none transition transform hover:scale-105"
        >
          {user ? (
            userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-neutral-700" />
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
          onClose={() => { navigateTo('/'); setIsSearchBarOpen(true); }}
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
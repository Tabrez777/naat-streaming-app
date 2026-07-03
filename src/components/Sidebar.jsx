import React, { useState } from 'react';

// 1. FIX: Added onPlaylistSelect to the props here so it can be used!
const Sidebar = ({ playlists = [], setPlaylists, onPlaylistSelect, activeTab, setActiveTab,  isOpen, onClose }) => {
  
  // State to toggle the input field
  const [isCreating, setIsCreating] = useState(false);
  
  // State for the new playlist input text
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Handle creating a new playlist on Enter
  const handleSavePlaylist = (e) => {
    if (e.key === 'Enter' && newPlaylistName.trim() !== "") {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
        trackCount: 0,
        songs: [], // Crucial: Start with an empty array for songs
      };
      setPlaylists([newPlaylist, ...playlists]); // Add to top of custom playlists
      setNewPlaylistName("");
      setIsCreating(false);
    }
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewPlaylistName("");
    }
  };

  return (
    <aside className={`w-64 h-screen text-white flex flex-col pt-3 pb-6 px-4 select-none border-r border-neutral-900 fixed md:static top-0 left-0 z-40 transition-transform duration-300 ease-in-out bg-linear-to-b from-neutral-900 to-black ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`} style={{ borderRight:'1.4px solid #77686856'}}>
      
      {/* 🧭 Main Navigation Links */}
      <div className="flex flex-col gap-1 mb-2">
       <div className="flex items-center gap-4 px-2 mb-4 h-12 flex-shrink-0 md:hidden">
  
  {/* Close 'X' Button */}
  <button 
    onClick={onClose}
    className="text-white hover:bg-neutral-800 p-2 rounded-full transition duration-200 focus:outline-none"
    aria-label="Close sidebar"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
  
  {/* Red Play Circle Icon + Website Name */}
  <div className="flex items-center gap-1.5 cursor-pointer">
    <div className="w-6 h-6 bg-[#FF0000] rounded-full flex items-center justify-center">
      <svg className="w-3 h-3 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
    <span className="text-xl font-bold tracking-tight font-sans">TEZ</span>
  </div>
</div>
        {/* Home */}
        <button 
          onClick={() => {
            setActiveTab("Home");
            onPlaylistSelect(null); // Optional: Click Home to go back to Main dashboard
          }}
          className={`flex cursor-pointer items-center gap-6 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'Home' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-300 hover:bg-neutral-900'
          }`}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 10V21h6v-6h4v6h6V10l-8-7z" />
          </svg>
          Home
        </button>
        <button 
          onClick={() => setActiveTab('Settings')}
          className={`flex cursor-pointer items-center gap-6 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'Home' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-300 hover:bg-neutral-900'
          }`}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.22-.07.49.12.61l2.03 1.58c-.04.3-.06.63-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
          Setting
        </button>
      </div>

      {/* ➖ Divider Line */}
      <hr className="border-neutral-800 my-2 mx-2" />

      {/* ➕ New Playlist Pill Button */}
      <div className="px-2 py-2">
        {!isCreating ? (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium py-2.5 px-4 rounded-full transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New playlist
          </button>
        ) : (
          <input
            autoFocus
            type="text"
            placeholder="Playlist name... (Press Enter)"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={handleSavePlaylist}
            onBlur={() => setIsCreating(false)}
            className="w-full px-4 py-2 text-sm bg-neutral-900 text-white rounded-full border border-neutral-700 focus:outline-none focus:border-neutral-500 transition-colors"
          />
        )}
      </div>

      {/* 📜 Auto Playlists Container */}
      <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-4 mt-3 scrollbar-none">
        
        {/* Liked Music */}
        <div className="flex flex-col cursor-pointer group">
          <span className="text-sm font-medium text-neutral-200 group-hover:text-white flex items-center gap-1.5">
            Liked Music
            <svg className="w-3.5 h-3.5 text-neutral-400 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </span>
          <span className="text-xs text-neutral-400 mt-0.5">Auto playlist</span>
        </div>

        {/* Episodes for Later */}

        {/* Custom Created Playlists */}
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            // 2. FIX: Typo corrected here. It is now exactly onPlaylistSelect!
            onClick={() => onPlaylistSelect(playlist)} 
            className="flex flex-col cursor-pointer group p-1 -mx-1 rounded hover:bg-neutral-900 transition-colors"
          >
            <span className="text-sm font-medium text-neutral-200 group-hover:text-white truncate">
              {playlist.name}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5">Playlist • {playlist.trackCount} tracks</span>
          </div>
        ))}
      </div>

    </aside>
  );
};

export default Sidebar;
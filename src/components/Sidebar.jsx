import React, { useState } from 'react';

// 1. FIX: Added onPlaylistSelect to the props here so it can be used!
const Sidebar = ({ playlists = [], setPlaylists, onPlaylistSelect }) => {
  
  // State to toggle the input field
  const [isCreating, setIsCreating] = useState(false);
  
  // State for the new playlist input text
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Track active navigation tab
  const [activeTab, setActiveTab] = useState("Home");

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
    <aside className="w-64 h-screen bg-black text-white flex flex-col pt-3 pb-6 px-4 select-none border-r border-neutral-900">
      
      {/* 🧭 Main Navigation Links */}
      <div className="flex flex-col gap-1 mb-2">
        {/* Home */}
        <button 
          onClick={() => {
            setActiveTab("Home");
            onPlaylistSelect(null); // Optional: Click Home to go back to Main dashboard
          }}
          className={`flex items-center gap-6 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
            activeTab === 'Home' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-300 hover:bg-neutral-900'
          }`}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 10V21h6v-6h4v6h6V10l-8-7z" />
          </svg>
          Home
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
        <div className="flex flex-col cursor-pointer group">
          <span className="text-sm font-medium text-neutral-200 group-hover:text-white">
            Episodes for Later
          </span>
          <span className="text-xs text-neutral-400 mt-0.5">Auto playlist</span>
        </div>

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
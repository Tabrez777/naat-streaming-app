// ✨ FIXED 1: Added useEffect to the import
import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ✨ FIXED 2: Added 'user' to the props list here
const Sidebar = ({ playlists = [], setPlaylists, onPlaylistSelect, activeTab, setActiveTab, isOpen, onClose, user }) => {
  
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleSavePlaylist = (e) => {
    if (e.key === 'Enter' && newPlaylistName.trim() !== "") {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
        trackCount: 0,
        songs: [],
      };
      setPlaylists([newPlaylist, ...playlists]); 
      setNewPlaylistName("");
      setIsCreating(false);
    }
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewPlaylistName("");
    }
  };
  
  const [contextMenu, setContextMenu] = useState({
    visible : false,
    x : 0,
    y : 0,
    playlist : null
  });

  const [renameModal, setRenameModal] = useState({
    isOpen: false,
    playlistId: null,
    newName: ""
  });

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({...contextMenu,visible:false});
    document.addEventListener("click",handleClickOutside);
    return () => {
      document.removeEventListener("click",handleClickOutside);
    }
  }, [contextMenu]);

  const handleRightClick = (e, playlist) => {
    e.preventDefault(); 
    
    let safeX = e.clientX;
    let safeY = e.clientY;
    
    // SMART FLIP: If clicked near the right edge, shift left
    if (e.clientX > window.innerWidth - 200) {
      safeX = e.clientX - 200;
    }
    
    // AGGRESSIVE FLIP: If clicked in the bottom 250px (near Playbar), force it UP!
    if (e.clientY > window.innerHeight - 250) {
      safeY = e.clientY - 180; // 180px pushes it safely above the cursor
    }
    
    setContextMenu({
      visible: true,
      x: safeX,
      y: safeY,
      playlist: playlist
    });
  };

  const syncToFirebase = async (updatedPlaylists) => {
    setPlaylists(updatedPlaylists);
    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { playlists: updatedPlaylists });
    }
  };

  const handlePin = () => {
    const updated = playlists.map(p => 
      p.id === contextMenu.playlist.id ? { ...p, isPinned: !p.isPinned } : p
    );
    syncToFirebase(updated);
  };

  // 1. Opens the custom modal instead of the browser prompt
  const handleRename = () => {
    setRenameModal({
      isOpen: true,
      playlistId: contextMenu.playlist.id,
      newName: contextMenu.playlist.name
    });
    // Hide the context menu so it's not floating behind the modal
    setContextMenu({ ...contextMenu, visible: false }); 
  };

  // 2. Saves the new name to Firebase when the user clicks "Save"
  const submitRename = () => {
    if (!renameModal.newName || renameModal.newName.trim() === "") {
      setRenameModal({ isOpen: false, playlistId: null, newName: "" });
      return;
    }
    
    const updated = playlists.map(p => 
      p.id === renameModal.playlistId ? { ...p, name: renameModal.newName } : p
    );
    syncToFirebase(updated);
    
    // Close the modal
    setRenameModal({ isOpen: false, playlistId: null, newName: "" });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${contextMenu.playlist.name}"?`);
    if (!confirmDelete) return;

    const updated = playlists.filter(p => p.id !== contextMenu.playlist.id);
    syncToFirebase(updated);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://tez-music-app.web.app/playlist/${contextMenu.playlist.id}`);
    alert("Playlist link copied to clipboard!");
  };

  const sortedPlaylists = [...playlists].sort((a, b) => (b.isPinned === true) - (a.isPinned === true));

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
            onPlaylistSelect(null); 
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
            activeTab === 'Settings' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-300 hover:bg-neutral-900'
          }`}
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.22-.07.49.12.61l2.03 1.58c-.04.3-.06.63-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
          Setting
        </button>
      </div>

      <hr className="border-neutral-800 my-2 mx-2" />

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

      <div className="flex-1 overflow-y-auto px-2 flex flex-col gap-4 mt-3 scrollbar-none">
        
        

        {/* ✨ FIXED 3: Removed the comment from inside the div properties */}
       {/* ✨ FIXED 3: Removed the comment from inside the div properties */}
        {sortedPlaylists.map((playlist) => (
          <div 
            key={playlist.id}
            onClick={() => onPlaylistSelect(playlist)}
            onContextMenu={(e) => handleRightClick(e, playlist)}
            className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-md cursor-pointer transition group"
          >
            {/* ✨ NEW: Stacked the title and the track count! */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                {playlist.isPinned ? "📌 " : ""}{playlist.name}
              </span>
              <span className="text-xs text-neutral-400 mt-0.5">
                Playlist • {playlist.songs ? playlist.songs.length : 0} tracks
              </span>
            </div>
          </div>
        ))}
      {contextMenu.visible && (
        <div 
          className="fixed z-[9999] w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden py-1 text-sm text-neutral-300"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handlePin} className="w-full text-left px-4 py-2 hover:bg-neutral-700 hover:text-white transition">
            {contextMenu.playlist?.isPinned ? "Unpin Playlist" : "Pin Playlist"}
          </button>
          
          <button onClick={handleRename} className="w-full text-left px-4 py-2 hover:bg-neutral-700 hover:text-white transition">
            Rename
          </button>
          
          <button onClick={handleShare} className="w-full text-left px-4 py-2 hover:bg-neutral-700 hover:text-white transition border-b border-neutral-700">
            Share Link
          </button>
          
          <button onClick={handleDelete} className="w-full text-left px-4 py-2 hover:bg-neutral-700 text-red-400 hover:text-red-300 transition">
            Delete
          </button>
        </div>
      )}
      </div>
      {renameModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm transform transition-all">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Rename Playlist</h3>
            
            <input 
              autoFocus
              type="text"
              value={renameModal.newName}
              onChange={(e) => setRenameModal({ ...renameModal, newName: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && submitRename()}
              className="w-full bg-black text-white px-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#1ed760] transition-colors"
              placeholder="Playlist name..."
            />
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setRenameModal({ isOpen: false, playlistId: null, newName: "" })}
                className="flex-1 py-2.5 rounded-full font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitRename}
                className="flex-1 py-2.5 rounded-full font-bold bg-[#1ed760] text-black hover:bg-[#1fdf64] hover:scale-105 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
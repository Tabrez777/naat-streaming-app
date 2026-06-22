import React, { useState } from 'react';

const Playlist = () => {
  // 1. State to hold our array of playlists
  const [playlists, setPlaylists] = useState([]);
  
  // 2. State to toggle the input field on and off
  const [isCreating, setIsCreating] = useState(false);
  
  // 3. State to hold the text the user is typing
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Function to handle saving the playlist
  const handleSavePlaylist = (e) => {
    // If the user presses Enter and the input isn't empty
    if (e.key === 'Enter' && newPlaylistName.trim() !== "") {
      const newPlaylist = {
        id: Date.now(), // Generate a unique ID
        name: newPlaylistName,
        trackCount: 0,
      };
      
      setPlaylists([...playlists, newPlaylist]); // Add to the list
      setNewPlaylistName(""); // Clear the input
      setIsCreating(false); // Hide the input field
    }
    
    // Cancel if they press Escape
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewPlaylistName("");
    }
  };

  return (
    <div className="w-1/4 h-[85vh] border-2 flex flex-col rounded-lg p-4 bg-neutral-700 text-white">
      
      {/* Header Wrapper */}
      <div className="flex flex-row items-center justify-between w-full mb-6">
        <p className="text-xl font-bold">Playlist</p>

        {/* Add Button */}
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 group hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="flex items-center justify-center cursor-pointer w-8 h-8 bg-neutral-700 rounded-sm group-hover:bg-neutral-600 transition-colors duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Create</span>
        </button>
      </div>

      {/* Playlist Container */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        
        {/* The Input Field (Only shows when isCreating is true) */}
        {isCreating && (
          <input
            autoFocus
            type="text"
            placeholder="Playlist name... (Press Enter)"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={handleSavePlaylist}
            onBlur={() => setIsCreating(false)} // Hides if they click away
            className="w-full px-3 py-2 text-sm bg-neutral-800 text-white rounded-md border border-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
        )}

        {/* Map through the playlists array and render them */}
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="flex flex-row items-center gap-3 p-2 rounded-md hover:bg-neutral-600 cursor-pointer transition-colors group"
          >
            {/* Thumbnail Placeholder */}
            <div className="w-12 h-12 bg-neutral-500 rounded-md flex-shrink-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col overflow-hidden">
              <p className="font-semibold text-sm truncate text-white">{playlist.name}</p>
              <p className="text-xs text-neutral-400 truncate">Playlist • {playlist.trackCount} tracks</p>
            </div>
          </div>
        ))}

        {/* Empty State (Only shows if no playlists AND not creating one) */}
        {playlists.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center h-40 text-center text-neutral-400">
            <p className="text-sm">You don't have any playlists yet.</p>
            <p className="text-xs mt-1">Click 'Create' to make one.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Playlist;
import React, { useState } from 'react';

const PlayPage = ({ 
  naat, 
  onClose, 
  isPlaying, 
  togglePlay, 
  currentTime, 
  duration, playNext, playPrevious,
  handleSeek, 
  volume, 
  handleVolumeChange,
  // Pass the actual playlists from your parent app here. 
  // We default to an empty array so you can test the random creation!
  userPlaylists = [] ,
  onSaveToPlaylist
}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- NEW LOGIC: Handling the Save Action ---
  const handleAddPlaylist = (playlistName) => {
  if(onSaveToPlaylist){
    onSaveToPlaylist(playlistName)
  }

    setIsMenuOpen(false);
  };

  // --- NEW LOGIC: The Plus Button Click ---
  const handlePlusClick = () => {
    if (userPlaylists.length === 0) {
      // If no playlists exist, generate a random one and save immediately
      const randomID = Math.floor(Math.random() * 1000);
      const randomName = `Auto-Playlist #${randomID}`;
      
      handleAddPlaylist(randomName);
      alert(`No playlists found. Automatically created and added to: ${randomName}`);
    } else {
      // Playlists exist, just open the menu
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const formatTime = (time) => {
    if(!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDownload = async () => {
    if (!naat?.audioUrl) return;

    try {
      const response = await fetch(naat.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${naat.title || 'Track'}.mp3`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download track.");
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-linear-to-b from-neutral-800 to-black p-6 md:p-12 relative flex flex-col overflow-y-auto">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex justify-between items-center w-full mb-8 shrink-0">
        <button onClick={onClose} className="text-white hover:text-green-500 transition-colors p-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Now Playing</span>
        <button className="text-white hover:text-green-500 transition-colors p-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full min-h-full">
        
        {/* 2. Massive Artwork */}
        <div className="w-full aspect-square max-w-100 bg-neutral-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden mb-12 shrink-0">
          <img src={naat?.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>

        {/* 3. Title & Artist */}
        <div className="w-full flex justify-between items-center mb-8 px-4 shrink-0">
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-white text-3xl md:text-4xl font-bold truncate mb-1">{naat?.title || "No Track Selected"}</h1>
            <h2 className="text-neutral-400 text-lg md:text-xl truncate">{naat?.artist || "Unknown Artist"}</h2>
          </div>
          <button className="text-neutral-400 hover:text-green-500 transition-colors ml-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>

        {/* 4. Timeline Bar */}
        <div className="w-full px-4 mb-6 shrink-0">
          <div className="w-full flex items-center gap-3 text-sm text-neutral-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <input 
              type="range" min={0} max={duration || 0} value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-600 rounded-full appearance-none cursor-pointer accent-white hover:accent-green-500 transition-all"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 5. Main Playback Controls */}
        <div className="w-full flex justify-between items-center px-4 mb-8 shrink-0">
          
          {/* --- LEFT SIDE: Add to Playlist & Shuffle --- */}
          <div className="flex items-center gap-4 w-20">
            {/* Add to Playlist Container */}
            <div className="relative">
              
              {/* UPDATED BUTTON TRIGGER */}
              <button 
                onClick={handlePlusClick}
                className={`transition-colors ${isMenuOpen ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
                title="Add to Playlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </button>

              {/* The Glassy Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute bottom-full mb-4 left-0 w-48 bg-neutral-800/95 backdrop-blur-md border border-neutral-600 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-neutral-600 bg-neutral-900/50">
                    <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Save to...</p>
                  </div>
                  <div className="max-h-40 overflow-y-auto flex flex-col">
                    {userPlaylists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => handleAddPlaylist(playlist.name)}
                        className="text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-600 hover:text-white transition-colors focus:outline-none"
                      >
                        {playlist.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shuffle Button */}
            
          </div>
          
          {/* --- CENTER: Prev, Play, Next --- */}
          <button onClick={playPrevious} className="text-white hover:text-green-500 transition-colors">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          
          <button onClick={togglePlay} className="w-20 h-20 flex items-center justify-center bg-green-500 text-black rounded-full hover:scale-105 transition-transform shadow-lg shrink-0">
            {isPlaying ? (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <button onClick={playNext} className="text-white hover:text-green-500 transition-colors">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
          
          {/* --- RIGHT SIDE: Repeat --- */}
          <div className="flex items-center justify-end w-20">
            <button className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

        </div>

        {/* 6. Bottom Utilities */}
        <div className="w-full flex justify-between items-center px-4 pt-6 border-t border-neutral-800 shrink-0 pb-6">
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <div className="border-2 border-current rounded px-1.5 py-0.5 text-xs font-black">CC</div>
            <span className="text-sm font-semibold hidden md:block">Lyrics</span>
          </button>

          <button onClick={handleDownload} className="flex items-center gap-2 text-neutral-400 hover:text-green-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-1/3 max-w-37.5">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z"></path></svg>
            <input 
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer accent-white hover:accent-green-500 transition-all"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlayPage;
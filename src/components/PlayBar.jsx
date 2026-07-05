import React from 'react';

const PlayBar = ({ 
  naat, isVisible, onExpand, 
  isPlaying, togglePlay, currentTime, playNext, playPrevious, duration, handleSeek, 
  volume, isMuted, handleVolumeChange, toggleMute, 
  songs = [], onPlay 
}) => {

  const formatTime = (time) => {
    if(!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    onPlay(songs[randomIndex]);
  };

  // Calculate percentage for dynamic timeline/volume bars
  const progressPercent = (currentTime / (duration || 1)) * 100;

  return (
    <div className={`fixed bottom-0 left-0 w-full h-16 md:h-[90px] bg-neutral-950 md:bg-neutral-950/95 md:backdrop-blur-md border-t border-neutral-800 flex justify-between items-center px-3 md:px-6 z-[999] transform transition-transform duration-500 ease-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      
      {/* 1. Left Area: Metadata (Takes up more space on mobile) */}
      <div 
        onClick={onExpand} 
        className="flex-1 md:flex-none md:w-1/3 flex items-center gap-2 md:gap-4 overflow-hidden cursor-pointer hover:bg-neutral-800/50 rounded-lg p-1 md:p-2 transition-all mr-2 md:mr-0"
      >
        {naat?.coverUrl && (
          <img 
            src={naat.coverUrl} 
            alt="Album Art" 
            className="w-10 h-10 md:w-14 md:h-14 rounded-md object-cover shadow-md shrink-0" 
          />
        )}
        <div className="truncate flex flex-col justify-center">
          <h4 className="text-white text-sm font-semibold truncate">{naat?.title || "No Track"}</h4>
          <p className="text-neutral-400 text-xs truncate">{naat?.artist || "Unknown Artist"}</p>
        </div>
      </div>

      {/* 2. Center Area: Play Controls & Timeline */}
      <div className="flex flex-col items-center justify-center shrink-0 md:w-1/3 gap-1 md:gap-2">
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Previous Button - Hidden on Mobile */}
          <button onClick={playPrevious} className="hidden md:block text-neutral-400 cursor-pointer hover:text-white transition-colors">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>

          {/* Play/Pause Button - Slightly smaller on mobile */}
          <button onClick={togglePlay} className="w-8 h-8 md:w-9 md:h-9 flex cursor-pointer items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow">
            {isPlaying ? (
              <svg className="w-4 h-4 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4 md:w-4 md:h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          {/* Next Button - Visible on Mobile */}
          <button onClick={playNext} className="text-neutral-400 cursor-pointer hover:text-white transition-colors">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        
        {/* Timeline - Hidden completely on mobile screens! */}
        <div className="hidden md:flex w-full items-center gap-2 text-xs text-neutral-400 font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range" min={0} max={duration || 0} value={currentTime} 
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer accent-white hover:accent-[#1ed760] transition-all"
            style={{ background: `linear-gradient(to right, #ffffff ${progressPercent}%, #525252 ${progressPercent}%)` }}
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>
      

      {/* 3. Right Area: Volume & Shuffle (Hidden completely on mobile) */}
      <div className="hidden md:flex items-center justify-end w-1/3 gap-3 text-neutral-400">
        <button
          onClick={handleShufflePlay}
          className="w-5 h-5 border-2 border-transparent hover:border-neutral-500 text-neutral-400 cursor-pointer rounded-full flex items-center justify-center hover:text-white transition-colors"
          title="Shuffle Playlist"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>

        <button onClick={toggleMute} className="hover:text-white transition-colors ml-2">
          {isMuted || volume === 0 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z"></path></svg>
          )}
        </button>
        <input 
          type="range" min={0} max={1} step={0.01} value={volume} 
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-24 h-1 rounded-full appearance-none cursor-pointer accent-white hover:accent-[#1ed760] transition-all"
          style={{ background: `linear-gradient(to right, #ffffff ${volume * 100}%, #525252 ${volume * 100}%)` }}
        />
      </div>

    </div>
  );
};

export default PlayBar;
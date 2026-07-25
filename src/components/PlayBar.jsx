import React from 'react';

const PlayBar = ({ 
  naat, isVisible, onExpand, 
  isPlaying, togglePlay, currentTime, playNext, playPrevious, duration, handleSeek, 
  volume, isMuted, handleVolumeChange, toggleMute, toggleRepeat, isRepeating,
  songs = [], onPlay 
}) => {

  const formatTime = (time) => {
    if(!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleShufflePlay = (e) => {
    e.stopPropagation();
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    onPlay(songs[randomIndex]);
  };

  const progressPercent = (currentTime / (duration || 1)) * 100;

  return (
    // Height updated to 90px on desktop to fit the beautiful stacked center controls
    <div className={`fixed bottom-0 left-0 w-full h-[68px] md:h-[90px] bg-[#000000] md:bg-[#181818] border-t border-neutral-800 flex justify-between items-center px-3 md:px-4 z-[999] transform transition-transform duration-500 ease-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      
      {/* 1. Left Area: Track Info */}
      <div 
        onClick={onExpand} 
        className="flex-1 min-w-0 md:flex-none md:w-[30%] flex items-center gap-3 md:gap-4 overflow-hidden cursor-pointer group"
      >
        {naat?.coverUrl && (
          <div className="relative overflow-hidden rounded-md shadow-lg shrink-0 w-10 h-10 md:w-14 md:h-14 bg-neutral-800">
            <img 
              src={naat.coverUrl} 
              alt="Album Art" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
        )}
        <div className="flex flex-col justify-center min-w-0 pr-2">
          <h4 className="text-white text-sm font-semibold truncate hover:underline">{naat?.title || "No Track"}</h4>
          <p className="text-[#b3b3b3] text-[11px] md:text-xs truncate hover:underline hover:text-white transition-colors mt-0.5">{naat?.artist || "Unknown Artist"}</p>
        </div>
      </div>

      {/* 2. Center Area: Play Controls & Timeline (Stacked on Desktop) */}
      <div className="flex items-center justify-end md:flex-col md:justify-center md:w-[40%] max-w-[722px] gap-1 md:gap-2">
        
        {/* Buttons Row */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Shuffle */}
          <button 
            onClick={handleShufflePlay}
            className="hidden md:flex text-[#b3b3b3] hover:text-white transition-colors focus:outline-none w-8 h-8 items-center justify-center"
            title="Shuffle"
          >
            <svg className="w-[18px] h-[18px] cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
          </button>

          {/* Previous */}
          <button 
            onClick={(e) => { e.stopPropagation(); playPrevious(); }} 
            className="hidden md:flex text-[#b3b3b3] hover:text-white transition-colors focus:outline-none w-8 h-8 items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>

          {/* Play/Pause */}
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
            className="w-9 h-9 md:w-8 md:h-8 flex cursor-pointer items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-md focus:outline-none"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 md:w-[14px] md:h-[14px]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-5 h-5 md:w-[14px] md:h-[14px] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          {/* Next */}
          <button 
            onClick={(e) => { e.stopPropagation(); playNext(); }} 
            className="text-[#b3b3b3] hover:text-white transition-colors focus:outline-none w-8 h-8 flex items-center justify-center pr-1 md:pr-0"
          >
            <svg className="w-8 h-8 cursor-pointer md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>

          {/* Repeat */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleRepeat && toggleRepeat(); }}
            className={`hidden md:flex transition-colors focus:outline-none w-8 h-8 items-center justify-center ${isRepeating ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'}`}
            title="Repeat"
          >
            <svg className="cursor-pointer w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
          </button>
        </div>
        
        {/* Timeline (Desktop Only) - Fully Custom Progress Bar! */}
        <div className="hidden md:flex w-full items-center gap-2 group cursor-pointer" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-[#b3b3b3] font-medium min-w-[40px] text-right">
            {formatTime(currentTime)}
          </span>
          
          <div className="relative flex-1 h-1 bg-[#4d4d4d] rounded-full group-hover:h-1.5 transition-all">
            {/* The actual hidden input taking the clicks */}
            <input 
              type="range" min={0} max={duration || 0} value={currentTime} 
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* The visible filled bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1ed760] rounded-full pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Little circle thumb on hover */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
            </div>
          </div>

          <span className="text-[11px] text-[#b3b3b3] font-medium min-w-[40px] text-left">
            {formatTime(duration)}
          </span>
        </div>

      </div>
      
      {/* 3. Right Area: Volume (Desktop Only) */}
      <div className="hidden md:flex items-center justify-end w-[30%] gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white transition-colors focus:outline-none w-8 h-8 flex items-center justify-center">
          {isMuted || volume === 0 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          ) : volume < 0.5 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z"></path></svg>
          )}
        </button>

        {/* Custom Volume Bar implementation */}
        <div className="relative w-[90px] h-1 bg-[#4d4d4d] rounded-full group cursor-pointer hover:h-1.5 transition-all">
          <input 
            type="range" min={0} max={1} step={0.01} value={volume} 
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1ed760] rounded-full pointer-events-none"
            style={{ width: `${volume * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
          </div>
        </div>
      </div>

      {/* ✨ Mobile Mini Progress Bar! */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-800 md:hidden overflow-hidden">
        <div 
          className="h-full bg-white rounded-r-full transition-all duration-150 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

    </div>
  );
};

export default PlayBar;
import React, { useState, useRef, useEffect } from 'react';

const PlayBar = ({ naat, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Automatically trigger audio playback whenever a new Naat arrives
  useEffect(() => {
    if (naat && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [naat]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    /* DYNAMIC TAILWIND CLASS LOGIC:
      If isVisible is true: translate-y-0 (slides up into view)
      If isVisible is false: translate-y-full (hidden below the viewport)
    */
    <div className={`fixed bottom-0 left-0 w-full h-22.5 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center px-6 z-50 transform transition-transform duration-500 ease-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      
      {/* Hidden Audio Core */}
      <audio 
        ref={audioRef} 
        src={naat?.audioUrl} 
        onEnded={() => setIsPlaying(false)}
      />

      {/* Left Area: Metadata Descriptor */}
      <div className="flex items-center gap-4 w-1/3">
        {naat?.coverUrl && (
          <img 
            src={naat.coverUrl} 
            alt="Album Art" 
            className="w-14 h-14 rounded-md object-cover shadow-md" 
          />
        )}
        <div className="truncate">
          <h4 className="text-white text-sm font-semibold truncate">{naat?.title || "No Track"}</h4>
          <p className="text-neutral-400 text-xs truncate">{naat?.artist || "Unknown Artist"}</p>
        </div>
      </div>

      {/* Center Area: Action Controls */}
      <div className="flex flex-col items-center justify-center w-1/3 gap-2">
        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>

          <button 
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button className="text-neutral-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        
        {/* Track Scrubbing Timeline Bar */}
        <div className="w-full flex items-center gap-2 text-xs text-neutral-500">
          <span>0:00</span>
          <div className="w-full h-1 bg-neutral-700 rounded-full relative cursor-pointer group">
            <div className="absolute top-0 left-0 h-full w-0 bg-white group-hover:bg-green-500 rounded-full"></div>
          </div>
          <span>0:00</span>
        </div>
      </div>

      {/* Right Area: Supplementary System Utilities */}
      <div className="flex items-center justify-end w-1/3 gap-3 text-neutral-400">
        <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z"></path></svg>
        <div className="w-20 h-1 bg-neutral-700 rounded-full cursor-pointer">
          <div className="w-3/4 h-full bg-neutral-400 rounded-full"></div>
        </div>
      </div>

    </div>
  );
};

export default PlayBar;
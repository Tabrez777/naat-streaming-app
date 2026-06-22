import React, { useState, useRef, useEffect } from 'react';

const PlayBar = ({ naat, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Time States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume States (1 = 100% volume)
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(1); // Remembers volume before muting

  const formatTime = (time) => {
    if(!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  useEffect(() => {
    if (naat && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Browser blocked playback:", error);
          setIsPlaying(false);
        });
    }
  }, [naat]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  // --- NEW VOLUME LOGIC ---
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    // Automatically mute/unmute based on slider position
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute and restore previous volume
      setIsMuted(false);
      setVolume(previousVolume.current);
      audioRef.current.volume = previousVolume.current;
    } else {
      // Mute and save current volume
      setIsMuted(true);
      previousVolume.current = volume;
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full h-[90px] bg-neutral-950 border-t border-neutral-800 flex justify-between items-center px-6 z-[999] transform transition-transform duration-500 ease-out ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      
      <audio 
        ref={audioRef} 
        src={naat?.audioUrl} 
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
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
        
        <div className="w-full flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          
          <input 
            type="range" 
            min={0} 
            max={duration || 0} 
            value={currentTime} 
            onChange={(e) => {
              const newTime = Number(e.target.value);
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
            }}
            className="w-full h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer accent-white hover:accent-[#1ed760] transition-all"
          />
          
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Area: Volume Controls */}
      <div className="flex items-center justify-end w-1/3 gap-3 text-neutral-400">
        
        {/* Mute/Unmute Button */}
        <button onClick={toggleMute} className="hover:text-white transition-colors">
          {isMuted || volume === 0 ? (
            /* Muted Icon */
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
          ) : (
            /* Volume Icon */
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586l3.707 3.707A1 1 0 0015 19V5a1 1 0 00-1.707-.707L9.586 8H7a2 2 0 00-2 2z"></path></svg>
          )}
        </button>

        {/* Volume Slider */}
        <input 
          type="range" 
          min={0} 
          max={1} 
          step={0.01} 
          value={volume} 
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer accent-white hover:accent-[#1ed760] transition-all"
        />
      </div>

    </div>
  );
};

export default PlayBar;
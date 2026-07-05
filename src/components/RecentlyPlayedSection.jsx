import React, { useRef, useState } from 'react';

const RecentlyPlayedSection = ({ onPlay, recentlyPlayed = [] }) => {
  const scrollRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // ✨ If they haven't played anything yet, hide this entire section
  if (recentlyPlayed.length === 0) return null;

  const displayedSongs = showAll ? recentlyPlayed : recentlyPlayed.slice(0, 7);

  return (
    <div className="p-6 relative group font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Recently Played</h2>
        
        {recentlyPlayed.length > 7 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-bold cursor-pointer text-[#1ed760] hover:text-white transition-colors tracking-wider uppercase"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayedSongs.map((song) => (
          <div 
            key={song.id} 
            onClick={() => onPlay(song)}
            className="bg-neutral-800/40 p-4 relative group rounded-xl hover:bg-neutral-800 transition-all cursor-pointer min-w-[200px] w-[200px]"
          >
            <div className="relative aspect-square mb-4">
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                className="w-full h-full object-cover rounded-md shadow-lg"
              />
              <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-xl">
                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-white font-semibold truncate">{song.title}</h3>
            <p className="text-neutral-400 text-sm truncate mt-1">{song.artist}</p>
          </div>
        ))}
      </div>

      <button onClick={() => scroll('left')} className="absolute cursor-pointer left-10 top-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <button onClick={() => scroll('right')} className="absolute cursor-pointer right-10 top-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
};

export default RecentlyPlayedSection;
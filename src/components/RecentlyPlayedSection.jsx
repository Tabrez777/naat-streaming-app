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

  if (recentlyPlayed.length === 0) return null;

  // 🚀 REUSABLE ADVANCED SONG CARD
  // We use this for both the horizontal scroll AND the full page grid!
  const renderCard = (song, isGrid = false) => (
    <div 
      key={song.id} 
      onClick={() => onPlay(song)}
      className={`group/card p-4 rounded-2xl bg-neutral-900/40 hover:bg-neutral-800/80 transition-all duration-500 cursor-pointer border border-transparent hover:border-neutral-700/50 hover:shadow-2xl hover:shadow-black ${
        isGrid ? 'w-full' : 'min-w-[200px] w-[200px]'
      }`}
    >
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 translate-y-6 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 ease-out z-10">
          <div className="w-12 h-12 bg-[#1ed760] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1fdf64] shadow-xl shadow-[#1ed760]/40">
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-white font-bold truncate text-base mb-1 group-hover/card:text-[#1ed760] transition-colors duration-300">
        {song.title}
      </h3>
      <p className="text-neutral-400 text-sm truncate font-medium">
        {song.artist}
      </p>
    </div>
  );

  // 🚀 1. THE "NEW VIEW" (FULL PAGE GRID OVERLAY)
  if (showAll) {
    return (
      <div className="absolute inset-0 z-50 bg-gradient-to-b from-neutral-900 to-black overflow-y-auto pb-32">
        {/* Sticky Header with Back Button */}
        <div className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-xl px-8 py-6 flex items-center gap-6 border-b border-white/5 shadow-2xl">
          <button 
            onClick={() => setShowAll(false)}
            className="p-3 rounded-full bg-black/50 hover:bg-black hover:scale-105 transition-all cursor-pointer text-white shadow-lg border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-4xl font-extrabold tracking-tight">Recently Played</h1>
        </div>
        
        {/* Responsive Grid layout for all songs */}
        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {recentlyPlayed.map(song => renderCard(song, true))}
        </div>
      </div>
    );
  }

  // 🚀 2. STANDARD HORIZONTAL SCROLL VIEW
  return (
    <div className="p-6 relative group font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pr-2">
        <h2 className="text-white text-2xl font-bold tracking-tight">Recently Played</h2>
        
        {recentlyPlayed.length > 7 && (
          <button 
            onClick={() => setShowAll(true)}
            className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-md border border-neutral-800 hover:border-neutral-600 cursor-pointer"
          >
            <span className="text-xs font-bold text-neutral-300 group-hover/btn:text-white uppercase tracking-widest transition-colors">
              Show All
            </span>
            <svg 
              className="w-4 h-4 text-neutral-400 group-hover/btn:text-white transition-transform duration-300 group-hover/btn:translate-x-1" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Horizontal Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentlyPlayed.slice(0, 7).map(song => renderCard(song, false))}
      </div>

      {/* Hover Scroll Arrows */}
      <button onClick={() => scroll('left')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer left-4 top-[55%] -translate-y-1/2 bg-black/60 hover:bg-black/90 hover:scale-105 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-white/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <button onClick={() => scroll('right')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer right-4 top-[55%] -translate-y-1/2 bg-black/60 hover:bg-black/90 hover:scale-105 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-white/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

    </div>
  );
};

export default RecentlyPlayedSection;
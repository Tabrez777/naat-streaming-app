import React, { useRef, useState, useEffect } from 'react';

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

  useEffect(() => {
    if (showAll) {
      const mainContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [showAll]);

  if (recentlyPlayed.length === 0) return null;

  // ✨ Helper to intelligently render the exact right color badge for any played song!
  const getCategoryBadge = (category) => {
    const cat = category ? category.toLowerCase() : '';
    if (cat === 'naat') {
      return <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/80 backdrop-blur-md text-[#1ed760] border border-[#1ed760]/40 shadow-md">NAAT</div>;
    } else if (cat === 'qawwali') {
      return <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/80 backdrop-blur-md text-purple-400 border border-purple-500/40 shadow-md">QAWWALI</div>;
    } else if (cat === 'tilawat') {
      return <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/80 backdrop-blur-md text-amber-400 border border-amber-500/40 shadow-md">TILAWAT</div>;
    } else {
      return <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/80 backdrop-blur-md text-sky-400 border border-sky-500/40 shadow-md">AUDIO</div>;
    }
  };

  // ✨ ADVANCED UI: Levitating cards + Electric Cyan Hover Aura + Dynamic Badge!
  const renderCard = (song, isGrid = false) => (
    <div 
      key={song.id} 
      onClick={() => onPlay(song)}
      className={`group/card p-4 rounded-2xl bg-neutral-900/50 backdrop-blur-md hover:bg-neutral-800/90 transition-all duration-500 cursor-pointer border border-neutral-800/60 hover:border-sky-500/50 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(56,189,248,0.18)] ${
        isGrid ? 'w-full' : 'min-w-[200px] w-[200px]'
      }`}
    >
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-lg bg-neutral-800">
        
        {/* ✨ INTELLIGENT DYNAMIC BADGE */}
        {getCategoryBadge(song.category)}

        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 translate-y-6 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 ease-out z-10">
          <div className="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 hover:bg-sky-300 shadow-xl shadow-sky-500/50 transition-transform">
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-white font-bold truncate text-base mb-1 group-hover/card:text-sky-400 transition-colors duration-300">
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
      <div className="absolute top-0 left-0 w-full min-h-full z-[100] bg-[#121212] pb-32 animate-fade-in">
        <div className="sticky top-0 z-[110] bg-[#121212]/95 backdrop-blur-xl px-8 py-6 flex items-center gap-6 border-b border-white/10 shadow-2xl">
          <button 
            onClick={() => setShowAll(false)}
            className="p-3 rounded-full bg-black hover:bg-neutral-800 hover:scale-105 transition-all cursor-pointer text-white shadow-lg border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-4xl font-extrabold tracking-tight flex items-center gap-3">
            Recently Played
            <span className="text-xs px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30 font-bold uppercase tracking-widest">History</span>
          </h1>
        </div>
        
        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 relative z-[105]">
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
        <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <span className="w-2 h-6 bg-sky-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)]"></span>
          <svg className="w-6 h-6 text-sky-400 translate-y-[0.5px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Played
        </h2>
        
        {recentlyPlayed.length > 7 && (
          <button 
            onClick={() => setShowAll(true)}
            className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-md border border-neutral-800 hover:border-sky-500/40 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            <span className="text-xs font-bold text-neutral-300 group-hover/btn:text-white uppercase tracking-widest transition-colors">
              Show All
            </span>
            <svg 
              className="w-4 h-4 text-neutral-400 group-hover/btn:text-sky-400 transition-all duration-300 group-hover/btn:translate-x-1" 
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
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentlyPlayed.slice(0, 7).map(song => renderCard(song, false))}
      </div>

      {/* Hover Scroll Arrows */}
      <button onClick={() => scroll('left')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer left-2 top-[55%] -translate-y-1/2 bg-black/80 hover:bg-black hover:scale-110 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-neutral-700/80 hover:border-sky-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <button onClick={() => scroll('right')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer right-2 top-[55%] -translate-y-1/2 bg-black/80 hover:bg-black hover:scale-110 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-neutral-700/80 hover:border-sky-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

    </div>
  );
};

export default RecentlyPlayedSection;
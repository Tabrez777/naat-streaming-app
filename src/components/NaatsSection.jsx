import React, { useRef, useState, useEffect } from 'react';

const NaatsSection = ({ songs = [], onPlay }) => {
  const scrollRef = useRef(null);
  const [showAll, setShowAll] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
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

  if (!songs || songs.length === 0) return null;

  // ✨ ADVANCED UI: Levitating cards + Emerald Neon Hover Aura + Frosted Category Badge!
  const renderCard = (song, isGrid = false) => (
    <div 
      key={song.id} 
      onClick={() => onPlay(song)} 
      className={`group/card p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-neutral-900/50 hover:bg-neutral-800/90 transition-all duration-300 cursor-pointer border border-neutral-800/60 hover:border-[#1ed760]/50 md:hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(30,215,96,0.15)] ${
        isGrid ? 'w-full' : 'min-w-[140px] w-[140px] md:min-w-[200px] md:w-[200px]'
      }`}
    >
      <div className="relative aspect-square mb-2 md:mb-4 rounded-lg md:rounded-xl overflow-hidden shadow-md bg-neutral-800">
        
        {/* ✨ PRO UI: FLOATING FROSTED GLASS CATEGORY PILL */}
        <div className="absolute top-1.5 left-1.5 md:top-2.5 md:left-2.5 z-20 px-1.5 md:px-2.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-extrabold tracking-wider uppercase bg-black/80 text-[#1ed760] border border-[#1ed760]/40 shadow-md">
          NAAT
        </div>

        <img src={song.coverUrl} alt={song.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 translate-y-6 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300 ease-out z-10">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-[#1ed760] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 hover:bg-[#1fdf64] shadow-xl shadow-[#1ed760]/50 transition-transform">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
      <h3 className="text-white font-bold truncate text-sm md:text-base mb-0.5 md:mb-1 group-hover/card:text-[#1ed760] transition-colors duration-300">{song.title}</h3>
      <p className="text-neutral-400 text-xs md:text-sm truncate font-medium">{song.artist}</p>
    </div>
  );

  // 🚀 THE "SEPARATE PAGE" (FULL PAGE GRID OVERLAY)
  if (showAll) {
    return (
      <div className="absolute top-0 left-0 w-full min-h-full z-[100] bg-[#121212] pb-32 animate-fade-in">
        <div className="sticky top-0 z-[110] bg-[#121212]/95 backdrop-blur-xl px-4 md:px-8 py-4 md:py-6 flex items-center gap-3 md:gap-6 border-b border-white/10 shadow-2xl">
          <button onClick={() => setShowAll(false)} className="p-2 md:p-3 rounded-full bg-black hover:bg-neutral-800 hover:scale-105 transition-all cursor-pointer text-white shadow-lg border border-white/10">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-white text-xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2 md:gap-3">
            Naat-e-Paak
            <span className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 bg-[#1ed760]/20 text-[#1ed760] rounded-full border border-[#1ed760]/30 font-bold uppercase tracking-widest">Collection</span>
          </h1>
        </div>
        
        <div className="p-3 md:p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 relative z-[105]">
          {songs.map(song => renderCard(song, true))}
        </div>
      </div>
    );
  }

  // 🚀 STANDARD HORIZONTAL SCROLL VIEW
  return (
    <div className="p-3 md:p-6 relative group font-sans">
      <div className="flex items-center justify-between mb-3 md:mb-6 pr-2">
        <h2 className="text-white text-lg md:text-2xl font-bold tracking-tight flex items-center gap-2 md:gap-2.5">
          <span className="w-1.5 md:w-2 h-5 md:h-6 bg-[#1ed760] rounded-full shadow-[0_0_12px_#1ed760]"></span>
          Naat-e-Paak
        </h2>
        
        {songs.length > 7 && (
          <button onClick={() => setShowAll(true)} className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-md border border-neutral-800 hover:border-[#1ed760]/40 cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(30,215,96,0.15)]">
            <span className="text-xs font-bold text-neutral-300 group-hover/btn:text-white uppercase tracking-widest transition-colors">Show All</span>
            <svg className="w-4 h-4 text-neutral-400 group-hover/btn:text-[#1ed760] transition-all duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
      
      <div ref={scrollRef} className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {songs.slice(0, 7).map(song => renderCard(song, false))}
      </div>

      <button onClick={() => scroll('left')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer left-2 top-[55%] -translate-y-1/2 bg-black/80 hover:bg-black hover:scale-110 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-neutral-700/80 hover:border-[#1ed760]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button onClick={() => scroll('right')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer right-2 top-[55%] -translate-y-1/2 bg-black/80 hover:bg-black hover:scale-110 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-neutral-700/80 hover:border-[#1ed760]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>
  );
};

export default NaatsSection;
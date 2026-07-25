import React, { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';

const ArtistSection = ({ artists, onArtistClick }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const handleArtistClick = (artist) => {
    if (onArtistClick) onArtistClick(artist);
    navigate(`/artist/${artist.id}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  
  if (!artists || artists.length === 0) return null;

  const visibleArtists = artists.filter((artist) => artist && artist.name && artist.name.trim() !== "");

  // 🚀 REUSABLE ADVANCED ARTIST CARD (Circular design for artists)
  const renderArtistCard = (artist, isGrid = false) => (
    <div 
      key={artist.id}
      onClick={() => handleArtistClick(artist)}
      className={`group/card p-4 rounded-2xl hover:bg-neutral-800/60 transition-all duration-500 cursor-pointer flex flex-col items-center border border-transparent hover:border-neutral-700/50 hover:shadow-2xl hover:shadow-black ${isGrid ? 'w-full' : 'shrink-0 w-[180px]'}`}
    >
      <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-xl shadow-black/40 transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:-translate-y-2 group-hover/card:shadow-[#1ed760]/20 relative">
        <img src={artist.imageUrl || "/default-avatar.png"} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300"></div>
      </div>
      <h3 className="text-white text-base font-bold w-full text-center truncate group-hover/card:text-[#1ed760] transition-colors">{artist.name}</h3>
      <p className="text-neutral-400 text-sm w-full text-center truncate font-medium mt-1">{artist.profession || "Artist"}</p>
    </div>
  );

  // 🚀 1. THE "SEPARATE PAGE" (FLAWLESS FIXED OVERLAY)
  if (showAll) {
    return (
      // ✨ FIX: "fixed inset-0" covers the screen. "overflow-y-auto" gives it a perfect scrollbar!
      <div className="fixed inset-0 z-[900] bg-[#121212] overflow-y-auto animate-in fade-in duration-300">
        <div className="sticky top-0 z-[910] bg-[#121212]/95 backdrop-blur-md px-8 py-6 flex items-center gap-6 border-b border-white/5 shadow-2xl">
          <button onClick={() => setShowAll(false)} className="p-3 rounded-full bg-black hover:bg-neutral-800 hover:scale-105 transition-all cursor-pointer text-white shadow-lg border border-white/10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-white text-4xl font-extrabold tracking-tight">Popular Artists</h1>
        </div>
        
        {/* pb-32 ensures the PlayBar doesn't cover your bottom artists */}
        <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-32">
          {visibleArtists.map(artist => renderArtistCard(artist, true))}
        </div>
      </div>
    );
  }

  // 🚀 2. STANDARD HORIZONTAL SCROLL VIEW
  return (
    <div className="p-6 relative group font-sans">
      <div className="flex items-center justify-between mb-6 pr-2">
        <h2 className="text-white text-2xl font-bold tracking-tight">Popular Artists</h2>
        
        {visibleArtists.length > 5 && (
          <button onClick={() => setShowAll(true)} className="group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/60 hover:bg-neutral-800 transition-all duration-300 backdrop-blur-md border border-neutral-800 hover:border-neutral-600 cursor-pointer">
            <span className="text-xs font-bold text-neutral-300 group-hover/btn:text-white uppercase tracking-widest transition-colors">Show All</span>
            <svg className="w-4 h-4 text-neutral-400 group-hover/btn:text-white transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
      
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {visibleArtists.slice(0, 5).map(artist => renderArtistCard(artist, false))}
      </div>

      <button onClick={() => scroll('left')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer left-4 top-[55%] -translate-y-1/2 bg-black/60 hover:bg-black/90 hover:scale-105 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-white/10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
      <button onClick={() => scroll('right')} className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer right-4 top-[55%] -translate-y-1/2 bg-black/60 hover:bg-black/90 hover:scale-105 backdrop-blur-xl p-3 rounded-full text-white z-20 shadow-2xl border border-white/10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
    </div>
  );
};

export default ArtistSection;
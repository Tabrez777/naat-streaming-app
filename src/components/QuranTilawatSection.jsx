import React, { useRef } from 'react';

const QuranTilawatSection = ({ onPlay, songs = [] }) => {
  const scrollRef = useRef(null);

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

  // ✨ FILTER: Only keep tracks tagged as 'tilawat'
  const tilawats = songs.filter(song => song.category === 'tilawat');

  // Hide the section if no Tilawat is uploaded yet
  if (tilawats.length === 0) return null;

  return (
    <div className="p-6 relative group font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Quran Tilawat</h2>
      </div>
      
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tilawats.map((song) => (
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

      {/* LEFT Scroll Button */}
      <button onClick={() => scroll('left')} className="absolute cursor-pointer left-10 top-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
        <svg 
  width="20" 
  height="20" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="white" 
  strokeWidth="2" 
  strokeLinecap="round" 
  strokeLinejoin="round"
>
  <path d="M15 18l-6-6 6-6"/>
</svg>
      </button>

      {/* 3. RIGHT Scroll Button (Moved outside the scrolling div) */}
      <button onClick={() => scroll('right')} className="absolute cursor-pointer right-10 top-1/2 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
        <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6"/>
  </svg>
      </button>
    </div>
  );
};

export default QuranTilawatSection;
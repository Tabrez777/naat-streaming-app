import React, { useRef } from 'react';

const OtherSongsSection = ({ onPlay, songs = [] }) => {
  // 1. Setup the scroll reference and function
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust this to change how far it scrolls
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 2. Filter for Qawwalis only
  const qawwalis = songs.filter(song => song.category === 'qawwali');

  if (qawwalis.length === 0) return null;

  return (
    <div className="p-6 relative group font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Recently Added Qawwalis</h2>
      </div>
      
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {qawwalis.map((song) => (
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

        {/* LEFT Scroll Button (Fixed to say 'left' instead of 'right') */}
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-10 top-1/2 transform -translate-y-1/2 
                     bg-black/30 backdrop-blur-md border cursor-pointer border-white/10 
                     text-white p-4 rounded-full shadow-2xl 
                     hover:bg-black/50 hover:scale-110 transition-all z-20"
        >
          <img width={20} src="icons/arrow-left.png" alt="Scroll Left" />
        </button>

        {/* RIGHT Scroll Button */}
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-15 top-1/2 transform -translate-y-1/2 
                     bg-black/30 backdrop-blur-md border cursor-pointer border-white/10 
                     text-white p-4 rounded-full shadow-2xl 
                     hover:bg-black/50 hover:scale-110 transition-all z-20"
        >
          <img width={20} src="icons/arrow-right.png" alt="Scroll Right" />
        </button>
      </div>
    </div>
  );
};

export default OtherSongsSection;
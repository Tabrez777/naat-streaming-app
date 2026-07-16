// ✨ FIXED 1: Added useState to the import line
import React, { useState, useRef } from 'react'; 

const ArtistSection = ({ artists, onArtistClick, songs = [] }) => {
  const scrollRef = useRef(null);

  // State is now properly imported and won't crash
  const [showAll, setShowAll] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (!artists || artists.length === 0) {
    return <div className="p-6 text-neutral-400">Loading artists...</div>;
  }

  // ✨ Tip: You might want to check artists.length instead of songs.length here!
  const visibleArtists = artists.filter((artist) => artist && artist.name && artist.name.trim() !== "");

  return (
    <div className="p-6 font-sans flex flex-col relative">
      
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-white text-2xl font-bold">Popular Artists</h2>
        
        {/* Only show the button if there are more than 7 artists */}
        {visibleArtists.length > 5 && (
          <button 
            onClick={() => setShowAll(!showAll)} 
            className='text-sm font-bold cursor-pointer text-neutral-400 hover:text-white transition-colors tracking-wider uppercase'
          >
            {showAll ? 'Show Less' : 'Show All'} 
          </button>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <button onClick={() => scroll('left')} className="absolute left-10 top-1/3 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20 hover:scale-110 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <button onClick={() => scroll('right')} className="absolute right-10 top-1/3 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20 hover:scale-110 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Scrollable Container */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
        
        {/* ✨ FIXED 2: Added .slice() so the Show All button actually controls the UI! */}
        {visibleArtists
          .slice(0, showAll ? visibleArtists.length : 5) 
          .map((artist) => (
            <div 
              key={artist.id}
              onClick={() => onArtistClick(artist)}
              className="group shrink-0 w-40 cursor-pointer flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                <img src={artist.imageUrl || "/default-avatar.png"} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-base font-semibold w-full text-center truncate">{artist.name}</h3>
              <p className="text-neutral-400 text-sm w-full text-center truncate mt-1">{artist.profession}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistSection;
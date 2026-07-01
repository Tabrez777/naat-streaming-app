import React, { useRef } from 'react'; // ✨ 1. Added useRef here

const ArtistSection = ({ artists,onArtistClick }) => {
  const scrollRef = useRef(null);

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

  return (
    <div className="p-6 font-sans flex flex-col relative"> {/* Added relative */}
      <h2 className="text-white text-2xl font-bold mb-6">Popular Artists</h2>
      
      {/* Navigation Buttons (Placed OUTSIDE the map loop) */}
      <button onClick={() => scroll('left')} className="absolute left-10 top-1/3 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
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
      <button onClick={() => scroll('right')} className="absolute right-10 top-1/3 bg-black/30 backdrop-blur-md p-3 rounded-full text-white z-20">
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

      {/* Scrollable Container */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
        {artists.map((artist) => (
          <div key={artist.id}
          onClick={() => onArtistClick(artist)}
           className="group shrink-0 w-40 cursor-pointer flex flex-col items-center">
            <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
              <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
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
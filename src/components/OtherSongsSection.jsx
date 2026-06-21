import React from 'react';

// 1. Mock data for your recent songs
const recentSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    coverUrl: "https://via.placeholder.com/200"
  },
  {
    id: 2,
    title: "Levitating",
    artist: "Dua Lipa",
    coverUrl: "https://via.placeholder.com/200"
  },
  {
    id: 3,
    title: "As It Was",
    artist: "Harry Styles",
    coverUrl: "https://via.placeholder.com/200"
  },
  {
    id: 4,
    title: "Cruel Summer",
    artist: "Taylor Swift",
    coverUrl: "https://via.placeholder.com/200"
  }
];

const OtherSongsSection = () => {
  return (
    // Container with CSS Grid
    <div className=" p-6  font-sans flex-col">
      <h2 className="text-white text-2xl font-bold  mb-6">Other Naats You May Like. </h2>
      
      <div className="flex gap-6 overflow-x-auto snap-x [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-mandatory">
        
        {/* 2. Map through the data to render cards */}
        {recentSongs.map((song) => (
          
          /* The 'group' class is critical here so the button knows when the card is hovered */
          <div 
            key={song.id} 
            className="group shrink-0 w-45 sm:w-50 snap-start bg-neutral-800 p-4 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-neutral-700"
          >
            {/* Artwork Wrapper */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <img 
                src={song.coverUrl} 
                alt={`${song.title} cover`} 
                className="w-full h-full object-cover"
              />
              
              {/* Play Button - Hidden by default, shown on group-hover */}
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 hover:bg-[#1fdf64] shadow-md">
                {/* Simple SVG Play Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            
            {/* Song Details */}
            <div className="flex flex-col gap-1">
              <h3 className="text-white text-base font-semibold truncate">
                {song.title}
              </h3>
              <p className="text-neutral-400 text-sm truncate">
                {song.artist}
              </p>
            </div>
          </div>
          
        ))}
        
      </div>
    </div>
  );
};

export default OtherSongsSection;
import React from 'react';

// Mock data for artists
const popularArtists = [
  { 
    id: 1, 
    name: "The Weeknd", 
    profession: "Artist", 
    imageUrl: "https://via.placeholder.com/200" 
  },
  { 
    id: 2, 
    name: "Dua Lipa", 
    profession: "Pop Artist", 
    imageUrl: "https://via.placeholder.com/200" 
  },
  { 
    id: 3, 
    name: "Metro Boomin", 
    profession: "Producer", 
    imageUrl: "https://via.placeholder.com/200" 
  },
  { 
    id: 4, 
    name: "Taylor Swift", 
    profession: "Singer-Songwriter", 
    imageUrl: "https://via.placeholder.com/200" 
  },
  { 
    id: 5, 
    name: "Calvin Harris", 
    profession: "DJ & Producer", 
    imageUrl: "https://via.placeholder.com/200" 
  }
];

const ArtistSection = () => {
  return (
    <div className="p-6 font-sans flex flex-col">
      <h2 className="text-black text-2xl font-bold mb-6">Popular Artists</h2>
      
      {/* Scrollable Container (Same as your fixed song row) */}
      <div className="flex gap-6 overflow-x-auto snap-x [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-mandatory pb-4">
        
        {popularArtists.map((artist) => (
          
          /* 
            Artist Card:
            - shrink-0 and w-[160px] keep it from squishing
            - flex-col and items-center center the image and text
          */
          <div 
            key={artist.id} 
            className="group shrink-0 w-40 snap-start cursor-pointer flex flex-col items-center"
          >
            {/* 
              Circular Image Wrapper:
              - rounded-full turns the square into a circle
              - group-hover:shadow-xl adds a nice glow/shadow on hover
              - group-hover:-translate-y-2 makes the picture lift up slightly
            */}
            <div className="w-full aspect-square rounded-full overflow-hidden mb-4 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
              <img 
                src={artist.imageUrl} 
                alt={`${artist.name} profile`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Text Details (Centered) */}
            <h3 className="text-black text-base font-semibold w-full text-center truncate">
              {artist.name}
            </h3>
            <p className="text-gray-500 text-sm w-full text-center truncate mt-1">
              {artist.profession}
            </p>
          </div>
          
        ))}
        
      </div>
    </div>
  );
};

export default ArtistSection;
import React from 'react';

// 1. Replaced blocked placeholders with actual image links and added audio paths
const recentSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_1KZAhOVmWq8L28kPDaF96O7x2Q1B1SFcVxgv_RxpxA&s=10",
    audioUrl: "/audios/Aa_Vi_Ja_Wallail_Zulfan_Walya.mp3" // Change this to your actual local file name
  },
  {
    id: 2,
    title: "Levitating",
    artist: "Dua Lipa",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrBdJl1FXfm32a0p8ELrmEBdiyedABybli_WwEUIww4zL0JaE9LxMwbLo&s=10",
    audioUrl: "/audios/Aajao_Aaqa_Mai_Ghar_Nu.mp3"
  },
  {
    id: 3,
    title: "As It Was",
    artist: "Harry Styles",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBuBtBXSkmWQ3nJAgY2sO7RzOnlsZLcUrCYnRSjwpYOg&s=10",
    audioUrl: "/audios/Aap_Aaqaon_k_Aqa.mp3"
  },
  {
    id: 4,
    title: "ALLAH_ALLAH_ALLAH_HO",
    artist: "Muhammad Shakeel Qadri",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_1KZAhOVmWq8L28kPDaF96O7x2Q1B1SFcVxgv_RxpxA&s=10",
    audioUrl: "/audios/ALLAH_ALLAH_ALLAH_HO.mp3" // Notice I removed spaces!
  }
];

// 2. Added { onPlay } as a prop
const OtherSongsSection = ({ onPlay }) => {
  return (
    <div className="p-6 font-sans flex-col">
      <h2 className="text-white text-2xl font-bold mb-6">Other Naats You May Like.</h2>
      
      <div className="flex gap-6 overflow-x-auto snap-x [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-mandatory">
        
        {recentSongs.map((song) => (
          <div 
            key={song.id} 
            className="group shrink-0 w-45 sm:w-50 snap-start bg-neutral-800 p-4 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-neutral-700"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <img 
                src={song.coverUrl} 
                alt={`${song.title} cover`} 
                className="w-full h-full object-cover"
              />
              
              {/* 3. Wired up the onClick event to the Play button */}
              <button 
                onClick={() => onPlay(song)}
                className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 hover:bg-[#1fdf64] shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            
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
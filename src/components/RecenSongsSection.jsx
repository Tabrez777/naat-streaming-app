import React from 'react';

// 1. Updated data with your real audio paths
const recentSongs = [
  {
    id: 1,
    title: "Aa Vi Ja Wallail Zulfan Walya",
    artist: "Naat Khawan Name",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBuBtBXSkmWQ3nJAgY2sO7RzOnlsZLcUrCYnRSjwpYOg&s=10", // You can replace this with a real image URL later
    audioUrl: "/audios/Aa Vi Ja Wallail Zulfan Walya.mp3"
  },
  {
    id: 2,
    title: "Aajao Aaqa Mai Ghar Nu",
    artist: "Nighat Asma Gulzar",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrBdJl1FXfm32a0p8ELrmEBdiyedABybli_WwEUIww4zL0JaE9LxMwbLo&s=10",
    audioUrl: "/audios/Aajao Aaqa Mai Ghar Nu.mp3" // Put this file in public/audios/
  },
  {
    id: 3,
    title: "Aap Aaqaon k Aqa",
    artist: "Muhammad Shakeel Qadri",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_1KZAhOVmWq8L28kPDaF96O7x2Q1B1SFcVxgv_RxpxA&s=10",
    audioUrl: "/audios/Aap Aaqaon k Aqa.mp3" // Put this file in public/audios/
  },
  {
    id: 4,
    title: "ALLAH ALLAH ALLAH HO",
    artist: "Ustad Nusrat Fateh Ali Khan",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0veoupnIhkRIDt0GgE3_m5wpbHc1L-r_c_SgjbxWuaQ&s=10",
    audioUrl: "/audios/ALLAH ALLAH ALLAH HO.mp3" // Put this file in public/audios/
  },
  {
    id: 5,
    title: "ALLAH ALLAH ALLAH HO",
    artist: "Ustad Nusrat Fateh Ali Khan",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0veoupnIhkRIDt0GgE3_m5wpbHc1L-r_c_SgjbxWuaQ&s=10",
    audioUrl: "/audios/ALLAH ALLAH ALLAH HO.mp3" // Put this file in public/audios/
  },
  {
    id: 6,
    title: "ALLAH ALLAH ALLAH HO",
    artist: "Ustad Nusrat Fateh Ali Khan",
    coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0veoupnIhkRIDt0GgE3_m5wpbHc1L-r_c_SgjbxWuaQ&s=10",
    audioUrl: "/audios/ALLAH ALLAH ALLAH HO.mp3" // Put this file in public/audios/
  }
];

// 2. Added { onPlay } here so it can receive the function from Main.jsx
const RecentSongsSection = ({ onPlay }) => {
  return (
    <div className="p-6 font-sans flex-col">
      <h2 className="text-white text-2xl font-bold mb-6">Recently uploded Naats</h2>
      
      <div className="flex gap-6 overflow-x-auto snap-x [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-mandatory">
        
        {recentSongs.map((song) => (
          <div 
            key={song.id} 
            className="group shrink-0 w-45 sm:w-50 snap-start bg-neutral-800 p-4 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-neutral-600"
          >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <img 
                src={song.coverUrl} 
                alt={`${song.title} cover`} 
                className="w-full h-full object-cover"
              />
              
              {/* 3. Changed onPlay(naat) to onPlay(song) to match the map variable */}
              <button 
              onClick={() => {
                console.log("Button clicked! Sending data:", song);
                onPlay(song)} }
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

export default RecentSongsSection;
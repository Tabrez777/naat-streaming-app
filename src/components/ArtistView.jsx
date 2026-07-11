import React from 'react';

const ArtistView = ({ artist, songs, onPlay, onBack }) => {
  // ✨ FILTER: Find all songs where the artist name matches the clicked artist
  const artistSongs = songs.filter(
    (song) => song.artist.toLowerCase() === artist.name.toLowerCase()
  );

  const handleShufflePlay = () => {
    if (artistSongs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * artistSongs.length);
    onPlay(artistSongs[randomIndex]);
  };

  const handleFollow = () => {
    alert(`Following ${artist.name}!`);
  };

  const handleDownloadPlaylist = () => {
    alert("Downloading a full playlist will require zipping multiple files! You can hook this up to your download logic later.");
  };

  return (
    <div className="h-full flex flex-col pb-24 overflow-y-auto font-sans relative">
      
      {/* Back Button (Made fixed relative to container so it doesn't move) */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-4 sm:left-6 bg-black/50 p-2 rounded-full hover:scale-110 transition-all text-white z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 1. Header Section (✨ RESPONSIVE: Stacks on mobile, row on desktop) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-6 pt-20 sm:pt-12 px-4 sm:px-6 text-center sm:text-left">
        
        {/* Artist Profile Image */}
        <img 
          src={artist.imageUrl || artist.coverUrl} 
          alt={artist.name}
          className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover shadow-2xl"
        />
        
        {/* Artist Info */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-xs sm:text-sm font-semibold text-neutral-300 uppercase tracking-widest mt-2 sm:mt-0">Artist</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 mb-2 sm:mb-4">{artist.name}</h1>
          <p className="text-sm sm:text-base text-neutral-400 font-medium">{artistSongs.length} Tracks</p>
        </div>
      </div>

      {/* ✨ RESPONSIVE ACTION BAR: Flex-wrap and centered on mobile */}
      {/* ✨ RESPONSIVE ACTION BAR */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-2 mb-6 px-4 sm:px-6">
        
        {/* Play Button (✨ FIXED: Now plays the artist's first track, not a random one) */}
        <button
          onClick={() => artistSongs.length > 0 && onPlay(artistSongs[0])}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1ed760] cursor-pointer text-black rounded-full flex items-center justify-center hover:bg-[#1fdf64] hover:scale-105 transition-all shadow-lg focus:outline-none shrink-0"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 translate-x-[2px]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Shuffle Button (Uses the fixed function from above) */}
        <button
          onClick={handleShufflePlay}
          className="text-neutral-400 cursor-pointer hover:text-white hover:scale-105 transition-all focus:outline-none shrink-0"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 16 16">
             <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 2.75l-2.829-2.828zM.39 3.5H0V2h.391a2.25 2.25 0 0 1 1.724.804l1.248 1.487-1.144 1.364L1.01 4.21A3.75 3.75 0 0 0 .39 3.5zm14.53 9.75-1.018-1.017a.75.75 0 0 0-1.06 1.06l2.829 2.828 2.828-2.828a.75.75 0 1 0-1.06-1.06l-1.018 1.017h-1.947a2.25 2.25 0 0 1-1.724-.804l-1.248-1.487 1.144-1.364 1.208 1.444A3.75 3.75 0 0 0 13.109 13h1.812z" />
          </svg>
        </button>

        {/* Download Button (Already working via the alert, but you can update it later) */}
        <button
          onClick={handleDownloadPlaylist}
          className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-neutral-500 text-neutral-400 cursor-pointer rounded-full flex items-center justify-center hover:border-white hover:text-white hover:scale-105 transition-all shrink-0"
          title="Download Playlist"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {/* Add/Follow Button (✨ FIXED: Added the onClick event!) */}
        <button 
          onClick={handleFollow}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer border-2 border-neutral-400 text-neutral-400 flex items-center justify-center hover:border-white hover:text-white hover:scale-105 transition-all focus:outline-none shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

      </div>

      {/* 2. Songs List Section */}
      <div className="flex flex-col gap-2 mt-2 px-4 sm:px-6">
        {artistSongs.length === 0 ? (
          <p className="text-neutral-400 text-center sm:text-left">No tracks found for this artist yet.</p>
        ) : (
          artistSongs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => onPlay(song)}
              className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="text-neutral-400 w-4 sm:w-6 text-center text-sm sm:text-base group-hover:hidden">{index + 1}</div>
              
              {/* Play icon appears on hover */}
              <div className="text-white w-4 sm:w-6 text-center hidden group-hover:block">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>

              <img src={song.coverUrl} alt={song.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover" />
              
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-white font-medium text-sm sm:text-base truncate">{song.title}</span>
                <span className="text-neutral-400 text-xs sm:text-sm truncate">{song.category === 'qawwali' ? 'Qawwali' : 'Naat'}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ArtistView;
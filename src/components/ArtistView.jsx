import React from 'react';

const ArtistView = ({ artist, songs, onPlay, onBack }) => {
  // ✨ FILTER: Find all songs where the artist name matches the clicked artist
  const artistSongs = songs.filter(
    (song) => song.artist.toLowerCase() === artist.name.toLowerCase()
  );

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto font-sans">
      
      {/* 1. Header Section */}
      <div className="flex items-end gap-6 mb-8 pt-4">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-black/50 p-2 rounded-full hover:scale-110 transition-all text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Artist Profile Image & Info */}
        <img 
          src={artist.imageUrl || artist.coverUrl} // Depends on what you named it in Firebase
          alt={artist.name}
          className="w-48 h-48 rounded-full object-cover shadow-2xl"
        />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-neutral-300 uppercase tracking-widest">Artist</p>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">{artist.name}</h1>
          <p className="text-neutral-400 font-medium">{artistSongs.length} Tracks</p>
        </div>
      </div>

      {/* 2. Songs List Section */}
      <div className="flex flex-col gap-2 mt-4">
        {artistSongs.length === 0 ? (
          <p className="text-neutral-400">No tracks found for this artist yet.</p>
        ) : (
          artistSongs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => onPlay(song)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="text-neutral-400 w-6 text-center group-hover:hidden">{index + 1}</div>
              
              {/* Play icon appears on hover */}
              <div className="text-white w-6 text-center hidden group-hover:block">
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>

              <img src={song.coverUrl} alt={song.title} className="w-12 h-12 rounded object-cover" />
              
              <div className="flex flex-col flex-1">
                <span className="text-white font-medium">{song.title}</span>
                <span className="text-neutral-400 text-sm">{song.category === 'qawwali' ? 'Qawwali' : 'Naat'}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ArtistView;
import React from 'react';

const PlaylistView = ({ playlist, onPlay, onBack }) => {
  // If no playlist is selected, don't render anything
  if (!playlist) return null;

  const songs = playlist.songs || [];

  return (
    <div className="flex-1 bg-neutral-900 rounded-lg p-6 overflow-y-auto text-white">
      
      {/* Header Section */}
      <div className="flex items-end gap-6 mb-8 border-b border-neutral-800 pb-6">
        <button 
          onClick={onBack}
          className="self-start mt-2 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        
        <div className="w-40 h-40 bg-neutral-700 rounded-xl shadow-2xl flex items-center justify-center flex-shrink-0">
          <svg className="w-16 h-16 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
        </div>
        
        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-1 text-neutral-400">Playlist</p>
          <h1 className="text-5xl font-black mb-2">{playlist.name}</h1>
          <p className="text-neutral-400 text-sm">{songs.length} tracks</p>
        </div>
      </div>

      {/* Song List Section */}
      <div className="flex flex-col gap-2">
        {songs.length === 0 ? (
          <div className="text-center text-neutral-500 py-12">
            <p>This playlist is empty.</p>
            <p className="text-sm mt-1">Go to the main page and click the + icon on a track to add it here!</p>
          </div>
        ) : (
          songs.map((song, index) => (
            <div 
              key={index} 
              onClick={() => onPlay(song)}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-neutral-800 cursor-pointer transition-colors group"
            >
              <span className="text-neutral-500 w-4 text-right">{index + 1}</span>
              <img src={song.coverUrl} alt="cover" className="w-10 h-10 rounded bg-neutral-700 object-cover" />
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-white group-hover:text-green-500 transition-colors">{song.title}</span>
                <span className="text-sm text-neutral-400">{song.artist}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default PlaylistView;
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ✨ FIXED 1: Replaced 'playlist' prop with 'allPlaylists' to match App.jsx
const PlaylistView = ({ allPlaylists, onPlay, onUnlike }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✨ FIXED 2: Find the correct playlist using the ID from the URL!
  // We use parseInt(id) because the URL ID is a string, but your playlist IDs are numbers
  const playlist = allPlaylists?.find(p => p.id === parseInt(id) || p.id === id);

  // If the playlist hasn't loaded yet or doesn't exist, show a safe fallback
  if (!playlist) {
    return (
      <div className="flex-1 bg-neutral-900 rounded-lg p-6 flex items-center justify-center text-neutral-400">
        Loading playlist...
      </div>
    );
  }

  const songs = playlist.songs || [];

  const randomCoverUrl = useMemo(() => {
    if (songs.length === 0) return null; 
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex].coverUrl;
  }, [songs]);
  
  const handleDownloadPlaylist = () => {
    alert("Downloading a full playlist will require zipping multiple files! You can hook this up to your download logic later.");
  };

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    onPlay(songs[randomIndex]);
  };

  const calculateTotalTime = (songsArray) => {
    const totalSeconds = songsArray.reduce((total, song) => total + (song.duration || 0), 0);
    if (totalSeconds === 0) return "";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `• ${hours} hr ${minutes} min`;
    }
    return `• ${minutes} min`;
  };

  const formatSongTime = (seconds) => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatPlayCount = (count) => {
    if (!count) return "0"; 
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(count);
  };

  return (
    <div className="flex-1 bg-neutral-900 rounded-lg p-6 overflow-y-auto text-white">
      
      {/* Header Section */}
      <div className="flex items-end gap-6 mb-8 border-b border-neutral-800 pb-6">
        
        {/* ✨ FIXED 3: Cleaned up the Back button onClick to only use navigate(-1) */}
        <button 
          onClick={() => navigate(-1)}
          className="self-start mt-2 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        
        <div className="w-24 h-24 md:w-40 md:h-40 bg-neutral-800 rounded-xl shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
          {randomCoverUrl ? (
            <img 
              src={randomCoverUrl} 
              alt="Playlist Cover" 
              className="w-full h-full object-cover shadow-lg"
            />
          ) : (
            <svg className="w-16 h-16 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
          )}
        </div>
        
        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-1 text-neutral-400">Playlist</p>
          <h1 className="text-5xl font-black mb-2">{playlist.name}</h1>
          <p className="text-neutral-400 py-2 text-sm">{songs.length} Tracks {calculateTotalTime(songs)} </p>

          <div className='flex items-center gap-4'>
            {/* Standard Play Button */}
            <button
              onClick={() => songs.length > 0 && onPlay(songs[0])}
              className="w-10 h-10 bg-[#1ed760] text-black cursor-pointer rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1fdf64] transition-all shadow-lg"
              title="Play Playlist"
            >
              <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            
            {/* Download Button */}
            <button
              onClick={handleDownloadPlaylist}
              className="w-10 h-10 border-2 border-neutral-500 text-neutral-400 cursor-pointer rounded-full flex items-center justify-center hover:border-white hover:text-white transition-colors"
              title="Download Playlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Shuffle Button */}
            <button
              onClick={handleShufflePlay}
              className="w-10 h-10 border-2 border-neutral-500 text-neutral-400 cursor-pointer rounded-full flex items-center justify-center hover:border-white hover:text-[#1ed760] hover:border-[#1ed760] transition-colors"
              title="Shuffle Playlist"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Song List Section */}
      <div className="flex flex-col gap-2">
        {songs.length === 0 ? (
          <div className="text-center text-neutral-500 py-12">
            <p>This playlist is empty.</p>
            <p className="text-sm mt-1">Go to the song page and click the + icon on a track to add it here!</p>
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
                <span className="font-semibold text-white group-hover:text-[#1ed760] transition-colors">{song.title}</span>
                <div className='flex'>
                <span className="text-sm text-neutral-400">{song.artist}</span>
                <span className="mx-2 text-neutral-600">•</span>
                <span className="shrink-0 flex items-center gap-1">
                    <svg className="w-3 h-3 text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    {formatPlayCount(song.playCount)}
                  </span></div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlike(song)} 
                }
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-2 transition-all"
              >
                <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div className="text-neutral-400 text-sm font-medium mr-4">
                {formatSongTime(song.duration)}
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-700 opacity-0 group-hover:opacity-100 group-hover:bg-[#1ed760] text-white group-hover:text-black transition-all shadow-md mr-2">
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
};

export default PlaylistView;
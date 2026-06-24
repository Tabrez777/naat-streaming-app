import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import PlayBar from './components/PlayBar';
import PlayPage from './components/PlayPage';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';

function App() {
  // --- CORE APP STATE ---
  const [playlists, setPlaylists] = useState([]);
  const [currentNaat, setCurrentNaat] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- AUDIO MASTER STATE ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(1);

  // Auto-play when a new Naat is selected from anywhere in the app
  useEffect(() => {
    if (currentNaat && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.error("Playback blocked:", e);
          setIsPlaying(false);
        });
    }
  }, [currentNaat]);

  // --- AUDIO CONTROL FUNCTIONS ---
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume.current);
      if (audioRef.current) audioRef.current.volume = previousVolume.current;
    } else {
      setIsMuted(true);
      previousVolume.current = volume;
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // Grouped props to keep our code clean when passing them down to players
  const audioProps = {
    isPlaying, togglePlay, 
    currentTime, duration, handleSeek, 
    volume, isMuted, handleVolumeChange, toggleMute
  };

  // --- PLAYLIST LOGIC ---
  const handleSaveToPlaylist = (playlistName, track) => {
    // Safety check: Don't try to save if nothing is playing
    if (!track) {
      alert("Please select and play a track before adding it to a playlist!");
      return;
    }

    setPlaylists(prevPlaylists => prevPlaylists.map(p => {
      if (p.name === playlistName) {
        // Ensure the songs array exists
        const currentSongs = p.songs || [];
        
        // Prevent duplicate songs in the same playlist
        if (currentSongs.some(s => s.title === track.title)) {
          alert("This track is already in the playlist!");
          return p;
        }

        const updatedSongs = [...currentSongs, track];
        
        return { 
          ...p, 
          songs: updatedSongs, 
          trackCount: updatedSongs.length 
        };
      }
      return p;
    }));
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden bg-linear-to-b from-neutral-900 to-black">
      
      {/* THE MASTER AUDIO TAG (Invisible) */}
      <audio 
        ref={audioRef} 
        src={currentNaat?.audioUrl} 
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
      />

      {/* FULL SCREEN PLAYER (When Expanded) */}
      {isExpanded ? (
        <div className="absolute inset-0 z-[1000] bg-black flex flex-col">
          <PlayPage 
            naat={currentNaat} 
            onClose={() => setIsExpanded(false)} 
            userPlaylists={playlists}
            onSaveToPlaylist={(playlistName) => handleSaveToPlaylist(playlistName, currentNaat)}
            {...audioProps} 
          />
        </div>
      ) : (
        // NORMAL LAYOUT (Navbar + Sidebar + Main/Playlist Content)
        <>
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className='flex gap-5 p-2 flex-1 overflow-hidden pb-24'>
            
            <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
              playlists={playlists}
              setPlaylists={setPlaylists}
              onPlaylistSelect={(playlist) => setSelectedPlaylist(playlist)} 
            />

            {/* DYNAMIC CONTENT AREA: Show Playlist if clicked, otherwise show Main Dashboard */}
            {selectedPlaylist ? (
              <PlaylistView 
                // We use .find() to ensure the view gets the most up-to-date song count from state
                playlist={playlists.find(p => p.id === selectedPlaylist.id)} 
                onPlay={(naat) => setCurrentNaat(naat)}
                onBack={() => setSelectedPlaylist(null)} // Closes the view and goes back to Main
              />
            ) : (
              <Main onPlay={(naat) => setCurrentNaat(naat)} />
            )}
            
          </div>
        </>
      )}

      {/* BOTTOM PLAY BAR (Always visible unless expanded) */}
      <PlayBar 
        naat={currentNaat} 
        isVisible={currentNaat !== null && !isExpanded} 
        onExpand={() => setIsExpanded(true)} 
        {...audioProps}
      />

    </div>
  );
}

export default App;
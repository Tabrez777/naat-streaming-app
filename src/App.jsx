import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './components/Main';
import PlayBar from './components/PlayBar';
import PlayPage from './components/PlayPage';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';
import AdminDashboard from './components/AdminDashboard';
import ArtistView from './components/ArtistView';
import SettingsView from './components/SettingsView';
import './index.css'; 

import { db } from './firebase'; 
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, increment, query, orderBy, limit } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

function App() {
  const navigate = useNavigate();
  
  // ✨ PRO UI: TOAST SNACKBAR STATE & MAGIC OVERRIDE
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Override default boring browser popup alerts with our futuristic Frosted Toast Snackbar!
    window.alert = (msg) => {
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    };
  }, []);

  // --- CORE APP STATE ---
  const [playlists, setPlaylists] = useState([]);
  const [currentNaat, setCurrentNaat] = useState(null);
  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  
  // --- AUDIO MASTER STATE ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const previousVolume = useRef(1);
  const [userProfile, setUserProfile] = useState({
    name: "Taffique",
    avatarUrl: "" 
  });
  const [trendingSongs, setTrendingSongs] = useState([]);

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
      const parsedData = JSON.parse(saved);
      const cleanData = parsedData.filter(song => song !== null && song.id && song.coverUrl);
      localStorage.setItem('recentlyPlayed', JSON.stringify(cleanData));
      return cleanData;
    }
    return [];
  });

  const toggleRepeat = () => setIsRepeating(!isRepeating);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const snapshot = await getDocs(collection(db, "artists"));
        const artistData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtists(artistData);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const handleAddNewSong = async (newSongData) => {
    try {
      const isDuplicate = songs.some(
        (song) => 
          song.title?.trim().toLowerCase() === newSongData.title?.trim().toLowerCase() && 
          song.category === newSongData.category
      );

      if (isDuplicate) {
        alert("Wait! This track has already been uploaded.");
        return;
      }

      const songsCollectionRef = collection(db, "songs"); 
      const docRef = await addDoc(songsCollectionRef, {
        ...newSongData,
        playCount: 0,
        createdAt: new Date(),
      });
      
      const newSong = { id: docRef.id, ...newSongData };
      setSongs((prevSongs) => [newSong, ...prevSongs]); 
      setShowAdmin(false);
      alert("Track uploaded successfully! 🎵");
    } catch (error) {
      console.error("Error adding track: ", error);
      alert("Uh oh! Failed to upload.");
    }
  };

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const allSnapshot = await getDocs(collection(db, "songs"));
        const songsList = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSongs(songsList);

        const trendingQuery = query(collection(db, "songs"), orderBy("playCount", "desc"), limit(10));
        const trendingSnapshot = await getDocs(trendingQuery);
        const trendingList = trendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrendingSongs(trendingList);
      } catch (error) {
        console.error("Error fetching music data:", error);
      }
    };
    fetchMusicData();
  }, []);

  useEffect(() => {
    let playTimer;
    if (isPlaying && currentNaat) {
      playTimer = setTimeout(async () => {
        try {
          const trackRef = doc(db, "songs", currentNaat.id);
          await updateDoc(trackRef, { playCount: increment(1) });
        } catch (error) {
          console.error("Failed to update play count:", error);
        }
      }, 30000); 
    }
    return () => clearTimeout(playTimer);
  }, [currentNaat, isPlaying]);

  useEffect(() => {
    const checkPersistentSession = async () => {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        try {
          const docRef = doc(db, "users", savedUserId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            setPlaylists(userData.playlists || []);
          } else {
            localStorage.removeItem('userId');
          }
        } catch (error) {
          console.error("Firebase auto-login error:", error);
        }
      }
      setLoading(false);
    };

    checkPersistentSession();
  }, []);

  useEffect(() => {
    if (currentNaat && audioRef.current) {
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(song => song.id !== currentNaat.id);
        const updated = [currentNaat, ...filtered].slice(0, 15);
        localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
        return updated;
      });

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            if (error.name !== "AbortError") {
              console.error("Playback blocked:", error);
              setIsPlaying(false);
            }
          });
      }
    }
  }, [currentNaat]);

  useEffect(() => {
    if (!loading && !user) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        navigate('/login', { replace: true }); 
      }
    }
  }, [user, loading, navigate]);

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

  const audioProps = {
    isPlaying, togglePlay, 
    currentTime, duration, handleSeek, 
    volume, isMuted, handleVolumeChange, toggleMute, toggleRepeat, isRepeating
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setPlaylists(userData.playlists || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setPlaylists([]);
    setSelectedPlaylist(null);
  };

  const handleSaveToPlaylist = async (playlistName, track) => {
    if (!track) return alert("Please select and play a track before adding it to a playlist!");

    const updatedPlaylists = playlists.map(p => {
      if (p.name === playlistName) {
        const currentSongs = p.songs || [];
        if (currentSongs.some(s => s.title === track.title)) {
          alert("This track is already in the playlist!");
          return p;
        }
        const updatedSongs = [...currentSongs, track];
        return { ...p, songs: updatedSongs, trackCount: updatedSongs.length };
      }
      return p;
    });

    setPlaylists(updatedPlaylists);
    alert(`Added to ${playlistName}! 🎵`);

    if (user && user.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { playlists: updatedPlaylists });
      } catch (err) {
        console.error("Failed to sync structural playlist to Firebase:", err);
      }
    }
  };

  const getActiveQueue = () => {
    if (selectedPlaylist) {
      const playlist = playlists.find(p => p.id === selectedPlaylist.id);
      return playlist?.songs || [];
    }
    if (selectedArtist) return songs.filter(s => s.artist === selectedArtist.name);
    if (currentNaat && currentNaat.category) {
      const categorySongs = songs.filter(s => s.category === currentNaat.category);
      if (currentNaat.category === 'tilawat') return categorySongs.reverse();
      return categorySongs;
    }
    return songs;
  };

  const playNext = () => {
    if (!currentNaat) return;
    const queue = getActiveQueue(); 
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(s => s.id === currentNaat.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % queue.length;
    setCurrentNaat(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentNaat) return;
    const queue = getActiveQueue(); 
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(s => s.id === currentNaat.id);
    const previousIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + queue.length) % queue.length;
    setCurrentNaat(queue[previousIndex]);
  };

  const handleLikeNaat = async (naat) => {
    if(!user) return alert("Please login to like tracks!");

    let likedPlaylist = playlists.find(p => p.name === "Liked Music");
    let updatedPlaylists;
    
    if(!likedPlaylist){
      likedPlaylist = {id: Date.now(), name:"Liked Music", songs: [naat], trackCount:1};
      updatedPlaylists = [...playlists, likedPlaylist];
    } else {
      if (likedPlaylist.songs.some(s => s.id === naat.id)) return; 
      likedPlaylist.songs = [...likedPlaylist.songs, naat];
      likedPlaylist.trackCount = likedPlaylist.songs.length;
      updatedPlaylists = playlists.map(p => p.name === "Liked Music" ? likedPlaylist : p);
    }
    
    setPlaylists(updatedPlaylists);
    alert("Added to your Liked Music! ❤️");
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { playlists: updatedPlaylists });
  };

  const handleUnlikeNaat = async (naat) => {
    const likedPlaylistIndex = playlists.findIndex(p => p.name === "Liked Music");
    if(likedPlaylistIndex === -1) return;

    const likedPlaylist = {...playlists[likedPlaylistIndex]};
    likedPlaylist.songs = likedPlaylist.songs.filter(s => s.id !== naat.id);
    likedPlaylist.trackCount = likedPlaylist.songs.length;

    const updatedPlaylists = [...playlists];
    updatedPlaylists[likedPlaylistIndex] = likedPlaylist;

    setPlaylists(updatedPlaylists);
    alert("Removed from Liked Music");
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { playlists: updatedPlaylists });
  };

  // ✨ PRO UI: ELITE LAUNCH LOADING SCREEN!
  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-gradient-to-b from-neutral-950 via-black to-black flex flex-col items-center justify-center text-white gap-6">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#1ed760]/30 animate-ping"></div>
          <div className="w-14 h-14 bg-[#FF0000] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,0,0,0.5)] z-10">
            <svg className="w-7 h-7 text-white fill-current translate-x-[2px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold tracking-widest font-sans text-white">TEZ MUSIC</span>
          <span className="text-xs text-[#1ed760] font-medium tracking-widest uppercase animate-pulse">Loading Experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-screen relative overflow-hidden bg-black text-white">
      
      <audio 
        ref={audioRef} 
        src={currentNaat?.audioUrl} 
        loop={isRepeating}
        onEnded={() => !isRepeating && playNext()}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      {/* ✨ ADVANCED UI: GLOBAL FROSTED FLOATING TOAST SNACKBAR */}
      {toastMessage && (
        <div className="fixed bottom-24 right-4 md:right-8 z-[99999] bg-neutral-900/95 backdrop-blur-2xl border border-neutral-700/80 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-bounce max-w-[90vw]">
          <div className="w-7 h-7 rounded-full bg-[#1ed760] flex items-center justify-center text-black font-extrabold text-sm shrink-0 shadow-[0_0_12px_#1ed760]">
            ✓
          </div>
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-neutral-400 hover:text-white ml-2 p-1 focus:outline-none font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userProfile={userProfile}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        closeSidebar={() => setIsSidebarOpen(false)}
        onAdminClick={() => setShowAdmin(true)} 
        songs={songs}
        onPlay={(naat) => setCurrentNaat(naat)}
      />

      {/* MAIN CONTENT AREA */}
      <div className='flex flex-1 w-full overflow-hidden relative'>
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          playlists={playlists}
          setPlaylists={setPlaylists}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onPlaylistSelect={(playlist) => setSelectedPlaylist(playlist)} 
          user={user}
        />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-gradient-to-b from-neutral-900 to-black">
          <Routes>
            <Route path="/" element={
              <Main 
                onPlay={(naat) => { setCurrentNaat(naat); navigate('/player'); }}
                songs={songs}
                setSongs={setSongs}
                artists={artists} 
                onArtistClick={(artist) => {
                  setSelectedArtist(artist)
                  navigate(`/artist/${artist.id}`)    
                }}
                recentlyPlayed={recentlyPlayed}
                trendingSongs={trendingSongs}
              />
            } />
              
            <Route path="/player" element={
              <div className="fixed inset-0 z-[1000] bg-black">
                <PlayPage 
                  naat={currentNaat} 
                  playPrevious={playPrevious}
                  playNext={playNext}
                  onClose={() => navigate('/')} 
                  userPlaylists={playlists}
                  handleLikeNaat={handleLikeNaat}
                  handleUnlikeNaat={handleUnlikeNaat}
                  onSaveToPlaylist={(playlistName) => handleSaveToPlaylist(playlistName, currentNaat)}
                  {...audioProps} 
                />
              </div>
            } />

            <Route path="/settings" element={<SettingsView userProfile={userProfile} onUpdateProfile={setUserProfile} onLogout={handleLogout} />} />
            <Route path="/playlist/:id" element={<PlaylistView allPlaylists={playlists} onPlay={(naat) => setCurrentNaat(naat)} onUnlike={handleUnlikeNaat} />} />
            <Route path="/artist/:id" element={<ArtistView artists={artists} songs={songs} onPlay={(naat) => setCurrentNaat(naat)} onBack={() => navigate('/')} />} />
            <Route path="/admin" element={(user?.email === "mdtaffique@gmail.com" || showAdmin) ? <AdminDashboard onAddSong={handleAddNewSong} onBack={() => setShowAdmin(false)} /> : <div className="p-10">Access Denied</div>} />

            <Route path="/login" element={<Main onPlay={(naat) => { setCurrentNaat(naat); navigate('/player'); }} songs={songs} setSongs={setSongs} artists={artists} onArtistClick={(artist) => { setSelectedArtist(artist); navigate(`/artist/${artist.id}`); }} recentlyPlayed={recentlyPlayed} trendingSongs={trendingSongs} />} />
            <Route path="/signup" element={<Main onPlay={(naat) => { setCurrentNaat(naat); navigate('/player'); }} songs={songs} setSongs={setSongs} artists={artists} onArtistClick={(artist) => { setSelectedArtist(artist); navigate(`/artist/${artist.id}`); }} recentlyPlayed={recentlyPlayed} trendingSongs={trendingSongs} />} />
          </Routes>
        </div>
      </div>

      {/* BOTTOM PLAY BAR */}
      <PlayBar 
        naat={currentNaat} 
        isVisible={currentNaat !== null && window.location.pathname !== '/player'} 
        onExpand={() => navigate('/player')} 
        playNext={playNext}
        playPrevious={playPrevious}
        songs={songs}
        onPlay={(naat) => setCurrentNaat(naat)}
        {...audioProps}
      />
    </div>
  );
}

export default App;
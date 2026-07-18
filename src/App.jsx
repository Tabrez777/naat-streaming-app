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

import { db } from './firebase'; 
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, increment, query, orderBy, limit } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

function App() {
  const navigate = useNavigate();
  // --- CORE APP STATE ---
  const [playlists, setPlaylists] = useState([]);
  const [currentNaat, setCurrentNaat] = useState(null);
  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artists, setArtists] = useState([])
  
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
        playCount : 0,
        createdAt: new Date(),
      });
      
      const newSong = { id: docRef.id, ...newSongData };
      setSongs((prevSongs) => [newSong, ...prevSongs]); 
      setShowAdmin(false);
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
      setRecentlyPlayed( prev => {
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
    if(!user) return alert("Please Login to Like Naats!");

    let likedPlaylist = playlists.find(p => p.name === "Liked Music");
    let updatedPlaylists;
    
    if(!likedPlaylist){
      likedPlaylist = {id: Date.now(), name:"Liked Music", songs: [naat], trackCount:1};
      updatedPlaylists = [...playlists, likedPlaylist]
    } else {
      if (likedPlaylist.songs.some(s => s.id === naat.id)) return; 
      likedPlaylist.songs = [...likedPlaylist.songs, naat];
      likedPlaylist.trackCount = likedPlaylist.songs.length;
      updatedPlaylists = playlists.map(p => p.name === "Liked Music" ? likedPlaylist : p);
    }
    
    setPlaylists(updatedPlaylists);
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
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { playlists: updatedPlaylists });
  };

  if (loading) {
    return (
      <div className="h-[100dvh] w-screen bg-black flex items-center justify-center text-white text-xl font-semibold tracking-wider">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    // ✨ CHANGED: h-[100dvh] for mobile browsers
    <div className="flex flex-col h-[100dvh] w-screen relative overflow-hidden bg-black text-white">
      
      <audio 
        ref={audioRef} 
        src={currentNaat?.audioUrl} 
        loop={isRepeating}
        onEnded={() => !isRepeating && playNext()}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />

      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userProfile={userProfile}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
        
        {/* ✨ CHANGED: Removed w-full, relies on flex-1. Added scroll-smooth */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-gradient-to-b from-neutral-900 to-black">
          <Routes>
            <Route path="/" element={
              <Main 
                onPlay={(naat) => { setCurrentNaat(naat); navigate('/player'); }}
                songs={songs}
                setSongs={setSongs}
                onArtistClick={(artist) => {
                  setSelectedArtist(artist)
                  navigate(`/artist/${artist.id}`)    
                }}
                recentlyPlayed={recentlyPlayed}
                trendingSongs={trendingSongs}
              />
            } />
            
            {/* Full Screen Player Route */}
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

            <Route path="/settings" element={<SettingsView userProfile={userProfile} onUpdateProfile={setUserProfile} />} />
            <Route path="/admin" element={(user?.email === "mdtaffique@gmail.com" || showAdmin) ? <AdminDashboard onAddSong={handleAddNewSong} onBack={() => setShowAdmin(false)} /> : <div className="p-10">Access Denied</div>} />
            <Route path="/playlist/:id" element={<PlaylistView allPlaylists={playlists} onPlay={(naat) => setCurrentNaat(naat)} onUnlike={handleUnlikeNaat} />} />
            <Route path="/artist/:id" element={<ArtistView artists={artists} songs={songs} onPlay={(naat) => setCurrentNaat(naat)} onBack={() => navigate('/')} />} />
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
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import PlayBar from './components/PlayBar';
import PlayPage from './components/PlayPage';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';
import AdminDashboard from './components/AdminDashboard';

// ✨ STEP 1: Import Firebase configurations
import { db } from './firebase'; 
import { doc, getDoc, updateDoc,collection,addDoc } from 'firebase/firestore';

function App() {
  // --- CORE APP STATE ---
  const [playlists, setPlaylists] = useState([]);
  const [currentNaat, setCurrentNaat] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); // Will now hold the complete user object from Firebase
  const [loading, setLoading] = useState(true); // Prevents flash of logged-out state
  const [showAdmin, setShowAdmin] = useState(false);

  // --- AUDIO MASTER STATE ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(1);

  // ✨ STEP 2: Persistent Auto-Login System
  // Checks localStorage on app startup and fetches all matching records from Firestore
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
            localStorage.removeItem('userId'); // Cleanup if user record doesn't exist
          }
        } catch (error) {
          console.error("Firebase auto-login error:", error);
        }
      }
      setLoading(false);
    };

    checkPersistentSession();
  }, []);

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

  // ✨ STEP 3: Handle User Sign-In & Sign-Out Events
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


   const handleAddNewSong = async (newSongData) => {
    try {
      // ✅ FIXED: properly calling the collection function with 'db'
      const songsCollectionRef = collection(db, "songs"); 
      
      const docRef = await addDoc(songsCollectionRef, {
        title: newSongData.title,
        artist: newSongData.artist,
        coverUrl: newSongData.coverUrl,
        audioUrl: newSongData.audioUrl,
        createdAt: new Date(), // Saves the exact time it was uploaded
      });
      
      console.log("Success! Naat added to cloud with ID: ", docRef.id);
      alert("Naat uploaded to Firebase successfully! 🎉");

      setShowAdmin(false);
    } catch (error) {
      console.error("🔥 Error adding Naat to Firebase: ", error);
      alert("Uh oh! Failed to upload. Check the console for details.");
    }
  };

  // ✨ STEP 4: Modified Playlist Logic (Saves data directly to Firebase Firestore)
  const handleSaveToPlaylist = async (playlistName, track) => {
    if (!track) {
      alert("Please select and play a track before adding it to a playlist!");
      return;
    }

    // Generate the updated playlists configuration array
    const updatedPlaylists = playlists.map(p => {
      if (p.name === playlistName) {
        const currentSongs = p.songs || [];
        
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
    });

    // Update state locally first for instant feedback UI response
    setPlaylists(updatedPlaylists);

    // If user is authenticated, sync data array upstream to database collection
    if (user && user.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { playlists: updatedPlaylists });
      } catch (err) {
        console.error("Failed to sync structural playlist to Firebase:", err);
      }
    }
  };

  // Render basic dark loading screen during auto-login authentication sequence
  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-white text-xl font-semibold tracking-wider">
        Loading your Profile...
      </div>
    );
  }

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
          <Navbar
            user={user}
            onLogin={handleLogin}    // ✨ Uses newly defined auth bridge setup
            onLogout={handleLogout}  // ✨ Handles session state resets
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onAdminClick = {() => setShowAdmin(true)}
             
          />
          <div className='flex gap-5 p-2 flex-1 overflow-hidden pb-24'>
            
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              playlists={playlists}
              setPlaylists={setPlaylists}
              onPlaylistSelect={(playlist) => setSelectedPlaylist(playlist)} 
            />

            {/* DYNAMIC CONTENT AREA: Show Playlist if clicked, otherwise show Main Dashboard */}
                      {(showAdmin && user?.email === "mdtaffique@gmail.com") ? (
              <AdminDashboard 
                onAddSong={handleAddNewSong} 
                onBack={() => setShowAdmin(false)} 
              />
            ) : selectedPlaylist ? (
              <PlaylistView 
                playlist={playlists.find(p => p.id === selectedPlaylist.id)} 
                onPlay={(naat) => setCurrentNaat(naat)}
                onBack={() => setSelectedPlaylist(null)}
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
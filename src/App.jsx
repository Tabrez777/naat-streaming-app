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
import { doc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

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
  const [songs, setSongs] = useState([]);

  // --- AUDIO MASTER STATE ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(1);

  const handleAddNewSong = async (newSongData) => {
  try {
    // ✨ NEW: Check if this exact song title already exists in the same category
    const isDuplicate = songs.some(
      (song) => 
        song.title.toLowerCase() === newSongData.title.toLowerCase() && 
        song.category === newSongData.category
    );

    if (isDuplicate) {
      alert("Wait! This track has already been uploaded.");
      return; // 🛑 Stops the code here, preventing the Firebase upload
    }

    const songsCollectionRef = collection(db, "songs"); 
    
    // 1. Add to Firebase
    const docRef = await addDoc(songsCollectionRef, {
      ...newSongData,
      createdAt: new Date(),
    });
    
    // 2. Add to local state (Note: Added to the front of the array so it shows up first)
    const newSong = { id: docRef.id, ...newSongData };
    setSongs((prevSongs) => [newSong, ...prevSongs]); 
    
    console.log("Success! Track added.");
    setShowAdmin(false);
  } catch (error) {
    console.error("Error adding track: ", error);
    alert("Uh oh! Failed to upload.");
  }
};

  useEffect(() => {
  const fetchSongs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "songs"));
      const songsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSongs(songsList); // Update the state we created earlier
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  
  fetchSongs();
}, []);

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

  const playNext = () => {
    console.log("Available songs:", songs);
    if(!currentNaat || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentNaat.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentNaat(songs[nextIndex]);
  };

  const playPrevious = () => {
    if(!currentNaat || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentNaat.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentNaat(songs[previousIndex]);
  };

  const handleLikeNaat = async (naat) => {
    if(!user){
      alert("Please Login to Like Naats!");
      return;
    }

    let likedPlaylist = playlists.find(p => p.name === "Liked Music");
    let updatedPlaylists;
    
    if(!likedPlaylist){
      likedPlaylist = {id: Date.now(), name:"Liked Music", songs: [naat], trackCount:1};
      updatedPlaylists = [...playlists, likedPlaylist]
    }
    else {
      if (likedPlaylist.songs.some(s => s.id === naat.id)) return; // Already liked
    likedPlaylist.songs = [...likedPlaylist.songs, naat];
    likedPlaylist.trackCount = likedPlaylist.songs.length;
    updatedPlaylists = playlists.map(p => p.name === "Liked Music" ? likedPlaylist : p);
    }
    setPlaylists(updatedPlaylists);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { playlists: updatedPlaylists });
    alert("Added to Liked Music! ❤️");
  };

  const handleUnlikeNaat = async (naat) => {
    const likedPlaylistIndex = playlists.findIndex(p => p.name === "Liked Music");
    if(likedPlaylistIndex === -1) return;

    const likedPlaylist = {...playlists[likedPlaylistIndex]};


    likedPlaylist.songs = likedPlaylist.songs.filter(s => s.id !== naat.id);
  likedPlaylist.trackCount = likedPlaylist.songs.length;

  // 3. Update State and Firebase
  const updatedPlaylists = [...playlists];
  updatedPlaylists[likedPlaylistIndex] = likedPlaylist;

  setPlaylists(updatedPlaylists);
  
  const userDocRef = doc(db, "users", user.uid);
  await updateDoc(userDocRef, { playlists: updatedPlaylists });
  
  alert("Removed from Liked Music.");

  };

  return (
    <div className="flex flex-col h-screen w-screen relative overflow-hidden bg-linear-to-b from-neutral-900 to-black">
      
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
            playPrevious={playPrevious}
            playNext={playNext}
            onClose={() => setIsExpanded(false)} 
            userPlaylists={playlists}
            handleLikeNaat = {handleLikeNaat}
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
          <div className='flex w-full h-full overflow-hidden relative'>
            
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              playlists={playlists}
              setPlaylists={setPlaylists}
              onPlaylistSelect={(playlist) => setSelectedPlaylist(playlist)} 
            />
            
            

            {/* DYNAMIC CONTENT AREA: Show Playlist if clicked, otherwise show Main Dashboard */}
            <div className='flex-1 w-full overflow-hidden relative'>
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
                onUnlike={handleUnlikeNaat}
              />
            ) : (
              <Main 
              onPlay={(naat) => setCurrentNaat(naat)}
              songs = {songs}
              setSongs = {setSongs} />
            )}
          </div>              
          </div>
        </>
      )}

      {/* BOTTOM PLAY BAR (Always visible unless expanded) */}
      <PlayBar 
        naat={currentNaat} 
        isVisible={currentNaat !== null && !isExpanded} 
        onExpand={() => setIsExpanded(true)} 
        playNext = {playNext}
        playPrevious = {playPrevious}
        {...audioProps}
      />
      

    </div>
  );
}

export default App;
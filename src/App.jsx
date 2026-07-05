import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import PlayBar from './components/PlayBar';
import PlayPage from './components/PlayPage';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';
import AdminDashboard from './components/AdminDashboard';
import ArtistView from './components/ArtistView';
import SettingsView from './components/SettingsView';

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
  const [user, setUser] = useState(null);// Will now hold the complete user object from Firebase
  const [activeTab, setActiveTab] = useState('Home')
  
  const [loading, setLoading] = useState(true); // Prevents flash of logged-out state
  const [showAdmin, setShowAdmin] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
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
  avatarUrl: "" // Leave empty or put a default image URL here
});


 const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem('recentlyPlayed');
    
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Filter out any ghost tracks, nulls, or tracks missing a cover image!
      const cleanData = parsedData.filter(song => song !== null && song.id && song.coverUrl);
      
      // Update local storage to permanently remove the bad data
      localStorage.setItem('recentlyPlayed', JSON.stringify(cleanData));
      
      return cleanData;
    }
    
    return [];
  });

  const toggleRepeat = () => setIsRepeating(!isRepeating);

  const handleAddNewSong = async (newSongData) => {
  try {
    // ✨ NEW: Check if this exact song title already exists in the same category
    const isDuplicate = songs.some(
      (song) => 
        song.title?.trim().toLowerCase() === newSongData.title?.trim().toLowerCase() && 
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
  // Auto-play when a new Naat is selected from anywhere in the app
  useEffect(() => {
    
    // ✨ THE FIX: We put EVERYTHING inside this safety check!
    // Now it will only try to track history and play if a song is actually selected.
    if (currentNaat && audioRef.current) {
      
      // 1. Update Recently Played History
      setRecentlyPlayed( prev => {
        const filtered = prev.filter(song => song.id !== currentNaat.id);
        const updated = [currentNaat, ...filtered].slice(0, 15);
        localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
        return updated;
      });

      // 2. Play the track
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            if (error.name === "AbortError") {
              console.log("Track changed before the previous one could load.");
            } else {
              console.error("Playback blocked:", error);
              setIsPlaying(false);
            }
          });
      }
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
    volume, isMuted, handleVolumeChange, toggleMute,toggleRepeat,isRepeating
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

  // ✨ NEW: Smart Queue Logic
  // This function figures out exactly what list of songs the user is currently listening to!
  // ✨ NEW: Smart Queue Logic
  const getActiveQueue = () => {
    // 1. If they are in a Playlist
    if (selectedPlaylist) {
      const playlist = playlists.find(p => p.id === selectedPlaylist.id);
      return playlist?.songs || [];
    }
    
    // 2. If they are in an Artist profile
    if (selectedArtist) {
      return songs.filter(s => s.artist === selectedArtist.name);
    }
    
    // 3. Category Locking (Dashboard)
    if (currentNaat && currentNaat.category) {
      const categorySongs = songs.filter(s => s.category === currentNaat.category);
      
      // ✨ THE FIX: If it's a Tilawat, reverse the queue to match the screen!
      if (currentNaat.category === 'tilawat') {
        return categorySongs.reverse();
      }
      
      return categorySongs;
    }
    
    // Fallback: Return all songs
    return songs;
  };

  const playNext = () => {
    if (!currentNaat) return;
    const queue = getActiveQueue(); // Grab the smart queue
    if (queue.length === 0) return;

    // Find where we are in the current queue, and go forward by 1
    const currentIndex = queue.findIndex(s => s.id === currentNaat.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % queue.length;
    setCurrentNaat(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentNaat) return;
    const queue = getActiveQueue(); // Grab the smart queue
    if (queue.length === 0) return;

    // Find where we are in the current queue, and go backward by 1
    const currentIndex = queue.findIndex(s => s.id === currentNaat.id);
    const previousIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + queue.length) % queue.length;
    setCurrentNaat(queue[previousIndex]);
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
        loop = {isRepeating}
        onEnded={() => {
          if (!isRepeating) {
            // ✨ THE FIX: Instead of stopping, automatically trigger the next track!
            playNext();
          }
        }}
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
            onLogout={handleLogout}  
            userProfile = {userProfile}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onAdminClick = {() => setShowAdmin(true)}
             songs={songs}
            onPlay={(naat) => setCurrentNaat(naat)}
          />
          <div className='flex w-full h-full overflow-hidden relative'>
            
            <Sidebar 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              playlists={playlists}
              setPlaylists={setPlaylists}
              activeTab ={activeTab}
              setActiveTab = {setActiveTab}
              onPlaylistSelect={(playlist) => setSelectedPlaylist(playlist)} 
            />
            
            

            {/* DYNAMIC CONTENT AREA: Show Playlist if clicked, otherwise show Main Dashboard */}
            <div className='flex-1 w-full overflow-hidden relative'>
            { activeTab === 'Settings' ? (
              <SettingsView
              userProfile ={userProfile}
              onUpdateProfile = {setUserProfile}
              />
            ):
            (showAdmin && user?.email === "mdtaffique@gmail.com") ? (
              <AdminDashboard onAddSong={handleAddNewSong} onBack={() => setShowAdmin(false)} />
            ) : selectedPlaylist ? (
              <PlaylistView 
                playlist={playlists.find(p => p.id === selectedPlaylist.id)} 
                onPlay={(naat) => setCurrentNaat(naat)}
                onBack={() => setSelectedPlaylist(null)}
                onUnlike={handleUnlikeNaat}
              />
            ) : selectedArtist ? (
              // ✨ NEW: If an artist is selected, show their page!
              <ArtistView 
                artist={selectedArtist}
                songs={songs} 
                onPlay={(naat) => setCurrentNaat(naat)}
                onBack={() => setSelectedArtist(null)} 
              />
            ) : (
              <Main 
                onPlay={(naat) => setCurrentNaat(naat)}
                songs={songs}
                setSongs={setSongs}
                // ✨ NEW: Pass the click handler down to Main
                onArtistClick={(artist) => setSelectedArtist(artist)} 
                recentlyPlayed = {recentlyPlayed}
              />
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
        songs={songs}
        onPlay={(naat) => setCurrentNaat(naat)}
        {...audioProps}
      />
      

    </div>
  );
}

export default App;
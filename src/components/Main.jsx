import React, { useState, useEffect } from 'react';
import NaatsSection from './NaatsSection';
import QawwalisSection from './QawwalisSection';
import ArtistSection from './ArtistSection';
import QuranTilawatSection from './QuranTilawatSection';
import Footer from './Footer';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Main = ({ onPlay, songs, setSongs, setSelectedArtist, onArtistClick, recentlyPlayed }) => { 
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  const handleArtistClick = (artist) => {
    if (setSelectedArtist) setSelectedArtist(artist);
    navigate(`/artist/${artist.id}`);
  };

  const naats = songs.filter(s => s.category?.toLowerCase() === 'naat' || !s.category);
  const qawwalis = songs.filter(s => s.category?.toLowerCase() === 'qawwali');
  const tilawats = songs.filter(s => s.category?.toLowerCase() === 'tilawat');

  useEffect(() => {
    const fetchArtists = async () => {
      const q = collection(db, "artists");
      const snapshot = await getDocs(q);
      const fetchedArtists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArtists(fetchedArtists);
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedSongs = querySnapshot.docs.map(doc => ({
          id: doc.id, ...doc.data()
        }));
        setSongs(fetchedSongs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs: ", error);
        setLoading(false);
      }
    };
    fetchSongs();
  }, [setSongs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-neutral-400">
        <div className="animate-pulse">Loading fresh Naats...</div>
      </div>
    );
  }

  return (
    // ✨ CHANGED: Removed h-[85vh] and overflow-auto to prevent nested scrolling. Let App.jsx handle the scrolling. Added padding for mobile readability.
    <div className='w-full min-h-full pb-24 text-white bg-transparent'>
      
      {/* FILTER BAR - Mobile Optimized scroll */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl px-4 md:px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-white/5">
        {['All', 'Naats', 'Qawwali', 'Tilawat'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              activeFilter === category 
                ? 'bg-white text-black scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-8">
        
        {/* Show Recently Played ONLY on the 'All' tab */}
        {activeFilter === 'All' && recentlyPlayed?.length > 0 && (
          <RecentlyPlayedSection onPlay={onPlay} recentlyPlayed={recentlyPlayed} />
        )}
        
        {/* Conditionally render sections based on the active filter */}
        {(activeFilter === 'All' || activeFilter === 'Naats') && naats.length > 0 && (
          <NaatsSection onPlay={onPlay} songs={naats} />
        )}
        
        {(activeFilter === 'All' || activeFilter === 'Qawwali') && qawwalis.length > 0 && (
          <QawwalisSection onPlay={onPlay} songs={qawwalis} />
        )}
        
        {(activeFilter === 'All' || activeFilter === 'Tilawat') && tilawats.length > 0 && (
          <QuranTilawatSection onPlay={onPlay} songs={tilawats} />
        )}
        
        {activeFilter === 'All' && artists.length > 0 && (
          <ArtistSection artists={artists} onArtistClick={onArtistClick} />
        )}

      </div>
      <Footer/>
    </div>
  );
}; 

export default Main;
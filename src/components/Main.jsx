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

  // ✨ ADVANCED UI: SHIMMER SKELETON LOADING SCREEN!
  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-6 py-8 flex flex-col gap-10 bg-gradient-to-b from-neutral-900 to-black animate-pulse">
        {/* Skeleton Filter Bar */}
        <div className="flex gap-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-10 w-24 bg-neutral-800/80 rounded-full border border-neutral-700/50"></div>
          ))}
        </div>
        
        {/* Skeleton Track Grid */}
        <div className="flex flex-col gap-4">
          <div className="h-7 w-48 bg-neutral-800 rounded-md"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="bg-neutral-900/60 p-4 rounded-xl flex flex-col gap-3 border border-neutral-800/60 shadow-lg">
                <div className="w-full aspect-square bg-neutral-800/90 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-neutral-800 rounded"></div>
                <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✨ ADVANCED UI: Dynamic color-coded glowing styles for filter pills
  const getFilterButtonStyle = (category) => {
    if (activeFilter !== category) {
      return "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/50";
    }
    switch (category) {
      case 'Naats':
        return "bg-[#1ed760] text-black font-bold scale-105 shadow-[0_0_20px_rgba(30,215,96,0.45)] border border-[#1ed760]";
      case 'Qawwali':
        return "bg-purple-600 text-white font-bold scale-105 shadow-[0_0_20px_rgba(147,51,234,0.45)] border border-purple-400";
      case 'Tilawat':
        return "bg-amber-500 text-black font-bold scale-105 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-amber-300";
      default: // 'All'
        return "bg-white text-black font-bold scale-105 shadow-[0_0_20px_rgba(255,255,255,0.35)] border border-white";
    }
  };

  return (
    <div className='w-full min-h-full pb-24 text-white bg-transparent transition-all duration-300'>
      
      {/* ✨ ADVANCED UI: ROYAL AMBIENT FILTER BAR */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl px-4 md:px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-white/10 shadow-lg">
        {['All', 'Naats', 'Qawwali', 'Tilawat'].map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 cursor-pointer rounded-full text-sm tracking-wide whitespace-nowrap transition-all duration-300 transform active:scale-95 ${getFilterButtonStyle(category)}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-8">
        
        {activeFilter === 'All' && recentlyPlayed?.length > 0 && (
          <RecentlyPlayedSection onPlay={onPlay} recentlyPlayed={recentlyPlayed} />
        )}
        
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
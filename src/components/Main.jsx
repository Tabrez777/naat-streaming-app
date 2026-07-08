import React, { useState, useEffect } from 'react';
import NaatsSection from './NaatsSection';
import QawwalisSection from './QawwalisSection';
import ArtistSection from './ArtistSection';
import QuranTilawatSection from './QuranTilawatSection';
import Footer from './Footer';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  

const Main = ({ onPlay, songs, setSongs, onArtistClick, recentlyPlayed }) => { 
  const [activeFilter, setActiveFilter] = useState('All');

const naats = songs.filter(s => s.category?.toLowerCase() === 'naat' || !s.category);const qawwalis = songs.filter(s => s.category?.toLowerCase() === 'qawwali');
const tilawats = songs.filter(s => s.category?.toLowerCase() === 'tilawat');

  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

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
          id: doc.id,
          ...doc.data()
        }));

        setSongs(fetchedSongs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs: ", error);
        setLoading(false);
      }
    };
    fetchSongs();
  }, [setSongs]); // ✨ Added setSongs to dependency array to prevent React warnings

  if (loading) {
    return <div className="text-white p-8">Loading fresh Naats...</div>;
  }
  return (
    <div className='scrollbar-hide w-full h-[85vh] text-white rounded-lg overflow-auto' style={{background:'transparent'}}>
      <div className="sticky top-0 z-10 bg-neutral-900/90 backdrop-blur-md px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-neutral-800">
          {['All', 'Naats', 'Qawwali', 'Tilawat'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === category 
                  ? 'bg-white text-black scale-105 shadow-md' 
                  : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      {/* Show Recently Played & Trending ONLY on the 'All' tab */}
          {activeFilter === 'All' && (
            <>
              <RecentlyPlayedSection onPlay={onPlay} recentlyPlayed={recentlyPlayed} />
              {/* If you have a Trending section component, put it here! */}
            </>
          )}
          
          <div className="pb-12">
          {/* Conditionally render sections based on the active filter */}
          {(activeFilter === 'All' || activeFilter === 'Naats') && (
            <NaatsSection onPlay={onPlay} songs={naats} />
          )}
          
          {(activeFilter === 'All' || activeFilter === 'Qawwali') && (
            <QawwalisSection onPlay={onPlay} songs={songs} /> // or pass {qawwalis}
          )}
          
          {(activeFilter === 'All' || activeFilter === 'Tilawat') && (
            <QuranTilawatSection onPlay={onPlay} songs={songs} /> // or pass {tilawats}
          )}
          
          {(activeFilter === 'All') && (
            <ArtistSection artists={artists} onArtistClick={onArtistClick} />
          )}

        <Footer/>
        </div>
    </div>
  );
}; 

export default Main;
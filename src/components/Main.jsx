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
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  
  const naats = songs.filter(song => song.category === "naat" || !song.category);
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
        // 1. Ask Firebase for the "songs" collection, newest first
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // 2. Convert the cloud data into a normal React array
        const fetchedSongs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 3. Save it to state!
        setSongs(fetchedSongs);
        setLoading(false);
      }
        catch (error) {
          console.error("Error fetching songs: ", error);
          setLoading(false);
      }
};
fetchSongs();
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading fresh Naats...</div>;
  }// <--- This is the line that was likely missing!
  return (
    <div className='scrollbar-hide w-full h-[85vh] text-white rounded-lg overflow-auto' style={{background:'transparent'}}>
      <RecentlyPlayedSection
      onPlay={onPlay}
      recentlyPlayed={recentlyPlayed} 
      />

        <NaatsSection 
        onPlay ={onPlay} 
        songs = {naats}
        />
        <QawwalisSection
        onPlay={onPlay}
        songs={songs}/>
        <QuranTilawatSection
        onPlay={onPlay}
        songs={songs} 
          />
        <ArtistSection
        artists = {artists}
        onArtistClick={onArtistClick}
        />

        <Footer/>
        
    </div>
  );
}; 

export default Main;
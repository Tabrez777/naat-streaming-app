import React, { useState, useEffect } from 'react';
import RecentSongsSection from './RecenSongsSection';
import OtherSongsSection from './OtherSongsSection';
import ArtistSection from './ArtistSection';



import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  

const Main = ({ onPlay }) => { 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);


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
        <RecentSongsSection 
        onPlay ={onPlay} 
        songs = {songs}
        />
        <OtherSongsSection/>
        <ArtistSection/>
    </div>
  );
}; // <--- And this closing bracket!

export default Main;
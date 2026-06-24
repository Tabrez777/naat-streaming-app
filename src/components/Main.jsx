import React from 'react';
import RecentSongsSection from './RecenSongsSection';
import OtherSongsSection from './OtherSongsSection';
import ArtistSection from './ArtistSection';

const Main = ({ onPlay }) => { // <--- This is the line that was likely missing!
  return (
    <div className='scrollbar-hide w-full h-[85vh] text-white rounded-lg overflow-auto' style={{background:'transparent'}}>
        <RecentSongsSection onPlay ={onPlay} />
        <OtherSongsSection/>
        <ArtistSection/>
    </div>
  );
}; // <--- And this closing bracket!

export default Main;
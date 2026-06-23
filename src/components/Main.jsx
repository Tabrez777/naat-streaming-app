import React from 'react';
import RecentSongsSection from './RecenSongsSection';
import OtherSongsSection from './OtherSongsSection';
import ArtistSection from './ArtistSection';

const Main = ({ onPlay }) => { // <--- This is the line that was likely missing!
  return (
    <div className='scrollbar-hide w-full h-[85vh] bg-neutral-700 text-white border-2 rounded-lg overflow-auto'>
        <p className='flex text-center justify-center text-2xl font-bold text-shadow-black mt-4'>Enjoy With Hit Naats</p>
        
        <RecentSongsSection onPlay={onPlay} />
        
        {/* We pass onPlay here so your updated Play button works */}
        <OtherSongsSection onPlay={onPlay} />
        
        <ArtistSection />
    </div>
  );
}; // <--- And this closing bracket!

export default Main;
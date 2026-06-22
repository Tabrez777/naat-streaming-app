import React from 'react'
import RecentSongsSection from './RecenSongsSection'
import OtherSongsSection from './OtherSongsSection'
import ArtistSection from './ArtistSection'

const Main = ({onPlay}) => {
  return (
    <div className='scrollbar-hide w-full h-[85vh] bg-neutral-700 text-white border-2 rounded-lg overflow-auto'>
        <p className='flex text-center justify-center text-2xl font-bold text-shadow-black'>Enjoy With Hit Naats</p>
        <RecentSongsSection onPlay ={onPlay} />
        <OtherSongsSection/>
        <ArtistSection/>
    </div>
  )
}

export default Main

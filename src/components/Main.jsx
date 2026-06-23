import React from 'react'
import RecentSongsSection from './RecenSongsSection'
import OtherSongsSection from './OtherSongsSection'
import ArtistSection from './ArtistSection'

const Main = ({onPlay}) => {
  return (
    <div className='scrollbar-hide w-full h-[85vh] bg-linear-to-b from-neutral-900 to-black text-white overflow-auto' style={{boxShadow: '0px 5px 25px 2px #2d2c37b4 ', borderRadius:'10px'}}>
        <RecentSongsSection onPlay ={onPlay} />
        <OtherSongsSection/>
        <ArtistSection/>
    </div>
  )
}

export default Main

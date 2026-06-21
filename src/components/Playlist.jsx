import React from 'react'

const Playlist = () => {
  return (
    // 1. Changed main container to flex-col. This keeps the header at the top 
    // and allows future playlist items to stack vertically below it.
    <div className="w-1/4 h-[85vh] border-2 flex flex-col rounded-lg p-4 bg-neutral-700 text-white">
      
      {/* 2. Added a Header Wrapper. 
          - flex-row puts them side-by-side
          - items-center centers them vertically
          - justify-between pushes Title left and Button right 
      */}
      <div className="flex flex-row items-center justify-between w-full mb-6">
        
        {/* Title */}
        <p className="text-xl font-bold">Playlist</p>

        {/* Add Button */}
        <button className="flex items-center gap-2 group hover:opacity-80 transition-opacity focus:outline-none">
          
          <div className="flex items-center justify-center cursor-pointer w-8 h-8 bg-neutral-700 rounded-sm group-hover:bg-neutral-700 transition-colors duration-300">
            {/* The SVG Plus Icon */}
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </div>
          
          {/* Button Text */}
          <span className="font-semibold text-sm">
            Create
          </span>
          
        </button>
        
      </div>

      {/* 3. Your future playlists will go here! */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {/* Playlist items will stack here neatly */}
      </div>

    </div>
  )
}

export default Playlist
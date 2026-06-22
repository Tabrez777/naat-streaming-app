import React from 'react'
import SearchBar from './SearchBar'
import ProfileLoginButton from './ProfileLoginButton'

const Navbar = ({ user, onLoginClick, onLogout }) => {
  return (
    <nav className='w-full flex justify-between items-center py-3 px-6 bg-black text-white border-b border-neutral-900'>
      
      {/* 🍔 Left Side Group: Menu Button + Logo wrapped together */}
      <div className="flex items-center gap-4">
        <button className="text-white hover:bg-neutral-800 p-2 rounded-full transition duration-200 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1.5 cursor-pointer">
          {/* YouTube Music Red Play Circle */}
          <div className="w-6 h-6 bg-[#FF0000] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight font-sans">TEZ</span>
        </div>
      </div>

      {/* 🔍 Center Search Component Area */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative w-full bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition duration-200 flex items-center px-4 py-1.5 border border-transparent focus-within:border-neutral-700">
          {/* Soft Integrated Search Icon */}
          <svg className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search songs, albums, artists, podcasts" 
            className="w-full bg-transparent text-white placeholder-neutral-400 text-sm focus:outline-none py-1"
          />
        </div>
      </div>
      
      {/* 📡 Right Utility Panel: Cast Icon & Profile Actions */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* Cast Icon */}
        <button className="text-neutral-300 hover:text-white transition duration-200 focus:outline-none" aria-label="Chromecast">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v2m0 4h.01M2 17h.01M2 14h.01M6 17a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        {/* Profile Login Action Button */}
        <ProfileLoginButton
          user={user}
          onLoginClick={onLoginClick}
          onLogout={onLogout}
        />
      </div>

    </nav>
  )
}

export default Navbar;
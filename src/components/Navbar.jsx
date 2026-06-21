import React from 'react'
import SearchBar from './SearchBar'
import ProfileLoginButton from './ProfileLoginButton'

const Navbar = ({user, onLoginClick, onLogout}) => {
  return (
    <nav className='flex justify-between items-center py-2 px-2 gap-9 bg-neutral-900 text-white m-0 b-0'>
      <div className="logo w-10 h-10 border-2 rounded-full flex justify-center items-center "> Tez</div>
      <div ><button 
        className="flex items-center cursor-pointer justify-center w-12 h-12 bg-neutral-800 rounded-full hover:scale-105 hover:bg-neutral-700 transition-all duration-200"
        aria-label="Home"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A clean, solid Home icon */}
          <path d="M12 3l9 8h-3v8h-4v-6H10v6H6v-8H3l9-8z" />
        </svg>
      </button></div>
      <SearchBar/>
      
      {/* login button */}
      <ProfileLoginButton
      user = {user}
      onLoginClick ={onLoginClick}
      onLogout = {onLogout}
      />

    </nav>
  )
}

export default Navbar

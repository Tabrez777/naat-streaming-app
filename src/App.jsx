import { useState } from 'react'
import './App.css'
import Main from './components/Main'
import Navbar from './components/Navbar'
import Playlist from './components/Playlist'
import PlayBar from './components/PlayBar'

function App() {
  // 1. Start with null so the playbar is hidden initially
  const [currentNaat, setCurrentNaat] = useState(null)

  const [user, setUser] = useState(null);
  const [showLoginModel, setShowLoginModel] = useState(false);

  const handleLogin = (username) => {
      setUser({name : username})
      setShowLoginModel(false);
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    // Added h-screen and relative to ensure the playbar sits exactly at the bottom
    <div className="flex flex-col h-screen relative">
      <Navbar 
      user ={user}
      onLoginClick ={() => setShowLoginModel(true)}
      onLogout = {handleLogout} />
      
      <div className='flex gap-5 p-2 flex-1 overflow-hidden pb-24'>
        <Playlist />
        
        {/* 2. Give Main the ability to update the currentNaat */}
        <Main onPlay={(naat) => setCurrentNaat(naat)} />
      </div>

      {/* 3. The PlayBar only appears if currentNaat is NO LONGER null */}
      {currentNaat && (
        <PlayBar naat={currentNaat} />
      )}
    </div>
  )
}

export default App
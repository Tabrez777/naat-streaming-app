import React, { useState } from 'react'
import LoginModal from './LoginModel';   // ✨ Fixed spelling standard naming
import SignupModal from './SignUpModel'; // ✨ Import your Signup container
import Account from './Account';

// 2. I changed `onLoginClick` to `onLogin` so it can receive the username data
const Navbar = ({ user, onLogin, onLogout, toggleSidebar }) => {
  
  // 3. State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 4. Handle a successful login from the modal
  const handleLoginSuccess = (username) => {
    onLogin(username); // Send the user data up to App.jsx
    setIsModalOpen(false); // Close the modal
  };
  const handleAuthSuccess = (userData) => {
    onLogin(userData); 
    setActiveModal(null); // Closes any open forms
  };
  const [activeModal, setActiveModal] = useState(null);

  return (
    <nav className='w-full flex justify-between items-center py-3 px-6 text-white border-neutral-900' style={{background:'transparent', borderBottom:'1.3px solid #77686856'}}>
      
      {/* 🍔 Left Side Group */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="text-white hover:bg-neutral-800 p-2 rounded-full transition duration-200 focus:outline-none md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1.5 cursor-pointer">
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
      
      {/* 📡 Right Utility Panel */}
      <div className="flex items-center gap-6 flex-shrink-0">
        

        {/* Profile Login Action Button */}
        {/* <ProfileLoginButton
          user={user}
          onLoginClick={() => setIsModalOpen(true)} // 5. Tell the button to open the modal!
          onLogout={onLogout}
        /> */}
      </div>
      {/* 📡 Right Utility Panel */}
<div className="flex items-center gap-6 flex-shrink-0">
  <button className="text-neutral-300 hover:text-white transition duration-200 focus:outline-none" aria-label="Chromecast">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v2m0 4h.01M2 17h.01M2 14h.01M6 17a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  </button>

  {/* DYNAMIC PROFILE ICON CONTROLLER */}
  <button 
    onClick={() => setActiveModal(user ? 'account' : 'login')}
    className="focus:outline-none transition transform hover:scale-105"
  >
    {user ? (
      // Logged In: Displays user's initials dynamically 
      <div className="w-9 h-9 bg-[#1ed760] text-black rounded-full flex items-center justify-center font-bold text-sm">
        {user.username ? user.username[0].toUpperCase() : 'U'}
      </div>
    ) : (
      // Logged Out: Display standard generic system avatar silhouette
      <div className="w-9 h-9 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center border border-neutral-700 hover:text-white hover:border-neutral-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    )}
  </button>
</div>

      {/* 6. Render the Modal when isModalOpen is true */}
      {isModalOpen && (
        <LoginModel 
          onClose={() => setIsModalOpen(false)} 
          onLogin={handleLoginSuccess} 
        />
      )}
{/* MODAL SWITCH LAYER ROUTER */}
  {activeModal === 'login' && (
    <LoginModal 
      onClose={() => setActiveModal(null)} 
      onLoginSuccess={handleAuthSuccess} 
      onSwitchToSignup={() => setActiveModal('signup')} 
    />
  )}

  {activeModal === 'signup' && (
    <SignupModal 
      onClose={() => setActiveModal(null)} 
      onSignupSuccess={handleAuthSuccess} 
      onSwitchToLogin={() => setActiveModal('login')} 
    />
  )}

  {activeModal === 'account' && user && (
    <Account 
      user={user} 
      onClose={() => setActiveModal(null)} 
      onLogout={onLogout} 
    />
  )}
    </nav>
  )
}

export default Navbar;
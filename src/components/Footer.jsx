import React, { useState } from 'react';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <footer className="mt-8 md:mt-12 pt-8 md:pt-12 pb-32 border-t border-white/10 px-4 md:px-6 font-sans">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TEZ</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Your ultimate destination for Naats, Qawwalis, and Quran Tilawat. Listen, explore, and connect with your faith.
          </p>
        </div>
        
        {/* Links Columns 
            ✨ FIX 1: Used CSS Grid on Mobile to keep links perfectly organized in 2 neat columns 
        */}
        <div className="grid grid-cols-2 md:flex md:flex-row gap-8 md:gap-16 lg:gap-24 w-full md:w-auto">
          <div className="flex flex-col gap-4">
            <h5 className="text-white font-bold mb-1">Company</h5>
            <button 
              onClick={() => setShowAbout(true)} 
              className="text-sm cursor-pointer text-left text-neutral-400 hover:text-white hover:underline transition-colors focus:outline-none w-max"
            >
              About
            </button>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">Jobs</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">For the Record</a>
          </div>
          
          <div className="flex flex-col gap-4">
            <h5 className="text-white font-bold mb-1">Communities</h5>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">For Artists</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">Developers</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">Advertising</a>
          </div>

          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <h5 className="text-white font-bold mb-1">Useful Links</h5>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">Support</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors w-max">Free Mobile App</a>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Legal & Copyright 
          ✨ FIX 2: Better alignment on mobile for legal links
      */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center pt-8 border-t border-white/10 text-xs font-medium text-neutral-500 gap-4 md:gap-0">
        <p>&copy; {new Date().getFullYear()} TEZ Music Platforms</p>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="hover:text-white transition-colors">Legal</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Center</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
          <a href="#" className="hover:text-white transition-colors">About Ads</a>
        </div>
      </div>
      
      {/* The About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all relative cursor-auto">
            
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About TEZ</h2>
            
            <div className="text-neutral-300 space-y-4 text-sm md:text-base leading-relaxed max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <p>Welcome to <strong className="text-white">TEZ</strong>, a dedicated digital platform designed to bring you the highest quality Naats, Qawwalis, and Quran Tilawat.</p>
              <p>Our mission is to create a peaceful, ad-free, and immersive listening experience for communities around the world. We believe that spiritual audio should be easily accessible, beautifully organized, and available across all your devices.</p>
              <p>Built with modern web technologies, TEZ offers seamless playback, custom playlists, and a dark-themed interface tailored for extended, comfortable listening.</p>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full md:w-auto px-8 py-3 rounded-full font-bold bg-[#1ed760] text-black hover:bg-[#1fdf64] hover:scale-105 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
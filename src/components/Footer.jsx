import React, { useState } from 'react';

const Footer = () => {
  // ✨ NEW: State to control the About Us modal
  const [showAbout, setShowAbout] = useState(false);

  return (
    <footer className="mt-12 pt-12 pb-32 border-t border-white/10 px-6 font-sans">
      
      {/* Top Section: Columns */}
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TEZ</span>
          </div>
          <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
            Your ultimate destination for Naats, Qawwalis, and Quran Tilawat. Listen, explore, and connect with your faith.
          </p>
        </div>
        
        {/* Links Columns */}
        <div className="flex flex-wrap gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h5 className="text-white font-bold mb-1">Company</h5>
            
            {/* ✨ FIXED: Changed to a button that opens the modal */}
            <button 
              onClick={() => setShowAbout(true)} 
              className="text-sm cursor-pointer text-left text-neutral-400 hover:text-white hover:underline transition-colors focus:outline-none"
            >
              About
            </button>
            
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">Jobs</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">For the Record</a>
          </div>
          
          <div className="flex flex-col gap-4">
            <h5 className="text-white font-bold mb-1">Communities</h5>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">For Artists</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">Developers</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">Advertising</a>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="text-white font-bold mb-1">Useful Links</h5>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">Support</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">Free Mobile App</a>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Legal & Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs font-medium text-neutral-500">
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <a href="#" className="hover:text-white transition-colors">Legal</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Center</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
          <a href="#" className="hover:text-white transition-colors">About Ads</a>
        </div>
        <p>&copy; {new Date().getFullYear()} TEZ Music Platforms</p>
      </div>
      
      {/* ✨ NEW: The About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all relative">
            
            {/* Close Button ('X') */}
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* About Us Content */}
            <h2 className="text-3xl font-bold text-white mb-6">About TEZ</h2>
            
            <div className="text-neutral-300 space-y-4 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>
                Welcome to <strong className="text-white">TEZ</strong>, a dedicated digital platform designed to bring you the highest quality Naats, Qawwalis, and Quran Tilawat.
              </p>
              <p>
                Our mission is to create a peaceful, ad-free, and immersive listening experience for communities around the world. We believe that spiritual audio should be easily accessible, beautifully organized, and available across all your devices.
              </p>
              <p>
                Built with modern web technologies, TEZ offers seamless playback, custom playlists, and a dark-themed interface tailored for extended, comfortable listening.
              </p>
            </div>

            {/* Bottom Close Button */}
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowAbout(false)}
                className="px-6 py-2.5 rounded-full font-bold bg-[#1ed760] text-black hover:bg-[#1fdf64] hover:scale-105 transition-all"
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
import React from 'react';

const Footer = () => {
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
            <a href="#" className="text-sm text-neutral-400 hover:text-white hover:underline transition-colors">About</a>
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
      
    </footer>
  );
};

export default Footer;
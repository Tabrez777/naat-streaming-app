import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ songs = [], onPlay }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // 1. Filter logic
  const searchResults = songs.filter(song => {
    if (!query) return false;
    const lowerCaseQuery = query.toLowerCase();
    return (
      song.title?.toLowerCase().includes(lowerCaseQuery) ||
      song.artist?.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // 2. Click-outside logic to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Play song and clear search
  const handlePlayResult = (song) => {
    onPlay(song);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="flex-1 flex justify-center max-w-2xl px-4 relative z-50">
      
      {/* Search Input Box */}
      <div className="relative group w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-neutral-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          className="w-full bg-neutral-800/80 text-white text-sm rounded-full pl-10 pr-4 py-2.5 border border-neutral-700 focus:outline-none focus:border-white focus:bg-neutral-800 transition-all placeholder-neutral-400 hover:bg-neutral-700 hover:border-neutral-500"
        />
      </div>

      {/* Live Dropdown Results */}
      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
          
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-400">
              No results found for "{query}"
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto scrollbar-hide flex flex-col">
              <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/50">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Top Results</p>
              </div>
              
              {searchResults.map((song) => (
                <div 
                  key={song.id} 
                  onClick={() => handlePlayResult(song)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-800 cursor-pointer transition-colors group"
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <img src={song.coverUrl} alt="cover" className="w-full h-full rounded object-cover shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="font-semibold text-white text-sm group-hover:text-[#1ed760] transition-colors truncate">{song.title}</span>
                    <span className="text-xs text-neutral-400 truncate">{song.artist} • {song.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
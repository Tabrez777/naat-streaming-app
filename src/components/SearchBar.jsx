import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  // State to hold the current search text
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If you pass a function to handle the search logic, it runs here
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div>
      
      {/* Search Bar Wrapper */}
      <div className="relative w-full max-w-2xl group">
        
        {/* Search Icon (Magnifying Glass) */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400 group-focus-within:text-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* The Input Field */}
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="What do you want to listen to?" 
          className="block w-full py-4 pl-12 pr-12 text-base text-white bg-neutral-800 border border-neutral-700 rounded-full outline-none transition-all duration-300 placeholder-neutral-500 shadow-md focus:ring-2 focus:ring-[#1ed760] focus:border-transparent focus:bg-neutral-800 hover:bg-neutral-700"
        />
        
        {/* Clear Button (X) - Only shows up if the user has typed something */}
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-white transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
      </div>
    </div>
  );
};

export default SearchBar;
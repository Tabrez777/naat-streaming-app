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
    <div style={{display:'flex', justifyContent:'center', width:'100%'}} >
      
      {/* Search Bar Wrapper */}
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
      </div>
  );
};

export default SearchBar;
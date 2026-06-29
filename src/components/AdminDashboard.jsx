import React, { useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

const AdminDashboard = ({ onAddSong, onBack }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Package the data into a new song object
    const newSong = {
      id: Date.now(), // Generate a unique ID
      title,
      artist,
      coverUrl,
      audioUrl,
      duration: parseInt(duration) || 0 // Convert string to number
    };

    // 2. Send it to App.jsx to be saved
    onAddSong(newSong);

    // 3. Show success message and clear the form
    setShowSuccess(true);
    setTitle('');
    setArtist('');
    setCoverUrl('');
    setAudioUrl('');
    setDuration('');

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddArtist = async (e) => {
    e.preventDefault();
    try {
      // This is where you create the collection if it doesn't exist!
      const artistRef = collection(db, "artists");
      await addDoc(artistRef, {
        name,
        profession,
        imageUrl,
        createdAt: new Date()
      });
      alert("Artist added successfully! 🎉");
      // Clear form
      setName('');
      setProfession('');
      setImageUrl('');
    } catch (error) {
      console.error("Error adding artist: ", error);
    }
  };

  return (
    
    <div className="flex-1 bg-neutral-900 rounded-lg p-8 h-[95vh] scrollbar-none overflow-y-auto text-white">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-6">
        <button 
          onClick={onBack}
          className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-1">Upload and manage new Naats in the database.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- LEFT: DATA ENTRY FORM --- */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-300">Naat Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tajdar-e-Haram" className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all"/>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-300">Artist / Khawan</label>
                <input required type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Atif Aslam" className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-300">Cover Image URL</label>
              <input required type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all"/>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-300">Audio File URL (or Path)</label>
              <input required type="text" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="/audios/song_name.mp3" className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all"/>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-300">Duration (in seconds)</label>
              <input required type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 180 (for 3 minutes)" className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all"/>
            </div>

            {/* --- RIGHT: LIVE PREVIEW CARD --- */}
            <div className="w-64 hidden sm:block">
          <label className="block text-sm font-semibold mb-4 text-neutral-500 uppercase tracking-wider">Live Card Preview</label>
          <div className="bg-neutral-800 p-4 rounded-xl shadow-2xl transition-all duration-300 group">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-700 shadow-lg">
              {coverUrl ? (
                <img src={coverUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">No Image</div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-white text-base font-semibold truncate">{title || "Song Title"}</h3>
              <p className="text-neutral-400 text-sm truncate">{artist || "Artist Name"}</p>
            </div>
          </div>
        </div>

            <button type="submit" className="mt-4 w-full cursor-pointer bg-[#1ed760] text-black font-bold rounded-full py-4 hover:scale-[1.02] hover:bg-[#1fdf64] transition-all shadow-lg">
              Upload Naat to Database
            </button>

            {/* Success Toast Message */}
            {showSuccess && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-md text-center font-medium animate-pulse mt-2">
                Successfully added to library!
              </div>
            )}
          </form>
        </div>

                          {/* Artist section */}
       <div className="flex-1 bg-neutral-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Add New Artist</h2>
          <form onSubmit={handleAddArtist} className="flex flex-col gap-4">
            <input required placeholder="Artist Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-700 p-3 rounded" />
            <input required placeholder="Profession" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full bg-neutral-700 p-3 rounded" />
            <input required placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-neutral-700 p-3 rounded" />
            
            <button type="submit" className="bg-[#1ed760] text-black font-bold p-3 rounded hover:scale-[1.02] transition">
              Add Artist to Database
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
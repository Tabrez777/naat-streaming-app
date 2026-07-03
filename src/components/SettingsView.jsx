import React, { useState } from 'react';

const SettingsView = ({ userProfile, onUpdateProfile }) => {
  // ✨ 1. State to control whether the Edit Profile modal is open or closed
  const [showEditModal, setShowEditModal] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file they selected
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a temporary local link to show a preview
    }
  };

  const handleSaveChanges = () => {
    // Send the new data back to App.jsx!
    onUpdateProfile({
      name: displayName,
      avatarUrl: imagePreview // This is the temporary local link
    });
    
    setShowEditModal(false); // Close the modal
  };

  return (
    <div className="flex-1 p-6 md:p-10 text-white overflow-y-auto h-[85vh] scrollbar-hide font-sans relative">
      <h1 className="text-4xl font-black mb-8">Settings</h1>

      <div className="max-w-3xl flex flex-col gap-10">
        
        {/* --- ACCOUNT SECTION --- */}
        <section>
          <h3 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">Account</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900/50 p-5 rounded-xl gap-4">
            <div>
              <p className="font-medium text-lg">Email Address</p>
              <p className="text-sm text-neutral-400">mdtaffique@gmail.com</p>
            </div>
            
            {/* ✨ 2. Made button responsive: full width on mobile, auto on desktop */}
            <button 
              onClick={() => setShowEditModal(true)}
              className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-transparent border-2 border-neutral-600 rounded-full text-sm font-bold hover:border-white hover:scale-105 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* --- PLAYBACK & AUDIO SECTION --- */}
        <section>
          <h3 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">Audio Quality</h3>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between hover:bg-neutral-800/30 p-4 rounded-lg transition-colors gap-4">
              <div>
                <p className="font-medium text-lg">Streaming Quality</p>
                <p className="text-sm text-neutral-400">Higher quality uses more data</p>
              </div>
              <select className="w-full sm:w-auto bg-neutral-800 text-white rounded-md p-2 outline-none border border-neutral-700 focus:border-[#1ed760] cursor-pointer">
                <option>Automatic (Recommended)</option>
                <option>Low (Data Saver)</option>
                <option>Normal</option>
                <option>High</option>
                <option>Very High</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between hover:bg-neutral-800/30 p-4 rounded-lg transition-colors gap-4">
              <div>
                <p className="font-medium text-lg">Normalize Volume</p>
                <p className="text-sm text-neutral-400">Set the same volume level for all tracks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ed760]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* --- DISPLAY SECTION --- */}
        <section>
          <h3 className="text-xl font-bold mb-4 border-b border-neutral-800 pb-2">Display</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between hover:bg-neutral-800/30 p-4 rounded-lg transition-colors gap-4">
            <div>
              <p className="font-medium text-lg">Hardware Acceleration</p>
              <p className="text-sm text-neutral-400">Enable for smoother scrolling and animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ed760]"></div>
            </label>
          </div>
        </section>

        {/* --- DANGER ZONE --- */}
        <section className="mt-4 mb-8">
          <button className="w-full sm:w-auto text-red-500 font-bold hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10">
            Log Out
          </button>
        </section>
      </div>

      {/* ✨ 3. THE RESPONSIVE EDIT PROFILE MODAL ✨ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          {/* Modal Container: Full width on mobile, max 400px on desktop */}
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>
            
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-300">Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Taffique" 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-800 rounded-md py-3 px-4 focus:ring-2 focus:ring-[#1ed760] outline-none transition-all text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-300">Profile Picture</label>
                
                <div className="flex items-center gap-4 bg-neutral-800 p-3 rounded-md">
                  {/* Circular Image Preview */}
                  <div className="w-16 h-16 rounded-full bg-neutral-700 overflow-hidden shrink-0 border border-neutral-600">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                    )}
                  </div>

                  {/* The actual file picker */}
                  <input 
                    type="file" 
                    accept="image/*" // Only allow images
                    onChange={handleImageChange}
                    className="w-full text-sm text-neutral-400 
                      file:mr-4 file:py-2 file:px-4 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-bold 
                      file:bg-[#1ed760] file:text-black 
                      hover:file:bg-[#1db954] file:cursor-pointer file:transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2 text-neutral-300 font-bold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveChanges} // Later, you'll connect this to Firebase!
                  className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;
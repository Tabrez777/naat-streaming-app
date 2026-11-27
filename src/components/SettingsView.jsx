import React, { useState } from 'react';

// Reusable Toggle Component
const Toggle = ({ defaultChecked }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ed760]"></div>
  </label>
);

const SettingsView = ({ userProfile, onUpdateProfile, onLogout }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [crossfade, setCrossfade] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    onUpdateProfile({
      name: displayName,
      avatarUrl: imagePreview
    });
    setShowEditModal(false);
  };

  return (
    <div className="flex-1 p-6 md:p-10 text-white overflow-y-auto h-[85vh] scrollbar-hide font-sans relative bg-gradient-to-b from-neutral-900 to-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">Settings</h1>
        <p className="text-neutral-400 mb-10">Manage your audio, profile, and application preferences.</p>

        <div className="flex flex-col gap-6 md:gap-10">
          
          {/* --- ACCOUNT SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-[#1ed760]/10 rounded-lg text-[#1ed760]">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Account</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Profile" className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shadow-lg border-2 border-neutral-700 shrink-0" />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1ed760] text-black font-black text-2xl flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.3)] shrink-0">
                    {userProfile?.name ? userProfile.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-lg md:text-xl truncate">{userProfile?.name || "Taffique"}</p>
                  <p className="text-xs md:text-sm text-neutral-400 truncate">mdtaffique@gmail.com</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowEditModal(true)}
                className="w-full cursor-pointer sm:w-auto px-6 py-2.5 bg-transparent border border-neutral-600 rounded-full text-sm font-bold hover:border-white hover:bg-white hover:text-black transition-all shadow-md shrink-0"
              >
                Edit Profile
              </button>
            </div>
          </section>

          {/* --- PLAYBACK SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Playback</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-base md:text-lg text-white leading-tight">Crossfade</p>
                    <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Allows tracks to fade into one another</p>
                  </div>
                  <span className="text-sm font-bold text-[#1ed760] shrink-0">{crossfade === 0 ? 'Off' : `${crossfade}s`}</span>
                </div>
                <input 
                  type="range" min="0" max="12" value={crossfade}
                  onChange={(e) => setCrossfade(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Gapless Playback</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Seamless transitions between consecutive tracks</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Autoplay</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Keep listening to similar tracks when your audio ends</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>
            </div>
          </section>

          {/* --- AUDIO QUALITY SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Audio Quality</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Streaming Quality</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Higher quality uses more network data</p>
                </div>
                <select className="w-full sm:w-48 bg-neutral-800 text-white rounded-lg p-2.5 md:p-3 outline-none border border-neutral-700 focus:border-[#1ed760] transition-colors cursor-pointer font-medium text-sm md:text-base shrink-0">
                  <option>Automatic</option>
                  <option>Low (Data Saver)</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Very High</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Equalizer Preset</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Tailor the audio profile to your preference</p>
                </div>
                <select className="w-full sm:w-48 bg-neutral-800 text-white rounded-lg p-2.5 md:p-3 outline-none border border-neutral-700 focus:border-purple-500 transition-colors cursor-pointer font-medium text-sm md:text-base shrink-0">
                  <option>Flat (Default)</option>
                  <option>Bass Boost</option>
                  <option>Acoustic</option>
                  <option>Vocal Booster</option>
                  <option>Electronic</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Normalize Volume</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Set the same perceived volume level for all tracks</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>
            </div>
          </section>

          {/* --- DATA & STORAGE SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Data & Storage</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Download Over Wi-Fi Only</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Save mobile data by restricting downloads</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-end mb-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Storage Usage</p>
                  <p className="text-xs font-bold text-neutral-400">850 MB / 10 GB</p>
                </div>
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-yellow-500 w-[8%]"></div>
                  <div className="h-full bg-neutral-600 w-[15%]"></div>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4 mt-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>Downloads</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neutral-600"></div>Cache</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700"></div>Free</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-5 mt-2 gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Clear App Cache</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Frees up storage. Won't delete your downloads.</p>
                </div>
                <button className="px-5 py-2.5 border cursor-pointer border-neutral-600 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors shrink-0">
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* --- APPEARANCE & DISPLAY SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Appearance</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Theme</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Choose your visual aesthetic</p>
                </div>
                <div className="flex w-full sm:w-auto bg-neutral-800 p-1 rounded-lg shrink-0">
                  <button className="flex-1 cursor-pointer sm:flex-none px-4 py-2 bg-neutral-700 text-white rounded-md text-sm font-bold shadow text-center">Dark</button>
                  <button className="flex-1 cursor-pointer sm:flex-none px-4 py-2 text-neutral-400 hover:text-white rounded-md text-sm font-bold transition-colors text-center">Light</button>
                  <button className="flex-1 cursor-pointer sm:flex-none px-4 py-2 text-neutral-400 hover:text-white rounded-md text-sm font-bold transition-colors text-center">OLED</button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Hardware Acceleration</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Enable for smoother animations</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>
            </div>
          </section>

          {/* --- PRIVACY SECTION --- */}
          <section className="bg-neutral-900/40 p-5 md:p-6 rounded-2xl border border-neutral-800/60 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-900/60">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Privacy & Social</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Private Session</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Temporarily hide your listening activity</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={false} /></div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-base md:text-lg text-white leading-tight">Public Playlists</p>
                  <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-snug">Allow others to see playlists on your profile</p>
                </div>
                <div className="shrink-0"><Toggle defaultChecked={true} /></div>
              </div>
            </div>
          </section>

          {/* --- DANGER ZONE --- */}
          <section className="mt-2 mb-10 text-center sm:text-left">
            <button 
              onClick={onLogout}
              className="w-full cursor-pointer sm:w-auto px-8 py-3.5 md:py-3 bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-full shadow-lg"
            >
              Log Out of TEZ
            </button>
          </section>

        </div>
      </div>

      {/* ✨ EDIT PROFILE MODAL ✨ */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-fade-in-up">
            <h2 className="text-3xl font-black mb-8 text-white">Edit Profile</h2>
            
            <form className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-neutral-400">Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Taffique" 
                  defaultValue={userProfile?.name}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-800 rounded-xl py-3.5 px-5 border border-transparent focus:border-[#1ed760] outline-none transition-all text-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-neutral-400">Profile Picture</label>
                
                <div className="flex items-center gap-5 bg-neutral-800 p-4 rounded-xl border border-neutral-700/50">
                  <div className="w-16 h-16 rounded-full bg-neutral-700 overflow-hidden shrink-0 border border-neutral-600 shadow-inner">
                    {imagePreview || userProfile?.avatarUrl ? (
                      <img src={imagePreview || userProfile.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                    )}
                  </div>

                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-neutral-400 
                      file:mr-4 file:py-2.5 file:px-5 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-bold 
                      file:bg-white file:text-black 
                      hover:file:bg-neutral-200 file:cursor-pointer file:transition-colors file:shadow-md"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-6 border-t border-neutral-800">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full cursor-pointer sm:w-auto px-6 py-3 sm:py-2.5 text-neutral-400 font-bold hover:text-white transition-colors rounded-full"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveChanges}
                  className="w-full sm:w-auto px-8 py-3 cursor-pointer sm:py-2.5 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 hover:bg-[#1fdf64] transition-all shadow-[0_0_20px_rgba(30,215,96,0.2)]"
                >
                  Save Profile
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
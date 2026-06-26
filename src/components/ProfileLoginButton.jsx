import React from 'react';

// Catch the props passed down from Navbar
const ProfileLoginButton = ({ user, onLoginClick, onLogout }) => {
  
  return (
    <div>
      {/* The Circular Button */}
      <button
        onClick={user ? onLogout : onLoginClick}
        title={user ? "Click to Logout" : "Click to Login"}
        className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden bg-neutral-800 flex items-center justify-center border-2 border-transparent hover:border-[#1ed760] transition-all duration-300 shadow-md focus:outline-none"
      >
        {user ? (
          /* Logged In State: Dynamic Profile Image from Firebase */
          <img
            src={user.photoURL} // ✨ This uses the actual Google profile photo
            alt={user.displayName || "User Profile"}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150/1ed760/000000?text=User"; }}
          />
        ) : (
          /* Logged Out State: Generic User Icon */
          <svg
            className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ProfileLoginButton;
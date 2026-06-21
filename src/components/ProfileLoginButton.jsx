import React from 'react';

// Catch the props passed down from Navbar
const ProfileLoginButton = ({ user, onLoginClick, onLogout }) => {
  
  // A mock profile image (Later, this can be dynamic based on the user's data)
  const profileImageUrl = "https://via.placeholder.com/150/1ed760/000000?text=User";

  return (
    <div>
      {/* The Circular Button */}
      <button
        // If there is a user, click logs them out. If no user, click opens login modal.
        onClick={user ? onLogout : onLoginClick}
        title={user ? "Click to Logout" : "Click to Login"}
        className="relative w-12 h-12 rounded-full cursor-pointer overflow-hidden bg-neutral-800 flex items-center justify-center border-2 border-transparent hover:border-[#1ed760] transition-all duration-300 shadow-md focus:outline-none"
      >
        {user ? (
          /* Logged In State: Profile Image */
          <img
            src={profileImageUrl}
            alt="User Profile"
            className="w-full h-full object-cover"
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
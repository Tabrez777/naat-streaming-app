import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginModal = ({ onClose, onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fetch data from Firestore via UID
  const fetchAndLoginUser = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    let userDoc = await getDoc(userDocRef);

    // If it's a new Google user signing in via login modal, provision their profile safely
    if (!userDoc.exists()) {
      const username = user.email.split('@')[0];
      const newUserData = {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date().toISOString(),
        favoriteNaats: [],
        playlists: []
      };
      await setDoc(userDocRef, newUserData);
      userDoc = await getDoc(userDocRef);
    }

    // Save ID to localStorage
    localStorage.setItem('userId', user.uid);
    
    onLoginSuccess(userDoc.data());
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchAndLoginUser(userCredential.user);
    } catch (err) {
      setError("Invalid email or password! ❌");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await fetchAndLoginUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 w-full max-w-md p-8 rounded-2xl border border-neutral-800 shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Log in to listen 🎧</h2>
          <p className="text-neutral-400">Save your favorite Naats and create playlists.</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4 font-semibold">{error}</p>}

        <div className='flex flex-col gap-3 mb-6'>
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold rounded-full py-3 hover:bg-neutral-200 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-neutral-800"></div>
          <span className="text-neutral-400 text-sm font-semibold">OR</span>
          <div className="h-[1px] flex-1 bg-neutral-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Email Address</label>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-neutral-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white border border-transparent transition-all" required />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-neutral-800 text-white rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white border border-transparent transition-all" required />
          </div>

          <button type="submit" className="w-full bg-[#1ed760] text-black font-bold rounded-full py-3.5 mt-4 hover:scale-[1.02] hover:bg-[#1fdf64] transition-all">
            Log In
          </button>
        </form>
        <p className="text-neutral-400 text-sm text-center mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-[#1ed760] hover:underline font-bold transition-all">
            Sign up up for free
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
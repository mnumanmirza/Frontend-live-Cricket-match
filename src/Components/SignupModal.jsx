import React, { useState, useEffect, useRef } from 'react';

const SignupModal = ({ show, onClose, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [mobile, setMobile] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  if (!show) return null;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      setAvatarPreview(null);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('mobile', mobile);
      formData.append('password', password);
      if (profilePic) formData.append('profilePic', profilePic);

      const res = await fetch(`${apiBase}/api/signup`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      onSignup({ name: data.data.name, email: data.data.email, profilePic: data.data.profilePic, mobile: data.data.mobile, role: data.data.role });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Create an account</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {/* Avatar preview at top-center */}
          <div className="flex justify-center mt-2 mb-4">
            <div
              className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition-colors"
                aria-label="Select profile picture"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.85 0 5.48.83 7.879 2.236M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="text-xs mt-1">Add photo</div>
                  </div>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-300">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Mobile number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white outline-none"
                placeholder="e.g. +1234567890"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white outline-none"
                placeholder="Choose a password"
              />
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md font-medium text-white disabled:opacity-60"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

import React, { useState } from 'react';
import axios from 'axios';
import SummaryApi from '../Common/api.jsx';

const LoginModal = ({ show, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signinRes = await axios({ method: SummaryApi.signIn.method, url: SummaryApi.signIn.url, data: { email, password } });
      const signinData = signinRes?.data || {};
      if (signinData?.error) throw new Error(signinData.message || 'Login failed');

      // fetch user details using cookie set by signin
      const userRes = await axios({ method: SummaryApi.current_user.method, url: SummaryApi.current_user.url });
      const userData = userRes?.data || {};
      if (userData?.error) throw new Error(userData.message || 'Failed to fetch user');

      const user = userData.data || {};
      onLogin({ name: user.name, email: user.email, profilePic: user.profilePic, mobile: user.mobile, role: user.role });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Login to your account</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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
              <label className="text-xs text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white outline-none"
                placeholder="Your password"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md font-medium text-white disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
              >
                Cancel
              </button>
            </div>
            {error && <div className="text-sm text-red-400 mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

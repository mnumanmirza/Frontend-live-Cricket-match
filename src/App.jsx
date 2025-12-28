import React, { useState } from 'react';
import Header from './Components/Header';
import AdminPanel from './Components/admin/adminPanel';

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  if (isAdminMode) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header onEnterAdmin={() => setIsAdminMode(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to CricketStream.live</h2>
          <p className="text-xl text-gray-300 mb-8">Watch Live Cricket Matches in HD Quality</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4 text-yellow-500">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Live Streaming</h3>
              <p className="text-gray-400">Watch live cricket matches with real-time scores and commentary.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4 text-blue-500">💰</div>
              <h3 className="text-2xl font-bold mb-2">Premium Subscription</h3>
              <p className="text-gray-400">Subscribe to unlock all matches in HD with no ads interruption.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4 text-green-500">📱</div>
              <h3 className="text-2xl font-bold mb-2">Multi-Device</h3>
              <p className="text-gray-400">Stream on your phone, tablet, or computer anytime, anywhere.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-center">How to Watch Live Cricket</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
              <div>
                <h4 className="font-bold text-lg">Create an Account</h4>
                <p className="text-gray-400">Sign up for free to access basic match highlights and scores.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
              <div>
                <h4 className="font-bold text-lg">Choose Subscription Plan</h4>
                <p className="text-gray-400">Select from monthly or yearly premium plans for unlimited HD streaming.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
              <div>
                <h4 className="font-bold text-lg">Watch Live Matches</h4>
                <p className="text-gray-400">Enjoy live cricket streaming on any device with premium features.</p>
              </div>
            </li>
          </ol>
          
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-lg font-bold text-lg transition-all shadow-lg">
              Start Free Trial
            </button>
            <p className="text-gray-400 mt-4">7-day free trial for new subscribers</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>CricketStream.live &copy; {new Date().getFullYear()} - All rights reserved</p>
          <p className="mt-2 text-sm">This is a demo React application for live cricket streaming platform</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
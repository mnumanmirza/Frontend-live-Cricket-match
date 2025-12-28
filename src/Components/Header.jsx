import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTv, 
  FaUser, 
  FaSignInAlt, 
  FaUserPlus, 
  FaCrown, 
  FaUserShield,
  FaBars, 
  FaTimes,
  FaSearch,
  FaBell,
  FaHome,
  FaFire,
  FaCalendarAlt,
  FaVideo,
  FaNewspaper,
  FaChevronDown,
  FaPlayCircle,
  FaCreditCard,
  FaWallet,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdSportsCricket } from 'react-icons/md';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import LivePlayerModal from './LivePlayerModal';
import Toast from './Toast';

const Header = ({ onEnterAdmin }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const tickerRef = useRef(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [currentPlayingMatch, setCurrentPlayingMatch] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState('GENERAL');
  const [userMobile, setUserMobile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const liveMatches = [
    { id: 1, teams: 'IND vs AUS', tournament: 'T20 World Cup', score: 'IND: 145/3 (15.2)', viewers: '2.4M' },
    { id: 2, teams: 'ENG vs PAK', tournament: 'Test Series', score: 'ENG: 289/5 (72.1)', viewers: '1.1M' },
    { id: 3, teams: 'WI vs SA', tournament: 'ODI Series', score: 'WI: 210/7 (38.0)', viewers: '890K' },
    { id: 4, teams: 'NZ vs BAN', tournament: 'ODI Series', score: 'NZ: 320/5 (45.0)', viewers: '750K' },
    { id: 5, teams: 'SL vs AFG', tournament: 'T20 Series', score: 'SL: 180/4 (18.3)', viewers: '650K' }
  ];

  // Ensure we have a default playing match once liveMatches is available
  useEffect(() => {
    if (!currentPlayingMatch && liveMatches.length > 0) {
      setCurrentPlayingMatch(liveMatches[0]);
    }
  }, [currentPlayingMatch, liveMatches.length]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate login state
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      setUserName(localStorage.getItem('userName') || 'Cricket Fan');
      setUserProfilePic(localStorage.getItem('profilePic') || null);
      setUserEmail(localStorage.getItem('userEmail') || null);
      setUserMobile(localStorage.getItem('userMobile') || null);
      setUserRole(localStorage.getItem('userRole') || 'GENERAL');

      // Try to refresh server-side token to ensure role in cookie matches DB
      (async () => {
        try {
          const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
          const refreshRes = await fetch(`${apiBase}/api/refresh-token`, { method: 'POST', credentials: 'include' });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json().catch(() => ({}));
            if (refreshData && refreshData.data && refreshData.data.user) {
              const user = refreshData.data.user;
              localStorage.setItem('userRole', user.role || 'GENERAL');
              setUserRole(user.role || 'GENERAL');
              if (user.email) {
                localStorage.setItem('userEmail', user.email);
                setUserEmail(user.email);
              }
              if (user.name) {
                localStorage.setItem('userName', user.name);
                setUserName(user.name);
              }
            }
          }
        } catch (e) {
          console.warn('Header: token refresh failed', e?.message || e);
        }
      })();
    }
  }, []);

  // Auto-scroll for ticker
  useEffect(() => {
    if (isTickerPaused) return;
    
    const interval = setInterval(() => {
      setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isTickerPaused, liveMatches.length]);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Cricket Fan');
    setIsLoggedIn(true);
    setUserName('Cricket Fan');
    setIsMobileMenuOpen(false);
  };

  const handleLoginWithData = ({ name, email, profilePic, mobile, role }) => {
    const displayName = name || email?.split('@')[0] || 'User';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', displayName);
    if (profilePic) localStorage.setItem('profilePic', profilePic);
    if (email) localStorage.setItem('userEmail', email);
    if (mobile) localStorage.setItem('userMobile', mobile);
    if (role) localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setUserName(displayName);
    setUserProfilePic(profilePic || null);
    setUserEmail(email || null);
    setUserMobile(mobile || null);
    if (role) setUserRole(role);
    setIsMobileMenuOpen(false);
    setToast({ show: true, message: 'Logged in successfully', type: 'success' });
  };

  const handleSignup = ({ name, email, profilePic, mobile, role }) => {
    const displayName = name || email.split('@')[0] || 'User';
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', displayName);
    if (profilePic) localStorage.setItem('profilePic', profilePic);
    if (email) localStorage.setItem('userEmail', email);
    if (mobile) localStorage.setItem('userMobile', mobile);
    if (role) localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setUserName(displayName);
    setUserProfilePic(profilePic || null);
    setUserEmail(email || null);
    setUserMobile(mobile || null);
    if (role) setUserRole(role);
    setIsMobileMenuOpen(false);
    setToast({ show: true, message: 'Account created — welcome!', type: 'success' });
  };

  const handleStartTrial = (match) => {
    const selected = match || (liveMatches && liveMatches.length ? liveMatches[0] : null);
    // Mark trial started
    localStorage.setItem('isOnTrial', 'true');
    // Open live tab and show player modal
    setActiveTab('live');
    setCurrentPlayingMatch(selected);
    setShowPlayerModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  };

  const handleSubscribe = (match) => {
    // Start a free trial by default and open the live player
    handleStartTrial(match);
  };

  const handlePayment = () => {
    alert('Opening payment gateway for subscription...');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'live', label: 'Live', icon: <FaFire /> },
    { id: 'upcoming', label: 'Upcoming', icon: <FaCalendarAlt /> },
    { id: 'highlights', label: 'Highlights', icon: <FaVideo /> },
    { id: 'news', label: 'News', icon: <FaNewspaper /> },
  ];

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length);
  };

  const prevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + liveMatches.length) % liveMatches.length);
  };

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 text-black py-2 px-2 sm:px-4 text-center text-xs sm:text-sm font-bold whitespace-nowrap overflow-hidden">
        <div className="inline-flex animate-marquee">
          <span className="mx-4">🔥 SPECIAL OFFER: Get 50% off on Annual Subscription! Limited Time Offer 🔥</span>
          <span className="mx-4">🔥 SPECIAL OFFER: Get 50% off on Annual Subscription! Limited Time Offer 🔥</span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900'}`}>
        {/* Main Header */}
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="relative">
                  <MdSportsCricket className="text-2xl sm:text-3xl md:text-4xl text-yellow-500 animate-bounce" />
                  <FaPlayCircle className="text-xs absolute -bottom-1 -right-1 text-green-400" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                    Cricket<span className="text-blue-400">Stream</span>Pro
                  </h1>
                  <p className="text-xs text-gray-300 flex items-center">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                    LIVE Cricket
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                    CSP
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Responsive */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl transition-all duration-300 ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg' 
                    : 'hover:bg-gray-800/70 text-gray-300 hover:text-white'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="mr-1 md:mr-2 text-sm md:text-base">{item.icon}</span>
                  <span className="text-sm md:text-base">{item.label}</span>
                  {item.id === 'live' && (
                    <span className="ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 bg-red-600 text-xs rounded-full animate-pulse">LIVE</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Search Bar - Responsive */}
              <div className={`hidden md:flex items-center transition-all duration-300 ${searchOpen ? 'w-48 lg:w-64' : 'w-10'} bg-gray-800/80 backdrop-blur-sm rounded-full overflow-hidden`}>
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 hover:text-yellow-400 transition-colors flex-shrink-0"
                >
                  <FaSearch />
                </button>
                <input 
                  type="text" 
                  placeholder="Search..."
                  className={`bg-transparent border-none outline-none text-sm transition-all duration-300 ${searchOpen ? 'w-full opacity-100 px-2' : 'w-0 opacity-0'}`}
                />
              </div>

              {/* Mobile Search Button */}
              <button className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                <FaSearch className="text-lg" />
              </button>

              {/* Subscription Button - Responsive (hidden when logged in) */}
              {!isLoggedIn && (
                <div className="relative hidden sm:block">
                  <button
                    onClick={handleSubscribe}
                    className="flex items-center px-3 py-1 sm:px-4 sm:py-1.5 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 group text-sm sm:text-sm"
                  >
                    <FaCrown className="mr-1 sm:mr-2 group-hover:animate-spin text-xs sm:text-sm" />
                    <span className="text-black hidden sm:inline">GO PRO</span>
                    <span className="text-black sm:hidden">PRO</span>
                    <div className="absolute -top-0 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-bounce hidden sm:block">
                      HOT
                    </div>
                  </button>
                </div>
              )}

              {/* Notifications - Responsive */}
              {isLoggedIn && (
                <div className="hidden md:block relative">
                  <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group relative">
                    <FaBell className="text-lg group-hover:text-yellow-400 transition-colors" />
                    {notifications > 0 && (
                      <>
                        <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-ping opacity-75"></span>
                        <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                          {notifications}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* User Authentication - Responsive */}
              {isLoggedIn ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-300 group"
                  >
                    <div className="relative">
                      {userProfilePic ? (
                        <img src={userProfilePic} alt="avatar" className="h-8 w-8 rounded-full object-cover shadow-lg border border-gray-700" />
                      ) : (
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="font-medium text-white text-sm">{userName}</p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <FaCrown className="text-yellow-500 mr-1 text-xs" />
                        Premium
                      </p>
                    </div>
                    <FaChevronDown className={`transition-transform duration-300 text-sm ${showUserDropdown ? 'rotate-180' : ''} hidden lg:block`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 lg:w-64 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-fadeIn">
                      <div className="p-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          {userProfilePic ? (
                            <img src={userProfilePic} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm">{userName}</p>
                            <p className="text-xs text-gray-400 truncate">{userEmail || 'cricket.fan@email.com'}</p>
                            {userMobile && (
                              <p className="text-xs text-gray-400 truncate">{userMobile}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button className="w-full flex items-center px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-sm">
                          <FaUser className="mr-3 text-blue-400 text-sm" />
                          <span>My Profile</span>
                        </button>
                        {userRole === 'ADMIN' && (
                          <button
                            onClick={() => { if (onEnterAdmin) onEnterAdmin(); setShowUserDropdown(false); }}
                            className="w-full flex items-center px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-sm"
                          >
                            <FaUserShield className="mr-3 text-yellow-400 text-sm" />
                            <span>Admin Panel</span>
                          </button>
                        )}
                        <button className="w-full flex items-center px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-sm">
                          <FaCreditCard className="mr-3 text-green-400 text-sm" />
                          <span>Subscription</span>
                          <span className="ml-auto bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">PRO</span>
                        </button>
                        <button 
                          onClick={handlePayment}
                          className="w-full flex items-center px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg transition-colors mt-2 font-bold text-sm"
                        >
                          <FaCrown className="mr-3" />
                          <span>Upgrade Plan</span>
                        </button>
                      </div>
                      
                      <div className="p-3 border-t border-gray-700">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center px-3 py-2 bg-red-700/30 hover:bg-red-700/50 rounded-lg transition-colors font-medium text-sm"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 text-sm"
                  >
                    <FaSignInAlt className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/30 text-sm"
                  >
                    <FaUserPlus className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Matches Ticker - Responsive */}
        <div className="bg-gradient-to-r from-red-900/80 via-red-800/80 to-red-900/80 py-2 px-2 sm:px-4 border-y border-red-700/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              {/* Live Indicator */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center bg-red-600 px-2 py-1 rounded-full animate-pulse flex-shrink-0">
                  <span className="h-1.5 w-1.5 bg-white rounded-full mr-1 sm:mr-2"></span>
                  <span className="text-xs sm:text-sm font-bold">LIVE</span>
                </div>
                
                {/* Mobile Match Ticker */}
                <div className="md:hidden flex items-center space-x-3 overflow-hidden w-full max-w-[200px]">
                  <button 
                    onClick={prevMatch}
                    className="text-white/70 hover:text-white p-1"
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <div 
                    className="flex-1 text-center overflow-hidden"
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    <div className={`transition-transform duration-500 ease-in-out`}>
                      <div className="flex flex-col items-center">
                        <div className="text-xs sm:text-sm font-medium truncate w-full">
                          {liveMatches[currentMatchIndex].teams}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-300">
                          {liveMatches[currentMatchIndex].score}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextMatch}
                    className="text-white/70 hover:text-white p-1"
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    <FaChevronRight />
                  </button>
                </div>

                {/* Desktop Match Ticker */}
                <div className="hidden md:flex items-center space-x-4 lg:space-x-6 overflow-x-auto scrollbar-hide">
                  {liveMatches.slice(0, 3).map((match) => (
                    <div 
                      key={match.id} 
                      className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0"
                      onMouseEnter={() => setIsTickerPaused(true)}
                      onMouseLeave={() => setIsTickerPaused(false)}
                    >
                      <div className="text-sm font-medium whitespace-nowrap">{match.teams}</div>
                      <div className="text-xs text-gray-300 hidden lg:block">{match.score}</div>
                      <div className="text-xs text-yellow-300 hidden xl:block">
                        👁 {match.viewers}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Watch All Button */}
              <button className="hidden lg:flex items-center text-sm bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                <FaTv className="mr-2" />
                WATCH ALL
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Responsive */}
        <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MdSportsCricket className="text-2xl sm:text-3xl text-yellow-500" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">CricketStreamPro</h2>
                    <p className="text-xs text-gray-400">Live Streaming</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* User Profile Section */}
              {isLoggedIn ? (
                <div className="mb-6 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {userProfilePic ? (
                      <img src={userProfilePic} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-xl">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{userName}</p>
                      <p className="text-sm text-gray-400">Premium Member</p>
                      <div className="flex items-center mt-1">
                        <div className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">PRO</div>
                        <span className="text-xs text-gray-400 ml-2 truncate">Expires: 30 Dec 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }}
                    className="py-2.5 sm:py-3 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl font-medium transition-all text-sm sm:text-base"
                  >
                    <FaSignInAlt className="inline mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => { setShowSignupModal(true); setIsMobileMenuOpen(false); }}
                    className="py-2.5 sm:py-3 bg-gradient-to-r from-green-700 to-green-800 rounded-xl font-medium transition-all text-sm sm:text-base"
                  >
                    <FaUserPlus className="inline mr-2" />
                    Sign Up
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-4">
                <div className="flex items-center bg-gray-800 rounded-xl px-3 sm:px-4 py-2.5">
                  <FaSearch className="text-gray-400 mr-2 sm:mr-3" />
                  <input
                    type="text"
                    placeholder="Search matches, teams..."
                    className="bg-transparent border-none outline-none text-sm flex-1 text-white"
                  />
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1 mb-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 rounded-xl transition-all ${activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-800/50 to-blue-900/50 text-white border-l-4 border-blue-500'
                      : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                      }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 sm:mr-3 text-lg">{item.icon}</span>
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </div>
                    {item.id === 'live' && (
                      <span className="px-2 py-1 bg-red-600 text-xs rounded-full animate-pulse">LIVE</span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Subscription Section */}
              {/* Subscription Section - Mobile (hidden when logged in) */}
              {!isLoggedIn && (
                <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl border border-yellow-500/30">
                <div className="flex items-center mb-2 sm:mb-3">
                  <FaCrown className="text-yellow-500 text-lg sm:text-xl mr-2" />
                  <h3 className="font-bold text-white text-sm sm:text-base">Go Premium</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                  Unlock all live matches in 4K quality, no ads, and exclusive content.
                </p>
                <button
                  onClick={handleSubscribe}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-xl font-bold text-black transition-all text-sm sm:text-base"
                >
                  Subscribe Now - 50% OFF
                </button>
              </div>
              )}

              {/* Quick Actions */}
              {isLoggedIn && (
                <div className="space-y-1 mb-6">
                  <button className="w-full flex items-center px-3 sm:px-4 py-2.5 hover:bg-gray-800 rounded-xl transition-colors text-sm sm:text-base">
                    <FaUser className="mr-2 sm:mr-3 text-blue-400" />
                    My Profile
                  </button>
                  <button 
                    onClick={handlePayment}
                    className="w-full flex items-center px-3 sm:px-4 py-2.5 hover:bg-gray-800 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <FaCreditCard className="mr-2 sm:mr-3 text-green-400" />
                    Payment & Billing
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 sm:px-4 py-2.5 hover:bg-red-800/30 rounded-xl transition-colors text-red-400 text-sm sm:text-base"
                  >
                    Logout Account
                  </button>
                </div>
              )}

              {/* Live Match Status */}
              <div className="mt-6 p-3 sm:p-4 bg-red-900/30 rounded-xl border border-red-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-sm font-bold">NOW LIVE</span>
                  </div>
                  <span className="text-xs text-gray-400">{liveMatches.length} matches</span>
                </div>
                {liveMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between py-2 border-b border-red-800/50 last:border-0">
                    <span className="text-sm truncate pr-2">{match.teams}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{match.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={(user) => { handleLoginWithData(user); setShowLoginModal(false); }}
      />

      <SignupModal
        show={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignup={(data) => { handleSignup(data); setShowSignupModal(false); }}
      />

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, show: false }))} />

      <LivePlayerModal
        show={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        match={currentPlayingMatch}
      />

      {/* Custom Animations and Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Hide scrollbar for ticker */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Marquee animation for promo banner */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
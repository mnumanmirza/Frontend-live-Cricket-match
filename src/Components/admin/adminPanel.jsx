import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaCreditCard, 
  FaTv, 
  FaSignOutAlt,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaFilter,
  FaDownload,
  FaChartBar,
  FaCalendar,
  FaClock,
  FaUserShield,
  FaMoneyBillWave,
  FaPlayCircle,
  FaPauseCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaBars,
  FaHome,
  FaCog,
  FaBell
} from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 1524,
    totalRevenue: 45280,
    activeMatches: 3,
    pendingPayments: 12
  });

  // Users from backend
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  const [payments, setPayments] = useState([
    { id: 'PAY-001', user: 'John Doe', plan: 'Premium', amount: 299, status: 'Completed', date: '2024-03-15', method: 'Credit Card' },
    { id: 'PAY-002', user: 'Sarah Smith', plan: 'Basic', amount: 99, status: 'Completed', date: '2024-03-14', method: 'PayPal' },
    { id: 'PAY-003', user: 'Mike Johnson', plan: 'Premium', amount: 299, status: 'Failed', date: '2024-03-14', method: 'Credit Card' },
    { id: 'PAY-004', user: 'Emma Wilson', plan: 'Pro', amount: 499, status: 'Completed', date: '2024-03-13', method: 'Stripe' },
    { id: 'PAY-005', user: 'David Brown', plan: 'Basic', amount: 99, status: 'Pending', date: '2024-03-12', method: 'PayPal' },
    { id: 'PAY-006', user: 'Lisa Taylor', plan: 'Premium', amount: 299, status: 'Completed', date: '2024-03-12', method: 'Credit Card' },
    { id: 'PAY-007', user: 'Robert Garcia', plan: 'Pro', amount: 499, status: 'Completed', date: '2024-03-11', method: 'Stripe' },
    { id: 'PAY-008', user: 'Maria Martinez', plan: 'Basic', amount: 99, status: 'Refunded', date: '2024-03-10', method: 'PayPal' },
  ]);

  const [liveMatches, setLiveMatches] = useState([
    { id: 1, team1: 'India', team2: 'Australia', tournament: 'T20 World Cup', status: 'Live', viewers: 2450000, startTime: '2024-03-15 14:00', streamQuality: '4K' },
    { id: 2, team1: 'England', team2: 'Pakistan', tournament: 'Test Series', status: 'Live', viewers: 1100000, startTime: '2024-03-15 10:00', streamQuality: 'HD' },
    { id: 3, team1: 'West Indies', team2: 'South Africa', tournament: 'ODI Series', status: 'Upcoming', viewers: 0, startTime: '2024-03-16 13:00', streamQuality: 'HD' },
    { id: 4, team1: 'New Zealand', team2: 'Bangladesh', tournament: 'T20 Series', status: 'Ended', viewers: 890000, startTime: '2024-03-14 11:00', streamQuality: 'HD' },
    { id: 5, team1: 'Sri Lanka', team2: 'Afghanistan', tournament: 'ODI Series', status: 'Upcoming', viewers: 0, startTime: '2024-03-17 09:00', streamQuality: 'SD' },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [filteredMatches, setFilteredMatches] = useState(liveMatches);

  // Filter data based on search
  useEffect(() => {
    const filtered = users.filter(user => 
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Fetch users from backend
  useEffect(() => {
    const refreshAndFetch = async () => {
      setLoadingUsers(true);
      setUsersError('');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      try {
        // Attempt to refresh JWT from server so role changes are reflected
        try {
          const refreshRes = await fetch(`${apiBase}/api/refresh-token`, { method: 'POST', credentials: 'include' });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (!refreshData.error && refreshData.data && refreshData.data.user) {
              const user = refreshData.data.user;
              localStorage.setItem('userRole', user.role || 'GENERAL');
            }
          }
        } catch (e) {
          console.warn('Token refresh failed (continuing):', e.message || e);
        }

        const res = await fetch(`${apiBase}/api/all-users`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error(`Users endpoint returned ${res.status}`);
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Users endpoint did not return JSON');
        }
        const data = await res.json();
        if (data.error) throw new Error(data.message || 'Failed to load users');
        setUsers(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setUsersError(err.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    refreshAndFetch();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(payment => 
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  useEffect(() => {
    const filtered = liveMatches.filter(match => 
      match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMatches(filtered);
  }, [searchTerm, liveMatches]);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleDeleteMatch = (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      setLiveMatches(liveMatches.filter(match => match.id !== id));
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const handleUpdateMatchStatus = (id, newStatus) => {
    setLiveMatches(liveMatches.map(match => 
      match.id === id ? { ...match, status: newStatus } : match
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      case 'Live': return 'bg-red-100 text-red-800 animate-pulse';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Pro': return 'bg-indigo-100 text-indigo-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatViewers = (viewers) => {
    if (viewers >= 1000000) return `${(viewers / 1000000).toFixed(1)}M`;
    if (viewers >= 1000) return `${(viewers / 1000).toFixed(1)}K`;
    return viewers;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'justify-center'}`}>
            <FaTv className="text-2xl text-yellow-500" />
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">CricketStream</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <FaBars />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <FaChartBar className="text-lg" />
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <FaUsers className="text-lg" />
            {isSidebarOpen && <span className="ml-3">Users</span>}
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <FaCreditCard className="text-lg" />
            {isSidebarOpen && <span className="ml-3">Payments</span>}
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${activeTab === 'matches' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <FaTv className="text-lg" />
            {isSidebarOpen && <span className="ml-3">Live Matches</span>}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <FaCog className="text-lg" />
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'payments' && 'Payment Management'}
              {activeTab === 'matches' && 'Live Match Management'}
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'users' && 'Manage all user accounts and subscriptions'}
              {activeTab === 'payments' && 'View and manage payment transactions'}
              {activeTab === 'matches' && 'Schedule and manage live cricket matches'}
              {activeTab === 'dashboard' && 'Overview and analytics'}
              {activeTab === 'settings' && 'System configuration'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <FaBell className="text-xl text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </div>
            </div>

            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <FaArrowUp className="mr-1" /> 12% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <FaArrowUp className="mr-1" /> 24% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Matches</p>
                <p className="text-3xl font-bold mt-2">{stats.activeMatches}</p>
                <p className="text-blue-600 text-sm mt-1 flex items-center">
                  <FaPlayCircle className="mr-1" /> Currently streaming
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTv className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingPayments}</p>
                <p className="text-yellow-600 text-sm mt-1 flex items-center">
                  <FaClock className="mr-1" /> Need approval
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaCreditCard className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <p className="text-gray-600 text-sm">Manage all registered users and their subscriptions</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                    <FaFilter className="mr-2" />
                    Filter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                    <FaDownload className="mr-2" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
                    <FaPlus className="mr-2" />
                    Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loadingUsers && (
                  <div className="p-4 text-center text-gray-600">Loading users...</div>
                )}
                {usersError && (
                  <div className="p-4 text-center text-red-500">
                    <div>{usersError}</div>
                  </div>
                )}
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                              {(user.name || user.email || '').charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{user.name || user.email}</div>
                              <div className="text-gray-500 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <select
                              value={user.role || 'GENERAL'}
                              onChange={async (e) => {
                                const newRole = e.target.value;
                                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';

                                // Try to refresh server JWT first so role in cookie is up-to-date
                                try {
                                  const refreshRes = await fetch(`${apiBase}/api/refresh-token`, { method: 'POST', credentials: 'include' });
                                  if (refreshRes.ok) {
                                    const refreshData = await refreshRes.json().catch(() => ({}));
                                    if (refreshData && refreshData.data && refreshData.data.user) {
                                      localStorage.setItem('userRole', refreshData.data.user.role || 'GENERAL');
                                    }
                                  }
                                } catch (refreshErr) {
                                  console.warn('Token refresh before role-change failed:', refreshErr?.message || refreshErr);
                                }

                                // Ensure current client role is ADMIN before attempting change
                                const currentRole = localStorage.getItem('userRole') || 'GENERAL';
                                if (currentRole !== 'ADMIN') {
                                  alert('Only admins can change user roles. Please sign in as an admin or refresh your session.');
                                  return;
                                }

                                // optimistic update
                                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
                                try {
                                  const res = await fetch(`${apiBase}/api/user/${user._id}/role`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    credentials: 'include',
                                    body: JSON.stringify({ role: newRole }),
                                  });
                                  const data = await res.json().catch(() => ({}));
                                  if (!res.ok || data.error) throw new Error(data.message || `Failed to change role (status ${res.status})`);

                                  // If changing our own role, update local storage
                                  const meEmail = localStorage.getItem('userEmail');
                                  if (meEmail && meEmail === user.email) {
                                    localStorage.setItem('userRole', newRole);
                                  }
                                } catch (err) {
                                  console.error('Change role failed', err);
                                  // revert on error
                                  setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: user.role } : u));
                                  alert('Failed to change role: ' + (err.message || 'Unknown'));
                                }
                              }}
                              disabled={(localStorage.getItem('userRole') || 'GENERAL') !== 'ADMIN'}
                              title={(localStorage.getItem('userRole') || 'GENERAL') !== 'ADMIN' ? 'Only admins can change roles' : ''}
                              className={`bg-white border border-gray-200 rounded-md px-2 py-1 text-sm ${((localStorage.getItem('userRole') || 'GENERAL') !== 'ADMIN') ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                              <option value="GENERAL">GENERAL</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isVerified ? 'Active' : 'Inactive')}`}>
                            {user.isVerified ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                        <td className="py-4 px-6 text-gray-500">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                              <FaEye />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                            {user.status === 'Active' ? (
                              <button 
                                onClick={() => handleUpdateStatus(user.id, 'Suspended')}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" 
                                title="Suspend"
                              >
                                <FaPauseCircle />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUpdateStatus(user.id, 'Active')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                                title="Activate"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Payment Management</h3>
                  <p className="text-gray-600 text-sm">View and manage all payment transactions</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                    <FaFilter className="mr-2" />
                    Filter
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
                    <FaPlus className="mr-2" />
                    Add Payment
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">{payment.id}</td>
                        <td className="py-4 px-6">{payment.user}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(payment.plan)}`}>
                            {payment.plan}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">{formatCurrency(payment.amount)}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{payment.date}</td>
                        <td className="py-4 px-6 text-gray-500">{payment.method}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                              <FaEye />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                              <FaEdit />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Refund">
                              <FaMoneyBillWave />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-gray-200">
                <h4 className="font-semibold mb-4">Payment Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-bold text-2xl">
                      {formatCurrency(payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                    <p className="text-green-600">Total Revenue</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 font-bold text-2xl">
                      {payments.filter(p => p.status === 'Pending').length}
                    </p>
                    <p className="text-yellow-600">Pending Payments</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-bold text-2xl">
                      {formatCurrency(payments.filter(p => p.status === 'Completed' && p.plan === 'Premium').reduce((sum, p) => sum + p.amount, 0))}
                    </p>
                    <p className="text-blue-600">Premium Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Live Match Management</h3>
                  <p className="text-gray-600 text-sm">Schedule and manage live cricket matches</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                    <FaFilter className="mr-2" />
                    Filter
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
                    <FaPlus className="mr-2" />
                    Add Match
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewers</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMatches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {match.team1} vs {match.team2}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{match.tournament}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <FaEye className="text-gray-400 mr-2" />
                            {formatViewers(match.viewers)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{match.startTime}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {match.streamQuality}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                              <FaEye />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteMatch(match.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                            {match.status === 'Upcoming' && (
                              <button 
                                onClick={() => handleUpdateMatchStatus(match.id, 'Live')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg" 
                                title="Start Stream"
                              >
                                <FaPlayCircle />
                              </button>
                            )}
                            {match.status === 'Live' && (
                              <button 
                                onClick={() => handleUpdateMatchStatus(match.id, 'Ended')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg" 
                                title="End Stream"
                              >
                                <FaTimesCircle />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-gray-200">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center">
                    <FaPlus className="text-2xl text-gray-400 mb-2" />
                    <p className="font-medium">Schedule New Match</p>
                    <p className="text-sm text-gray-500">Add upcoming match</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 flex flex-col items-center justify-center">
                    <FaCalendar className="text-2xl text-gray-400 mb-2" />
                    <p className="font-medium">Tournament Calendar</p>
                    <p className="text-sm text-gray-500">View all schedules</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 flex flex-col items-center justify-center">
                    <FaChartBar className="text-2xl text-gray-400 mb-2" />
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-500">Match performance</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(payment.amount)}</p>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Matches */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Live Matches Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold">{match.team1} vs {match.team2}</h4>
                          <p className="text-sm text-gray-600">{match.tournament}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Viewers: {formatViewers(match.viewers)}</span>
                        <span>Quality: {match.streamQuality}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                          Manage
                        </button>
                        <button className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm">
                          Stats
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-6">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="CricketStream Pro" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="admin@cricketstream.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stream Quality</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>HD (720p)</option>
                      <option selected>Full HD (1080p)</option>
                      <option>4K Ultra HD</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option selected>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Credit Card
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        PayPal
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Stripe
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="ml-3 text-sm text-gray-600">Enable maintenance mode</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg mr-3">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
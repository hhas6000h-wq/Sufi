
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import ProfilePage from './pages/Profile';
import ReelsPage from './pages/Reels';
import LudoPage from './pages/Ludo';
import AdminPage from './pages/Admin';
import LiveStreamsPage from './pages/LiveStreams';
import Navbar from './components/Navbar';
import { User, UserRole, SiteSettings } from './types';

const DEFAULT_SETTINGS: SiteSettings = {
  name: "ريل العراقي",
  title: "شات ريل العراقي - المحترفين",
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3670/3670151.png",
  chatBackground: "https://www.transparenttextures.com/patterns/pinstriped-suit.png",
  broadcastSettings: {
    quality: "1080p",
    isPublic: true,
  },
  broadcast: {
    serverUrl: "rtmp://live.iraqreal.pro/app",
    streamKey: "iraq_premium_key_8822",
    quality: "1080p",
    latencyMode: "low",
    maxViewers: 5000,
    isPublic: true,
    broadcastTitle: "بث مباشر من بغداد 🔥"
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('active_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('active_session', JSON.stringify(userData));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('active_session', JSON.stringify(updatedUser));
    
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    const updatedDb = dbUsers.map((u: any) => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem('db_users', JSON.stringify(updatedDb));
  };

  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem('site_settings', JSON.stringify(newSettings));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('active_session');
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col no-scrollbar">
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <HomePage user={user} siteName={siteSettings.name} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} />
          <Route path="/chat" element={user ? <ChatPage user={user} background={siteSettings.chatBackground} /> : <Navigate to="/auth" />} />
          <Route path="/reels" element={user ? <ReelsPage user={user} /> : <Navigate to="/auth" />} />
          <Route path="/live" element={user ? <LiveStreamsPage user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} />
          <Route path="/ludo" element={user ? <LudoPage user={user} /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminPage user={user} settings={siteSettings} onUpdateSettings={handleUpdateSettings} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {user && <Navbar userRole={user.role} />}
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { Home, Compass, User, LogOut, PlusSquare, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      {/* Sidebar - Original beautiful Glass styling */}
      <aside className="sidebar glass-card">
        <div className="sidebar-logo" style={{textAlign: 'center', marginBottom: '25px'}}>
          <h2 className="gradient-text">Enthepro</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Home size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Compass size={24} />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <User size={24} />
            <span>Profile</span>
          </NavLink>
        </nav>
          <div className="sidebar-footer" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div className="user-info">
              <img src={user?.avatar} alt="User Avatar" className="avatar-sm" />
              <div className="user-text">
                <p className="username">{user?.username}</p>
                <p className="handle">@{user?.username?.toLowerCase()}</p>
                <div style={{display: 'flex', gap: '8px', fontSize: '11px', marginTop: '4px', color: 'var(--text-secondary)'}}>
                  <span><b>128</b> Mengikuti</span>
                  <span><b>256</b> Pengikut</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsLightMode(!isLightMode)} 
              style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: '100%', transition: 'all 0.3s' }}
            >
              {isLightMode ? <><Moon size={18} /> <span>Mode Gelap</span></> : <><Sun size={18} /> <span>Mode Terang</span></>}
            </button>

            <button onClick={handleLogout} className="logout-btn" style={{width: '100%'}}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="navbar glass-card">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search hashtags..." className="search-input" />
          </div>
          <div className="nav-actions">
            <button className="create-btn gradient-btn" style={{padding: '8px 16px'}} onClick={() => {
              const textarea = document.getElementById('post-textarea');
              if (textarea) {
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                textarea.focus();
              } else {
                navigate('/');
                setTimeout(() => document.getElementById('post-textarea')?.focus(), 100);
              }
            }}>
              <PlusSquare size={18} />
              <span>Create Post</span>
            </button>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { api } from '../services/api';
import PostCard from '../components/feed/PostCard';
import { Edit2, Camera, LogOut, Check, X, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { posts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user?.bio || '');
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserPosts = async () => {
        setLoading(true);
        // Usually there's an endpoint for user-specific posts, 
        // but for now we filter from all posts if the API doesn't provide a specific one.
        // The subagent found GET /api/posts returns all, but often we want current user's.
        // Assuming we filter here for simplicity or use a dedicated endpoint if available.
        const response = await api.getExplorePosts();
        if (response.success) {
          setUserPosts(response.data.filter(p => p.user_id === user.id || p.user?.id === user.id));
        }
        setLoading(false);
      };
      fetchUserPosts();
    }
  }, [user, posts]);

  const handleSave = async () => {
    const res = await updateProfile({ bio: editedBio });
    if (res.success) {
      setIsEditing(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await updateProfile({ bio: user.bio }, file);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header-container glass-card">
        <div className="profile-cover"></div>
        <div className="profile-info-section">
          <div className="profile-avatar-wrapper">
            <img src={user.profile_photo_url || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} className="profile-avatar" />
            <label className="change-avatar-btn cursor-pointer">
              <Camera size={18} />
              <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>

          <div className="profile-meta-actions">
            {!isEditing ? (
              <div className="profile-actions-buttons">
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
                <button className="logout-direct-btn" onClick={logout} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="edit-profile-actions">
                <button className="cancel-edit-btn" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </button>
                <button className="save-edit-btn btn-primary" onClick={handleSave}>
                  <Check size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-handle">@{user.username}</p>
            
            {isEditing ? (
              <div className="profile-edit-inputs">
                <textarea 
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <p className="profile-bio">{user.bio || "No bio yet."}</p>
            )}

            <div className="profile-stats">
              <div className="stat-group">
                <div className="stat-item clickable">
                  <span className="stat-value">128</span>
                  <span className="stat-label">Mengikuti</span>
                </div>
                <div className="stat-item clickable">
                  <span className="stat-value">256</span>
                  <span className="stat-label">Pengikut</span>
                </div>
                <div className="stat-item">
                  <Calendar size={16} />
                  <span>Joined {new Date(user.created_at || new Date()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 className="section-title">Your Posts</h2>
        <div className="posts-grid">
          {loading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="empty-profile-posts glass-card">
              <p>You haven't posted anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

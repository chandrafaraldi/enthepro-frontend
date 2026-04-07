import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Edit3, MoreHorizontal, FileText, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import { HighlightHashtags } from '../common/HighlightHashtags';
import CommentSection from './CommentSection';
import './PostCard.css';

const PostCard = ({ post }) => {
  const { toggleLike, deletePost, updatePost } = usePosts();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editContent, setEditContent] = useState(post.caption || '');
  const [showMenu, setShowMenu] = useState(false);

  // Map backend fields to frontend logic
  const postUser = post.user || {};
  const isOwner = user?.id === postUser.id;
  const isGodMode = user?.id === 1; // Admin God Mode Privilege
  const canModify = isOwner || isGodMode;
  
  // Likes handling - assuming post.likes is an array of user objects or IDs
  // If the backend returns a simple count and is_liked boolean, we'd use that.
  // Based on common patterns:
  const likesCount = post.likes_count || post.likes?.length || 0;
  const hasLiked = post.is_liked || (Array.isArray(post.likes) && post.likes.some(l => (l.id || l) === user?.id));

  const handleUpdate = async () => {
    if (editContent.trim()) {
      await updatePost(post.id, editContent);
      setIsEditing(false);
    }
  };

  const handleBlock = () => {
    if(window.confirm('Apakah Anda yakin ingin melakukan block pada user ini?')) {
      setIsBlocked(true);
      setShowMenu(false);
    }
  };

  if (isBlocked) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="post-card glass-card" style={{ textAlign: 'center', opacity: 0.5 }}
      >
        <p><Ban size={16} style={{display:'inline', marginBottom:'-3px'}}/> Postingan dari pengguna ini telah diblokir.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="post-card glass-card"
    >
      <div className="post-header">
        <div className="user-meta">
          <img 
            src={postUser.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${postUser.username}`} 
            alt={postUser.username} 
            className="avatar-sm" 
          />
          <div className="user-details">
            <span className="username" style={{display: 'flex', alignItems: 'center'}}>
              {postUser.name || postUser.username}
              {!isOwner && (
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  style={{
                    marginLeft: '10px', padding: '3px 10px', borderRadius: '12px', 
                    fontSize: '11px', cursor: 'pointer', fontWeight: 'bold',
                    background: isFollowing ? 'transparent' : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                    color: isFollowing ? '#aaa' : '#fff',
                    border: isFollowing ? '1px solid #555' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isFollowing ? 'Mengikuti' : '+ Ikuti'}
                </button>
              )}
            </span>
            <span className="timestamp">
              {new Date(post.created_at).toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="post-actions-menu">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-trigger">
            <MoreHorizontal size={20} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="dropdown-menu glass-card"
              >
                {canModify ? (
                  <>
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                      <Edit3 size={16} /> <span>{isGodMode && !isOwner ? 'Force Edit' : 'Edit'}</span>
                    </button>
                    <button onClick={() => deletePost(post.id)} className="delete-action">
                      <Trash2 size={16} /> <span>{isGodMode && !isOwner ? 'Annihilate (Delete)' : 'Delete'}</span>
                    </button>
                    {!isOwner && (
                      <button onClick={handleBlock} className="block-action" style={{ color: '#ff4d4f' }}>
                        <Ban size={16} /> <span>Block User</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button onClick={handleBlock} className="block-action" style={{ color: '#ff4d4f' }}>
                    <Ban size={16} /> <span>Block</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="post-body">
        {isEditing ? (
          <div className="edit-mode">
            <textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-input"
            />
            <div className="edit-buttons">
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleUpdate} className="save-btn gradient-btn">Save</button>
            </div>
          </div>
        ) : (
          <p className="post-content">
            <HighlightHashtags text={post.caption} />
          </p>
        )}

        {post.image_url && (
          <div className="post-image-container">
            <img src={post.image_url} alt="Post content" className="post-image" />
          </div>
        )}

        {post.attachment_url && (
          <div className="post-file-attachment">
            <FileText size={20} />
            <span>{post.attachment_name || 'Attachment'}</span>
          </div>
        )}
      </div>

      <div className="post-footer">
        <button 
          onClick={() => toggleLike(post.id)} 
          className={`footer-action-btn like-btn ${hasLiked ? 'active' : ''}`}
        >
          <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="footer-action-btn comment-btn"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count || post.comments?.length || 0}</span>
        </button>
        
        <button className="footer-action-btn share-btn">
          <Share2 size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <CommentSection postId={post.id} comments={post.comments} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};


export default PostCard;

import React, { useState } from 'react';
import { Send, Image, FileText, Trash2, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ postId, comments }) => {
  const { addComment, deleteComment, updateComment } = usePosts();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() || commentImage) {
      await addComment(postId, newComment, commentImage);
      setNewComment('');
      setCommentImage(null);
    }
  };

  const handleUpdate = async (commentId) => {
    if (editContent.trim()) {
      await updateComment(commentId, editContent);
      setEditingCommentId(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCommentImage(file);
  };

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="comments-container"
    >
      <div className="comments-list">
        {Array.isArray(comments) && comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img 
              src={comment.user?.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username}`} 
              alt={comment.user?.username} 
              className="avatar-xs" 
            />
            <div className="comment-content-wrapper">
              <div className="comment-bubble">
                <div className="comment-author-info">
                  <span className="comment-username">{comment.user?.name || comment.user?.username}</span>
                  <span className="comment-time">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="edit-comment-form">
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="edit-comment-btns">
                      <button type="button" onClick={() => setEditingCommentId(null)}>Cancel</button>
                      <button type="button" onClick={() => handleUpdate(comment.id)} className="save-btn">Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.body}</p>
                )}

                {comment.image_url && <img src={comment.image_url} alt="Attachment" className="comment-attachment" />}
              </div>
              
              {user?.id === comment.user?.id && !editingCommentId && (
                <div className="comment-actions">
                  <button onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditContent(comment.body);
                  }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteComment(comment.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-input-wrapper">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <label className="comment-upload-btn cursor-pointer">
            <Image size={18} />
            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
          </label>
          <button type="submit" className="comment-submit-btn" disabled={!newComment.trim() && !commentImage}>
            <Send size={18} />
          </button>
        </div>
        {commentImage && (
          <div className="comment-preview">
            <span>{commentImage.name}</span>
            <button type="button" onClick={() => setCommentImage(null)}><X size={14} /></button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CommentSection;

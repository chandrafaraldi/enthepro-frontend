import React, { useState, useRef } from 'react';
import { Image, FileText, Send, X } from 'lucide-react';
import { usePosts } from '../../context/PostContext';
import { useAuth } from '../../context/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [otherFile, setOtherFile] = useState(null);
  const { createPost } = usePosts();
  const { user } = useAuth();
  
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOtherFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile && !otherFile) return;

    await createPost(content, imageFile, otherFile);
    setContent('');
    setImagePreview(null);
    setImageFile(null);
    setOtherFile(null);
  };

  return (
    <div className="create-post-container glass-card">
      <div className="create-post-header">
        <img src={user?.avatar} alt="Profile" className="avatar-sm" />
        <textarea
          id="post-textarea"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={250}
        />
      </div>
      
      {imagePreview && (
        <div className="preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button className="remove-preview" onClick={() => { setImagePreview(null); setImageFile(null); }}>
            <X size={16} />
          </button>
        </div>
      )}

      {otherFile && (
        <div className="preview-container file-preview">
          <FileText size={20} />
          <span>{otherFile.name}</span>
          <button className="remove-preview" onClick={() => setOtherFile(null)}>
            <X size={16} />
          </button>
        </div>
      )}


      <div className="create-post-footer">
        <div className="attachment-btns">
          <button type="button" onClick={() => imageInputRef.current.click()} title="Add Image">
            <Image size={20} />
          </button>
          <button type="button" onClick={() => fileInputRef.current.click()} title="Add File">
            <FileText size={20} />
          </button>
          <input 
            type="file" 
            hidden 
            ref={imageInputRef} 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
        </div>
        
        <div className="footer-right">
          <span className={`char-count ${content.length > 220 ? 'warning' : ''}`}>
            {content.length}/250
          </span>
          <button 
            className="send-btn gradient-btn" 
            onClick={handleSubmit}
            disabled={!content.trim() && !imageFile && !otherFile}
          >
            <span>Post</span>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

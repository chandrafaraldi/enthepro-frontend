import React, { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/feed/PostCard';
import { Search, TrendingUp, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import './Explore.css';

const Explore = () => {
  const { posts, loading } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);

  useEffect(() => {
    // Extract hashtags and count them
    const tags = {};
    posts.forEach(post => {
      const postTags = post.caption?.match(/#\w+/g) || [];
      postTags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
    
    setTrendingTags(sortedTags);
  }, [posts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = posts.filter(post => 
        post.caption?.toLowerCase().includes(q) || 
        post.user?.username.toLowerCase().includes(q) ||
        post.user?.name.toLowerCase().includes(q)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
  };

  return (
    <div className="explore-page">
      <div className="explore-search-container glass-card">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search posts, people, or hashtags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="explore-grid">
        <div className="explore-main">
          <h2 className="section-title">
            {searchQuery ? `Results for "${searchQuery}"` : "Discover"}
          </h2>
          
          <div className="explore-posts">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="empty-results glass-card">
                <p>No results found for your search.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="explore-sidebar">
          <div className="trending-box glass-card">
            <div className="trending-header">
              <TrendingUp size={20} />
              <h3>Trending for you</h3>
            </div>
            <div className="trending-list">
              {trendingTags.length > 0 ? (
                trendingTags.map(tag => (
                  <button 
                    key={tag} 
                    className="trending-item" 
                    onClick={() => handleTagClick(tag)}
                  >
                    <Hash size={16} />
                    <div className="tag-info">
                      <span className="tag-name">{tag}</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="no-tags">No trending topics yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Explore;

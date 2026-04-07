import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import CreatePost from '../components/forms/CreatePost';
import PostCard from '../components/feed/PostCard';
import { TrendingUp, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { posts, loading } = usePosts();
  const [trendingTags, setTrendingTags] = useState([]);

  useEffect(() => {
    const tags = {};
    posts.forEach(post => {
      const postTags = post.caption?.match(/#\w+/g) || [];
      postTags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    setTrendingTags(sortedTags);
  }, [posts]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="home-page"
    >
      <div className="feed-container">
        <CreatePost />
        
        <div className="posts-list">
          <AnimatePresence>
            {loading ? (
              <div className="loading-spinner">Memuat beranda Anda...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-feed glass-card"
              >
                <h3>Belum ada postingan.</h3>
                <p>Jadilah yang pertama untuk membagikan sesuatu hari ini!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <aside className="home-sidebar">
        <div className="trending-hashtags glass-card">
          <div className="trending-header">
            <TrendingUp size={18} />
            <h3>Sedang Tren</h3>
          </div>
          <ul className="trending-list">
            {trendingTags.length > 0 ? (
              trendingTags.map(([tag, count]) => (
                <li key={tag}>
                  <Link to={`/explore?q=${tag.replace('#', '')}`} className="trending-tag">
                    <span className="tag-name">{tag}</span>
                    <span className="tag-count">{count} posts</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="no-tags">Belum ada tren, yuk mulai!</li>
            )}
          </ul>
          <Link to="/explore" className="view-more-link">
            Jelajahi lebih banyak <ArrowRight size={14} />
          </Link>
        </div>
      </aside>
    </motion.div>
  );
};


export default Home;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await api.getExplorePosts();
    if (response.success) {
      setPosts(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (content, imageFile, otherFile) => {
    const response = await api.createPost(content, imageFile, otherFile);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const updatePost = async (postId, content) => {
    const response = await api.editPost(postId, content);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const deletePost = async (postId) => {
    const response = await api.deletePost(postId);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const addComment = async (postId, text, imageFile, otherFile) => {
    const response = await api.addComment(postId, text, imageFile, otherFile);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const updateComment = async (commentId, text) => {
    const response = await api.editComment(commentId, text);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const deleteComment = async (commentId) => {
    const response = await api.deleteComment(commentId);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const toggleLike = async (postId) => {
    const response = await api.likePost(postId);
    if (response.success) {
      await fetchPosts();
    }
    return response;
  };

  const value = {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
    toggleLike,
    refreshPosts: fetchPosts
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};


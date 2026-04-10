import axiosInstance from './axios';

export const api = {
  // Auth
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      return { success: true, data: response.data, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  async register(userData) {
    try {
      const response = await axiosInstance.post('/register', userData);
      return { success: true, data: response.data, message: 'Registration successful' };
    } catch (error) {
      // Handle validation errors from Laravel
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        return { success: false, message: firstError };
      }
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  async logout() {
    try {
      await axiosInstance.post('/logout');
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout failed' };
    }
  },

  // Profile
  async getProfile() {
    try {
      const response = await axiosInstance.get('/profile');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to fetch profile' };
    }
  },

  async updateProfile(bio, profilePicture) {
    try {
      const formData = new FormData();
      if (bio !== undefined) formData.append('bio', bio);
      if (profilePicture) formData.append('profile_photo', profilePicture);

      const response = await axiosInstance.post('/profile?_method=PUT', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  },

  // Posts
  async getExplorePosts() {
    try {
      const response = await axiosInstance.get('/feeds');
      const responseData = response.data.data;
      // Laravel pagination returns items in the 'data' field
      const posts = Array.isArray(responseData) ? responseData : (responseData.data || []);
      return { success: true, data: posts };
    } catch (error) {
      // Fallback
      try {
        const response = await axiosInstance.get('/posts');
        const responseData = response.data.data;
        const posts = Array.isArray(responseData) ? responseData : (responseData.data || []);
        return { success: true, data: posts };
      } catch (err) {
        return { success: false, message: 'Failed to fetch posts' };
      }
    }
  },

  async createPost(caption, image) {
    try {
      const formData = new FormData();
      formData.append('caption', caption || '');
      if (image) formData.append('image', image);

      const response = await axiosInstance.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to create post' };
    }
  },

  async editPost(postId, caption) {
    try {
      const response = await axiosInstance.put(`/posts/${postId}`, { caption });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to edit post' };
    }
  },

  async deletePost(postId) {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to delete post' };
    }
  },

  // Likes & Comments
  async likePost(postId) {
    try {
      await axiosInstance.post(`/posts/${postId}/likes`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to like post' };
    }
  },

  async addComment(postId, body) {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { body });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to add comment' };
    }
  },

  async editComment(commentId, body) {
    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, { body });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: 'Failed to edit comment' };
    }
  },

  async deleteComment(commentId) {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Failed to delete comment' };
    }
  }
};

// Dummy data mock API setup
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy Mock Data
let currentUser = {
  id: 1,
  name: 'Demo User',
  username: 'demouser',
  avatar: 'https://i.pravatar.cc/150?u=1',
  email: 'user@example.com',
  bio: 'Just setting up my frontend-only profile.',
  profile_picture: 'https://i.pravatar.cc/150?u=1'
};

let dummyPosts = [
  {
    id: 1,
    user_id: 2,
    caption: 'Halo semuanya! Ini adalah desain awal web sosial media kita. ✨',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    likes_count: 12,
    comments_count: 3,
    user: { id: 2, name: 'Alice Smith', username: 'alice', avatar: 'https://i.pravatar.cc/150?u=2', profile_picture: 'https://i.pravatar.cc/150?u=2' },
    comments: []
  },
  {
    id: 3,
    user_id: 1,
    caption: 'Wah, akhirnya project ENTHEPRO ini sudah mulai keliatan bentuknya! Gak sabar buat liat fitur-fitur keren selanjutnya. #ENTHEPRO #CodingLife #WebDesign',
    image: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    likes_count: 5,
    comments_count: 1,
    user: currentUser,
    comments: []
  },
  {
    id: 4,
    user_id: 1,
    caption: 'Coba tes upload foto pemandangan buat ngeramein timeline.. Cakep banget ya! 🏞️ #SelfHealing #Nature',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    likes_count: 8,
    comments_count: 2,
    user: currentUser,
    comments: []
  },
  {
    id: 2,
    user_id: 3,
    caption: 'Semangat belajar Frontend dan React! 🚀',
    image: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 45,
    comments_count: 5,
    user: { id: 3, name: 'Bob Jones', profile_picture: 'https://i.pravatar.cc/150?u=3' },
    comments: []
  }
];

export const api = {
  // Auth
  async login(email, password) {
    await delay(800);
    // Terima email dan password apa saja untuk login!
    if (email && password) {
      return { success: true, data: { data: currentUser, token: 'dummy-token-123' }, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  async register(userData) {
    await delay(800);
    return { success: true, data: { data: currentUser, token: 'dummy-token-123' }, message: 'Registration successful' };
  },

  async logout() {
    await delay(400);
    return { success: true };
  },

  // Profile
  async getProfile() {
    await delay(500);
    return { success: true, data: currentUser };
  },

  async updateProfile(bio, profilePicture) {
    await delay(800);
    currentUser.bio = bio !== undefined ? bio : currentUser.bio;
    if (profilePicture) {
      const newImageUrl = URL.createObjectURL(profilePicture);
      currentUser.avatar = newImageUrl;
      currentUser.profile_picture = newImageUrl;
    }
    return { success: true, data: currentUser };
  },

  // Posts
  async getExplorePosts() {
    await delay(600);
    return { success: true, data: dummyPosts };
  },

  async createPost(caption, image, file) {
    await delay(800);
    const newPost = {
      id: Date.now(),
      user_id: currentUser.id,
      caption: caption || '',
      image: image ? URL.createObjectURL(image) : null,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      user: currentUser,
      comments: []
    };
    dummyPosts = [newPost, ...dummyPosts];
    return { success: true, data: newPost };
  },

  async editPost(postId, caption) {
    await delay(500);
    const post = dummyPosts.find(p => p.id === postId);
    if (post) post.caption = caption;
    return { success: true, data: post };
  },

  async deletePost(postId) {
    await delay(500);
    dummyPosts = dummyPosts.filter(p => p.id !== postId);
    return { success: true };
  },

  // Likes & Comments
  async likePost(postId) {
    await delay(300);
    const post = dummyPosts.find(p => p.id === postId);
    if (post) post.likes_count += 1;
    return { success: true };
  },

  async addComment(postId, body) {
    await delay(500);
    const post = dummyPosts.find(p => p.id === postId);
    const newComment = {
      id: Date.now(),
      body: body,
      user: currentUser,
      created_at: new Date().toISOString()
    };
    if (post) {
      post.comments.unshift(newComment);
      post.comments_count += 1;
    }
    return { success: true, data: newComment };
  },

  async editComment(commentId, body) {
    await delay(400);
    return { success: true, data: { id: commentId, body } };
  },

  async deleteComment(commentId) {
    await delay(400);
    return { success: true };
  }
};

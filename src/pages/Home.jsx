import { useState } from 'react'
import { MdFavoriteBorder, MdFavorite, MdChatBubbleOutline, MdMoreHoriz } from 'react-icons/md'

export default function Home() {
  const [posts] = useState([
    { id: 1, user: 'ahmadfulan', avatar: 'https://i.pravatar.cc/150?u=1', content: 'Halo semuanya! Ini postingan pertama saya menggunakan sistem baru.', likes: 12, liked: false, time: '2 jam yang lalu' },
    { id: 2, user: 'sitiaminah', avatar: 'https://i.pravatar.cc/150?u=2', content: 'Cuaca hari ini sangat cerah ☀️ Belajar React jadi lebih semangat!', likes: 45, liked: true, time: '5 jam yang lalu' }
  ])

  return (
    <>
      <div className="create-post-card">
        <div className="d-flex align-items-center gap-3">
          <img src="https://i.pravatar.cc/150?u=myusername" alt="my-avatar" className="post-avatar" />
          <input 
            type="text" 
            className="form-control rounded-pill bg-light border-0" 
            placeholder="Apa yang Anda pikirkan?"
          />
          <button className="btn btn-primary rounded-pill px-4">Kirim</button>
        </div>
      </div>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <img src={post.avatar} alt={post.user} className="post-avatar" />
                <span>{post.user}</span>
              </div>
              <button className="post-action-btn"><MdMoreHoriz /></button>
            </div>
            <div className="post-content">
              {post.content}
            </div>
            <div className="post-actions">
              <button className="post-action-btn" style={{color: post.liked ? '#ef4444' : ''}}>
                {post.liked ? <MdFavorite /> : <MdFavoriteBorder />}
              </button>
              <button className="post-action-btn"><MdChatBubbleOutline /></button>
            </div>
            <div className="post-likes">
              {post.likes} Suka
            </div>
            <div className="post-time">
              {post.time}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

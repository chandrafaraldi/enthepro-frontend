import { useParams } from 'react-router'
import { Button } from 'react-bootstrap'
import { useState } from 'react'

export default function Profile() {
  const { username } = useParams()
  const isMe = !username || username === 'me'
  const displayUsername = username || 'myusername'
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="profile-page">
      <div className="glass-card mb-4">
        <div className="glass-card-body pt-4 d-flex flex-column align-items-center text-center">
          <img 
            src={`https://i.pravatar.cc/150?u=${displayUsername}`} 
            alt="Avatar" 
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px' }} 
          />
          <h4 className="fw-bold mb-1">@{displayUsername}</h4>
          <p className="text-muted mb-3">Software Engineer | React Enthusiast</p>
          
          <div className="d-flex gap-4 mb-4">
            <div><strong className="d-block h5 mb-0">12</strong><span className="small text-muted">Postingan</span></div>
            <div><strong className="d-block h5 mb-0">1.2K</strong><span className="small text-muted">Pengikut</span></div>
            <div><strong className="d-block h5 mb-0">150</strong><span className="small text-muted">Diikuti</span></div>
          </div>

          {!isMe && (
            <Button 
              variant={isFollowing ? 'outline-primary' : 'primary'} 
              className="px-5 w-100 mb-2"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Mengikuti' : 'Ikuti'}
            </Button>
          )}
        </div>
      </div>

      <h5 className="fw-bold mb-3">Postingan</h5>
      <div className="row g-2">
        {[1,2,3,4,5,6].map(i => (
          <div className="col-4" key={i}>
            <div style={{ aspectRatio: '1/1', background: '#e0e0e0', borderRadius: '8px', cursor: 'pointer' }} className="hover-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

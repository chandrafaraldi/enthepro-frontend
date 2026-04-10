import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import BackgroundStars from '../components/BackgroundStars'
import CreatePostFAB from '../components/CreatePostFAB'
import CreatePostModal from '../components/CreatePostModal'
import { MdSearch, MdTrendingUp, MdStars } from 'react-icons/md'

export default function MainLayout() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const handlePostSuccess = () => {
    // If we are on home page, we might want to refresh feeds
    // For now, simple success handling
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
       window.location.reload(); // Simple refresh for now to update feeds
    }
  };

  return (
    <div className="app-container">
      <BackgroundStars />
      <Sidebar />
      
      <main className="main-content">
        <div className="tab-sticky-header">
           <h5 className="m-0 fw-bold">Beranda</h5>
        </div>
        <Outlet />
      </main>

      <CreatePostFAB onClick={() => setShowCreateModal(true)} />
      
      <CreatePostModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)}
        onSuccess={handlePostSuccess}
      />
    </div>
  )
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MdEdit, 
  MdSettings, 
  MdLocationOn, 
  MdLink, 
  MdCalendarMonth,
  MdPhotoCamera,
  MdArrowBack,
  MdDelete,
  MdMoreHoriz
} from "react-icons/md";
import { Spinner, Button, Modal, Form, Dropdown } from "react-bootstrap";
import api from "../utils/api";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { username: paramUsername } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
  const [editAvatar, setEditAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Current Logged In User
  const { user: currentUser } = useAuth();
  const isMe = !paramUsername || (currentUser?.username && paramUsername === currentUser.username);

  const defaultAvatar = (seed) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const url = isMe ? "/profile" : `/users/${paramUsername}`;
      const res = await api.get(url);
      const resData = res.data.data;

      setUser(resData.user || resData);
      setPosts(resData.posts?.data || []);
      setIsFollowing(resData.is_followed || false);

      if (isMe) {
        const userData = resData.user || resData;
        setEditName(userData.name || "");
        setEditBio(userData.bio || "");
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengambil data profil.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    const res = await Swal.fire({
      title: "Hapus Postingan?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#1e1e1e",
      color: "#fff",
    });

    if (res.isConfirmed) {
      try {
        await api.delete(`/posts/${id}`);
        Swal.fire("Berhasil", "Postingan telah dihapus.", "success");
        fetchProfile(); // Refresh profile and posts
      } catch (error) {
        console.error("Delete Post Error:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus postingan.", "error");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [paramUsername]);

  const handleFollow = async () => {
    try {
      const res = await api.post(`/users/${user.id}/follows`);
      setIsFollowing(res.data.data.followed);
      // Optionally update follower count locally
      setUser(prev => ({
        ...prev,
        followers_count: res.data.data.followed ? (prev.followers_count + 1) : (prev.followers_count - 1)
      }));
    } catch (error) {
      console.error("Follow Error:", error);
      Swal.fire("Error", "Gagal melakukan aksi follow", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("bio", editBio);
    // Align with backend rename: profile_photo
    if (editAvatar) formData.append("profile_photo", editAvatar);
    if (editPassword) {
      formData.append("password", editPassword);
      formData.append("password_confirmation", editPasswordConfirm);
    }
    formData.append("_method", "PUT");

    try {
      const res = await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const updatedUser = res.data.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });
      setEditPassword("");
      setEditPasswordConfirm("");
      setShowEditModal(false);
      fetchProfile();
    } catch (error) {
      Swal.fire("Error", "Gagal memperbarui profil", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Membuka profil...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header Bar */}
      <div className="tab-sticky-header d-flex align-items-center gap-4">
         <MdArrowBack size={24} className="cursor-pointer" onClick={() => window.history.back()} />
         <div>
            <h5 className="m-0 fw-bold text-white">{user?.name || "Profil"}</h5>
            <span className="small text-muted">{user?.posts_count || 0} Postingan</span>
         </div>
      </div>

      {/* Banner & Avatar Area */}
      <div className="profile-banner">
         <div className="profile-avatar-container">
            <img 
               src={user?.profile_photo_url || defaultAvatar(user?.username)} 
               alt="Avatar" 
               className="profile-avatar-large shadow-lg"
            />
         </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end p-3">
         {isMe ? (
           <Button 
             variant="outline-primary" 
             className="rounded-pill fw-bold border-secondary text-white hover-bg-dim"
             onClick={() => setShowEditModal(true)}
           >
             Edit Profil
           </Button>
         ) : (
            <Button 
              variant={isFollowing ? "outline-primary" : "primary"} 
              className="rounded-pill fw-bold px-4"
              onClick={handleFollow}
            >
              {isFollowing ? "Mengikuti" : "Ikuti"}
            </Button>
         )}
      </div>

      {/* Profile Info */}
      <div className="profile-info-header pt-2">
         <h4 className="fw-bold text-white mb-0">{user?.name}</h4>
         <span className="text-muted">@{user?.username}</span>
         
         <p className="mt-3 text-white-50">{user?.bio || "Belum ada bio."}</p>

         <div className="d-flex flex-wrap gap-3 mt-3 text-muted small">
            <div className="d-flex align-items-center gap-1">
               <MdLocationOn /> <span>Indonesia</span>
            </div>
            <div className="d-flex align-items-center gap-1">
               <MdLink /> <a href="#" className="text-primary text-decoration-none">sysmedia.io</a>
            </div>
            <div className="d-flex align-items-center gap-1">
               <MdCalendarMonth /> <span>Bergabung {new Date(user?.created_at).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}</span>
            </div>
         </div>

         <div className="profile-stats-container">
            <div className="profile-stat-item">
               <span className="profile-stat-value">{user?.following_count || 0}</span>
               <span>Diikuti</span>
            </div>
            <div className="profile-stat-item">
               <span className="profile-stat-value">{user?.followers_count || 0}</span>
               <span>Pengikut</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
         <div className={`profile-tab-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            Postingan
         </div>
         <div className={`profile-tab-item ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>
            Media
         </div>
         <div className={`profile-tab-item ${activeTab === 'likes' ? 'active' : ''}`} onClick={() => setActiveTab('likes')}>
            Suka
         </div>
      </div>

      {/* Posts Content */}
      <div className="p-3">
         {posts.length > 0 ? (
            <div className="row g-2">
               {posts.map(p => (
                  <div key={p.id} className="col-4">
                     <div className="post-grid-item position-relative">
                        {p.image_url ? (
                           <img src={p.image_url} alt="post" />
                        ) : (
                           <div className="h-100 d-flex align-items-center justify-content-center p-3 text-center text-muted small border border-secondary border-opacity-20 rounded">
                              {p.caption?.substring(0, 30)}...
                           </div>
                        )}

                        {(isMe || currentUser?.is_admin) && (
                           <div className="position-absolute top-0 end-0 m-1">
                              <Dropdown align="end" className="sys-small-dropdown">
                                 <Dropdown.Toggle variant="dark" className="p-1 rounded-circle border-0 d-flex align-items-center justify-content-center shadow-lg" style={{ width: '24px', height: '24px', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                    <MdMoreHoriz size={16} />
                                 </Dropdown.Toggle>
                                 <Dropdown.Menu className="bg-dark border-secondary shadow-lg">
                                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2 small" onClick={() => handleDeletePost(p.id)}>
                                       <MdDelete size={14} /> Hapus
                                    </Dropdown.Item>
                                 </Dropdown.Menu>
                              </Dropdown>
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-5 text-muted">
               <p>Belum ada postingan untuk ditampilkan.</p>
            </div>
         )}
      </div>

      {/* Modal Edit Profil */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); setEditPassword(""); setEditPasswordConfirm(""); }} centered className="sys-modal">
        <Modal.Header closeButton className="border-0 bg-dark text-white">
          <Modal.Title className="fw-bold h5">Edit Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white p-4">
          <Form onSubmit={handleUpdateProfile}>
             <div className="position-relative mb-5" style={{ height: '120px' }}>
                <div className="bg-secondary rounded h-100 opacity-50"></div>
                <div className="position-absolute bottom-0 start-0 m-3 translate-middle-y">
                   <div className="position-relative">
                      <img 
                        src={avatarPreview || user?.profile_photo_url || defaultAvatar(user?.username)} 
                        className="rounded-circle border border-dark" 
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                      <label htmlFor="avatar-upload" className="position-absolute bottom-0 end-0 bg-primary p-1 rounded-circle cursor-pointer">
                         <MdPhotoCamera size={16} />
                         <input type="file" id="avatar-upload" hidden onChange={handleAvatarChange} />
                      </label>
                   </div>
                </div>
             </div>

             <Form.Group className="mb-3">
                <Form.Label className="small text-muted">Nama</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent border-secondary text-white"
                />
             </Form.Group>

             <Form.Group className="mb-4">
                <Form.Label className="small text-muted">Bio</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="bg-transparent border-secondary text-white"
                  placeholder="Ceritakan tentang diri Anda..."
                />
             </Form.Group>

             <hr className="border-secondary opacity-10 my-4" />
             <h6 className="small fw-bold text-white-50 mb-3">Keamanan</h6>

             <Form.Group className="mb-3">
                <Form.Label className="small text-muted">Password Baru (opsional)</Form.Label>
                <Form.Control 
                  type="password" 
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin ganti"
                  className="bg-transparent border-secondary text-white shadow-none"
                />
             </Form.Group>

             <Form.Group className="mb-4">
                <Form.Label className="small text-muted">Konfirmasi Password Baru</Form.Label>
                <Form.Control 
                  type="password" 
                  value={editPasswordConfirm}
                  onChange={(e) => setEditPasswordConfirm(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="bg-transparent border-secondary text-white shadow-none"
                />
             </Form.Group>

             <Button 
               type="submit" 
               variant="primary" 
               className="w-100 rounded-pill fw-bold"
               disabled={isUpdating}
             >
               {isUpdating ? <Spinner size="sm" /> : "Simpan Perubahan"}
             </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

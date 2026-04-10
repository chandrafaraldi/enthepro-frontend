import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button, InputGroup, Form, Nav, Dropdown } from "react-bootstrap";
import { MdSearch, MdPersonAdd, MdPersonRemove, MdFavoriteBorder, MdChatBubbleOutline, MdAttachFile, MdMoreHoriz, MdDelete } from "react-icons/md";
import api from "../utils/api";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function Explore() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [hashtagSearch, setHashtagSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const filtered = (res.data.data.data || []).filter(u => u.id !== currentUser?.id);
      setUsers(filtered);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsByHashtag = async (tag) => {
    if (!tag) return;
    setLoading(true);
    try {
      const cleanTag = tag.startsWith("#") ? tag.substring(1) : tag;
      const res = await api.get(`/posts?hashtag=${cleanTag}`);
      setPosts(res.data.data.data || []);
    } catch (error) {
      console.error("Fetch Posts Error:", error);
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
        fetchPostsByHashtag(hashtagSearch);
      } catch (error) {
        console.error("Delete Post Error:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus postingan.", "error");
      }
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const handleFollow = async (userId) => {
     try {
       const res = await api.post(`/users/${userId}/follows`);
       setUsers(prev => prev.map(u => 
         u.id === userId ? { ...u, is_followed: res.data.data.followed } : u
       ));
     } catch (error) {
       Swal.fire("Error", "Gagal mengikuti user", "error");
     }
  };

  const defaultAvatar = (seed) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'user'}`;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="explore-container p-4">
      <div className="tab-sticky-header mb-4">
         <h4 className="fw-bold text-white mb-0">Jelajahi SysMedia</h4>
      </div>

      <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="glass-panel p-2 mb-4 justify-content-center gap-2">
        <Nav.Item>
          <Nav.Link eventKey="users" className="rounded-pill px-4 fw-bold">Akun</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="posts" className="rounded-pill px-4 fw-bold">Postingan (#)</Nav.Link>
        </Nav.Item>
      </Nav>
      
      {activeTab === "users" ? (
        <>
          <InputGroup className="mb-4 shadow-sm border-0 border-radius-lg overflow-hidden">
            <InputGroup.Text className="bg-dark border-secondary text-muted">
              <MdSearch size={22} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Cari user berdasarkan nama atau username..."
              className="bg-transparent border-secondary text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <div className="row g-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={user.id} className="col-md-6 col-lg-4">
                     <div className="glass-panel p-4 h-100 d-flex flex-column align-items-center text-center">
                        <Link to={`/user/${user.username}`}>
                          <img 
                            src={user.profile_photo_url || defaultAvatar(user.username)} 
                            alt={user.name}
                            className="post-avatar mb-3 hover-scale border border-2 border-primary border-opacity-25"
                            style={{ width: '80px', height: '80px' }}
                          />
                        </Link>
                        <h6 className="fw-bold text-white mb-0">{user.name}</h6>
                        <p className="text-muted small mb-3">@{user.username}</p>
                        
                        <p className="small text-white-50 flex-grow-1 text-truncate-2 px-2 mb-3">
                           {user.bio || "Member setia SysMedia."}
                        </p>

                        <Button 
                          variant={user.is_followed ? "outline-primary" : "primary"}
                          className="w-100 rounded-pill py-2 fw-bold"
                          onClick={() => handleFollow(user.id)}
                        >
                          {user.is_followed ? "Mengikuti" : "Ikuti"}
                        </Button>
                     </div>
                  </div>
                ))
              ) : (
                 <div className="text-center py-5 opacity-50 w-100"><p>User tidak ditemukan.</p></div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <Form onSubmit={(e) => { e.preventDefault(); fetchPostsByHashtag(hashtagSearch); }}>
            <InputGroup className="mb-4 shadow-sm border-0 border-radius-lg overflow-hidden">
              <InputGroup.Text className="bg-dark border-secondary text-muted">
                <span className="fw-bold">#</span>
              </InputGroup.Text>
              <Form.Control
                placeholder="Cari kata kunci hashtag (misal: SysMedia)..."
                className="bg-transparent border-secondary text-white"
                value={hashtagSearch}
                onChange={(e) => setHashtagSearch(e.target.value)}
              />
              <Button type="submit" variant="primary">Cari</Button>
            </InputGroup>
          </Form>

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map(post => (
                  <div key={post.id} className="post-card glass-panel shadow-sm border-0 mb-4 p-4 animate-slide-up">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                         <img 
                           src={post.user?.profile_photo_url || defaultAvatar(post.user?.username)} 
                           className="rounded-circle border border-primary border-opacity-25"
                           width="45" height="45" alt="avatar" 
                         />
                         <div>
                            <div className="fw-bold text-white">{post.user?.name}</div>
                            <div className="text-muted small">@{post.user?.username}</div>
                         </div>
                      </div>

                      {(post.user_id === currentUser?.id || currentUser?.is_admin) && (
                        <Dropdown align="end" className="sys-dropdown">
                          <Dropdown.Toggle variant="link" className="text-muted p-0 border-0 no-caret">
                            <MdMoreHoriz size={24} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="bg-dark border-secondary shadow-lg">
                            <Dropdown.Item className="text-danger d-flex align-items-center gap-2" onClick={() => handleDeletePost(post.id)}>
                              <MdDelete size={18} /> Hapus Postingan
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <p className="text-white-50 mb-3">{post.caption}</p>
                    {post.image_url && (
                        <div className="post-media rounded-4 overflow-hidden mb-3 border border-secondary border-opacity-25">
                            <img src={post.image_url} alt="post" className="w-100 shadow-sm" />
                        </div>
                    )}
                    <div className="d-flex gap-4 text-muted small border-top border-secondary border-opacity-10 pt-3">
                       <div className="d-flex align-items-center gap-1 cursor-pointer hover-text-primary">
                          <MdFavoriteBorder size={18} /> {post.likes_count || 0}
                       </div>
                       <div className="d-flex align-items-center gap-1 cursor-pointer hover-text-accent">
                          <MdChatBubbleOutline size={18} /> {post.comments_count || 0}
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="text-center py-5 opacity-50 w-100">
                    <p>{hashtagSearch ? "Tidak ada postingan dengan hashtag ini." : "Masukkan hashtag untuk mencari postingan."}</p>
                 </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

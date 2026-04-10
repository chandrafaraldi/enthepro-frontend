import { useState, useEffect } from "react";
import { 
  MdSupervisedUserCircle, 
  MdPostAdd, 
  MdComment, 
  MdDelete,
  MdBarChart,
  MdManageAccounts,
  MdBlock,
  MdCheckCircle
} from "react-icons/md";
import { Spinner, Table, Button, Card, Row, Col } from "react-bootstrap";
import api from "../utils/api";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.data);
    } catch (error) {
      console.error("Fetch Stats Error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data.data || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get("/admin/posts");
      setPosts(res.data.data.data || []);
    } catch (error) {
      console.error("Fetch Posts Error:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchPosts()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleToggleBlock = async (user) => {
    const action = user.is_blocked ? "Buka Blokir" : "Blokir";
    const result = await Swal.fire({
      title: `${action} Pengguna?`,
      text: `User ini ${user.is_blocked ? 'akan bisa login kembali' : 'tidak akan bisa login'}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: user.is_blocked ? "#10b981" : "#d33",
      confirmButtonText: `Ya, ${action}!`,
      background: "#1e1e1e",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/admin/users/${user.id}/toggle-block`);
        Swal.fire("Berhasil", `Status user diperbarui`, "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "Gagal memproses blokir", "error");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Hapus Pengguna?",
      text: "Seluruh data user ini akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${userId}`);
        Swal.fire("Berhasil", "Pengguna dihapus", "success");
        fetchUsers();
        fetchStats();
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus", "error");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: "Hapus Postingan?",
      text: "Moderasi: Postingan ini akan dihapus secara paksa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Hapus",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/posts/${postId}`);
        Swal.fire("Berhasil", "Postingan dihapus", "success");
        fetchPosts();
        fetchStats();
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Membuka portal administrator...</p>
      </div>
    );
  }

  return (
    <div className="admin-container p-4">
      <div className="d-flex align-items-center gap-3 mb-4">
         <MdManageAccounts size={32} className="text-warning" />
         <h3 className="fw-bold text-white mb-0">Admin Dashboard</h3>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={4}>
          <div className="glass-panel p-4 text-center">
            <MdSupervisedUserCircle size={40} className="text-primary mb-2" />
            <h2 className="fw-bold text-white mb-0">{stats?.total_users || 0}</h2>
            <span className="text-muted small text-uppercase fw-bold">Total Pengguna</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="glass-panel p-4 text-center">
            <MdPostAdd size={40} className="text-accent mb-2" style={{ color: 'var(--sys-accent)' }} />
            <h2 className="fw-bold text-white mb-0">{stats?.total_posts || 0}</h2>
            <span className="text-muted small text-uppercase fw-bold">Total Postingan</span>
          </div>
        </Col>
        <Col md={4}>
          <div className="glass-panel p-4 text-center">
            <MdComment size={40} className="text-success mb-2" />
            <h2 className="fw-bold text-white mb-0">{stats?.total_comments || 0}</h2>
            <span className="text-muted small text-uppercase fw-bold">Total Komentar</span>
          </div>
        </Col>
      </Row>

      {/* Management Tabs */}
      <div className="profile-tabs mb-4">
         <div className={`profile-tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Ikhtisar
         </div>
         <div className={`profile-tab-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Manajemen User
         </div>
         <div className={`profile-tab-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            Manajemen Post
         </div>
      </div>

      {/* Tab Content */}
      <div className="glass-panel p-0 overflow-hidden">
        {activeTab === 'overview' && (
           <div className="p-4">
              <h5 className="fw-bold text-white mb-4"><MdBarChart className="me-2 text-primary" /> Statistik Sistem</h5>
              <div className="row g-4">
                 <Col md={6}>
                    <div className="bg-dark bg-opacity-25 p-4 rounded-4 border border-secondary border-opacity-20">
                       <h6 className="text-muted small text-uppercase">Distribusi Peran</h6>
                       <hr className="opacity-10" />
                       <div className="d-flex justify-content-between mb-2">
                          <span>Administrator</span>
                          <span className="fw-bold text-warning">{stats?.role_distribution.admins}</span>
                       </div>
                       <div className="d-flex justify-content-between">
                          <span>Member Biasa</span>
                          <span className="fw-bold text-primary">{stats?.role_distribution.members}</span>
                       </div>
                    </div>
                 </Col>
                 <Col md={6}>
                    <div className="bg-dark bg-opacity-25 p-4 rounded-4 border border-secondary border-opacity-20">
                       <h6 className="text-muted small text-uppercase">Pengguna Baru</h6>
                       <hr className="opacity-10" />
                       {stats?.recent_users.map(u => (
                          <div key={u.id} className="d-flex align-items-center gap-2 mb-2">
                             <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                             <span className="small text-white-50">{u.name} (@{u.username})</span>
                          </div>
                       ))}
                    </div>
                 </Col>
              </div>
           </div>
        )}

        {activeTab === 'users' && (
           <Table responsive className="sys-table m-0">
              <thead>
                <tr>
                   <th>Nama / Username</th>
                   <th>Email</th>
                   <th>Status</th>
                   <th>Bergabung</th>
                   <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                   <tr key={u.id}>
                      <td>
                         <div className="fw-bold text-white">{u.name}</div>
                         <div className="small text-muted">@{u.username}</div>
                      </td>
                      <td className="text-white-50">{u.email}</td>
                       <td>
                          <div className="d-flex flex-column gap-1">
                             <span className={`badge ${u.is_admin ? 'bg-warning text-dark' : 'bg-secondary text-white-50'}`}>
                                {u.is_admin ? 'Admin' : 'User'}
                             </span>
                             {u.is_blocked && (
                                <span className="badge bg-danger text-white">Terblokir</span>
                             )}
                          </div>
                       </td>
                      <td className="text-white-50">{new Date(u.created_at).toLocaleDateString()}</td>
                       <td>
                          <div className="d-flex gap-2">
                             <Button 
                               variant={u.is_blocked ? "outline-success" : "outline-warning"} 
                               size="sm" 
                               onClick={() => handleToggleBlock(u)}
                               disabled={u.is_admin}
                               title={u.is_blocked ? "Buka Blokir" : "Blokir"}
                             >
                               {u.is_blocked ? <MdCheckCircle size={16} /> : <MdBlock size={16} />}
                             </Button>
                             <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u.id)} disabled={u.is_admin}>
                                <MdDelete size={16} />
                             </Button>
                          </div>
                       </td>
                   </tr>
                ))}
              </tbody>
           </Table>
        )}

        {activeTab === 'posts' && (
           <Table responsive className="sys-table m-0">
              <thead>
                <tr>
                   <th>Pembuat</th>
                   <th>Konten</th>
                   <th>Interaksi</th>
                   <th>Tanggal</th>
                   <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                   <tr key={p.id}>
                      <td>
                         <div className="fw-bold text-white">{p.user?.name}</div>
                         <div className="small text-muted">@{p.user?.username}</div>
                      </td>
                      <td className="text-white-50">
                         <div className="text-truncate" style={{ maxWidth: '200px' }}>{p.caption}</div>
                      </td>
                      <td className="text-white-50">
                          {p.likes_count} Like · {p.comments_count} Komen
                      </td>
                      <td className="text-white-50">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                         <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(p.id)}>
                            <MdDelete size={16} />
                         </Button>
                      </td>
                   </tr>
                ))}
              </tbody>
           </Table>
        )}
      </div>
    </div>
  );
}

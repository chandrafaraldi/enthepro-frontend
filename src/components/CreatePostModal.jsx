import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { MdClose, MdImage, MdAttachFile } from 'react-icons/md';
import api from '../utils/api';
import Swal from 'sweetalert2';

export default function CreatePostModal({ show, onHide, onSuccess }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > MAX_FILE_SIZE) {
        Swal.fire('Data terlalu besar', 'Maksimal ukuran gambar adalah 5MB', 'error');
        return;
      }
      setImage(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const clearAttachments = () => {
    setImage(null);
    setFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !image && !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('caption', caption);
    if (image) formData.append('image', image);
    if (file) formData.append('file', file);

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Postingan berhasil dikirim',
        timer: 1500,
        showConfirmButton: false,
      });
      setCaption('');
      clearAttachments();
      onSuccess();
      onHide();
    } catch (error) {
      Swal.fire('Error', 'Gagal mengirim postingan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="premium-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Buat Postingan Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Control
            as="textarea"
            rows={4}
            className="premium-input mb-3"
            placeholder="Apa yang ada di benak Anda?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={loading}
          />

          {(imagePreview || file) && (
            <div className="mt-3 position-relative post-media shadow-lg mb-3">
              <Button
                variant="dark"
                size="sm"
                className="position-absolute top-0 end-0 m-2 rounded-circle border-0 bubble-btn"
                onClick={clearAttachments}
              >
                <MdClose size={18} />
              </Button>
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="w-100 rounded-4" />
              )}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-white border-opacity-10">
            <div className="d-flex gap-3">
              <input type="file" id="modalImageInput" accept="image/*" hidden onChange={handleImageChange} />
              <button type="button" className="btn btn-link p-2 text-primary rounded-3 hover-bg-primary bg-opacity-10" onClick={() => document.getElementById('modalImageInput').click()}>
                <MdImage size={24} />
              </button>
            </div>

            <Button
              type="submit"
              className="btn-sys-primary px-4 py-2"
              disabled={loading || (!caption.trim() && !image && !file)}
            >
              {loading ? <Spinner size="sm" /> : "Posting"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

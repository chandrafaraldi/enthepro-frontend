import React from 'react';
import { MdAdd } from 'react-icons/md';

export default function CreatePostFAB({ onClick }) {
  return (
    <button 
      className="create-post-fab"
      onClick={onClick}
      aria-label="Buat Postingan"
    >
      <div className="fab-glow"></div>
      <MdAdd size={32} />
    </button>
  );
}

// BioEditModal.js

import React, { useState } from 'react';
import './BioEditModal.css'; // Import CSS file for styling

function BioEditModal({ onClose, onUpdate, initialBio }) {
  const [bio, setBio] = useState(initialBio);

  const handleUpdate = () => {
    onUpdate(bio);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <textarea
          className="bio-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
        />
        <div className="button-container">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="update-button" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default BioEditModal;

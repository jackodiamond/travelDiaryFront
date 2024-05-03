import React, { useState } from 'react';

function ImageUploader({ onImageUpload }) {
  const [image, setImage] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        onImageUpload(reader.result); // Callback to parent component with the uploaded image data
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
    </div>
  );
}

export default ImageUploader;

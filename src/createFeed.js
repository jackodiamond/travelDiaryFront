import React, { useState,useContext } from 'react';
import axios from 'axios';
import TopNav from './TopNav';
import { EditorState, convertToRaw } from 'draft-js';
import EditorWithImageUpload from './EditorWithImageUpload'; // Import the EditorWithImageUpload component
import './CreateFeed.css'; // Import CSS file for styling
import AuthenticatedWrapper from './AuthenticatedWrapper';
import UserContext from './UserContext';
import config from './Config';

function CreateFeed() {
  const { username } = useContext(UserContext);

  const [imageData, setImageData] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: EditorState.createEmpty(), // Initialize content as an empty EditorState
    image: '', // State to store uploaded image data
  });

  const handleEditorChange = (editorState) => {
    setFormData({
      ...formData,
      content: editorState,
    });
  };
 
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = () => {
        setFormData({
          ...formData,
          image: reader.result, // Set uploaded image data to state
        });
        console.log("reader : ",reader.result)
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFeed = {
        title: formData.title,
        author: username, // Assuming 'author' is fixed for this case
        content: formData.content.getCurrentContent().getPlainText('\u0001'), 
        imageContent: imageData // Pass uploaded image data
      };
      console.log("new feed ",newFeed)
      // Call post API
      await axios.post(config.apiUrl+'feed/createFeed', newFeed);
      // Clear form data after successful submission
      setFormData({
        title: '',
        content: EditorState.createEmpty(),
        image: '',
      });
      alert('Feed created successfully!'); 
    } catch (error) {
      console.error('Error creating feed:', error);
      alert('Error creating feed. Please try again.');
    }
  };

  return (
    <AuthenticatedWrapper >
    <>
      <TopNav showImageIcon={false} />
      <div>
        <div className="create-feed-form-container">
          <h2 className="create-feed-heading">Create New Feed</h2>
          <form onSubmit={handleSubmit} className="create-feed-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Title"
                style={{ textAlign: 'center' }}
              />
            </div>
            {/* Render EditorWithImageUpload component */}
            <EditorWithImageUpload
              editorState={formData.content}
              onEditorStateChange={handleEditorChange}
              handleImageUpload={handleImageUpload} 
              formData={formData}
            />
            <button type="submit" className="create-feed-button">Create Feed</button>
          </form>
        </div>
      </div>
    </>
    </AuthenticatedWrapper>
  );
}

export default CreateFeed;

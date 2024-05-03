import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function EditorWithImageUpload({ editorState, onEditorStateChange, handleImageUpload, formData }) {
  return (
    <div className="form-group editor-image-container" style={{ display: 'flex' }}>
      <div className="editor-container" style={{ width: '60%', height: '600px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px',overflow:'hidden' }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder="Write something..."
          toolbar={{
            options: ['inline', 'textAlign'], // Customize toolbar options
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
          }}
        />
      </div>
      <div className="image-container" style={{ marginLeft:'30px' ,width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {formData.image ? (
          <img src={formData.image} alt="Uploaded" className="placeholder-image" />
        ) : (<></>) 
      }
          <>
            <label htmlFor="image-upload" className="placeholder-image-label">
            <img src="/icon/edit-image-icon.png" alt="Upload Image" style={{marginLeft:'30px' , width: '80px', height: '60px',justifyContent: 'center',display: 'flex', alignItems: 'center' }} />
            </label>
            {/* Hidden file input */}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </>
        
      </div>
    </div>
  );
}

export default EditorWithImageUpload;

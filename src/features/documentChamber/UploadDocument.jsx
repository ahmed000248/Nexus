import React, { useState } from 'react';

// UploadDocument lets users upload PDF, DOC, or DOCX files.
// It collects a title + the file, then calls onUpload with a new document object.
// All storage is in React state — no backend needed.
function UploadDocument({ onUpload, onCancel }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [error, setError] = useState('');

  // Validate and store the chosen file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow PDF, DOC, DOCX
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, DOC, and DOCX files are allowed.');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);

    // Auto-fill the title from the file name (without extension)
    if (!docTitle) {
      const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
      setDocTitle(nameWithoutExt);
    }
  };

  // Build the document object and pass it up to DocumentPage
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!docTitle.trim()) {
      setError('Please enter a document title.');
      return;
    }

    // Get the file extension
    const ext = selectedFile.name.split('.').pop().toLowerCase();

    // Convert bytes → MB for display
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1);

    // Create a temporary URL so we can preview PDF files in an iframe
    const fileUrl = URL.createObjectURL(selectedFile);

    // Build the new document object
    const newDocument = {
      id: Date.now(),          // timestamp used as a simple unique id
      title: docTitle.trim(),
      uploadedBy: 'You',
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: ext,
      fileSize: sizeInMB + ' MB',
      status: 'Draft',          // all newly uploaded docs start as Draft
      signed: false,
      signatureImage: null,
      fileUrl: fileUrl
    };

    onUpload(newDocument);
  };

  return (
    <div className="dc-upload-form">
      <h3 className="dc-upload-title">Upload Document</h3>
      <p className="dc-upload-subtitle">Supported formats: PDF, DOC, DOCX</p>

      <form onSubmit={handleSubmit}>

        {/* Document title */}
        <div className="dc-form-group">
          <label className="dc-form-label">Document Title</label>
          <input
            type="text"
            className="dc-form-input"
            placeholder="e.g. Investment Agreement"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
        </div>

        {/* File picker */}
        <div className="dc-form-group">
          <label className="dc-form-label">Select File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="dc-file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Show the selected file name and size */}
        {selectedFile && (
          <div className="dc-file-info">
            <span>📄 {selectedFile.name}</span>
            <span className="dc-file-size">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </span>
          </div>
        )}

        {/* Validation error */}
        {error && <p className="dc-error">{error}</p>}

        {/* Form buttons */}
        <div className="dc-upload-actions">
          <button
            type="button"
            className="dc-btn dc-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="dc-btn dc-btn-upload">
            Upload Document
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadDocument;

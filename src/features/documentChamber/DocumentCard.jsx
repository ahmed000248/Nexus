import React from 'react';

// DocumentCard shows the information and action buttons for one document.
// Props: doc (document object), onDelete, onSign, onPreview, onStatusChange
function DocumentCard({ doc, onDelete, onSign, onPreview, onStatusChange }) {

  // Return a CSS class name for the status badge color
  const getStatusClass = (status) => {
    if (status === 'Signed') return 'dc-badge-signed';
    if (status === 'In Review') return 'dc-badge-review';
    return 'dc-badge-draft';
  };

  // Return an emoji icon based on the file extension
  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return '📄';
    if (fileType === 'doc' || fileType === 'docx') return '📝';
    return '📁';
  };

  return (
    <div className="dc-card">

      {/* Card header: icon, title/meta info, status badge */}
      <div className="dc-card-header">
        <div className="dc-file-icon">{getFileIcon(doc.fileType)}</div>

        <div className="dc-card-info">
          <h4 className="dc-card-title">{doc.title}</h4>
          <p className="dc-card-meta">
            {doc.fileType.toUpperCase()} &bull; {doc.fileSize} &bull; Uploaded by {doc.uploadedBy}
          </p>
          <p className="dc-card-date">Date: {doc.uploadDate}</p>
        </div>

        <span className={`dc-status-badge ${getStatusClass(doc.status)}`}>
          {doc.status}
        </span>
      </div>

      {/* Show saved signature image when the document is signed */}
      {doc.signed && doc.signatureImage && (
        <div className="dc-signature-preview">
          <p className="dc-signature-label">✓ Signed</p>
          <img
            src={doc.signatureImage}
            alt="Saved signature"
            className="dc-signature-img"
          />
        </div>
      )}

      {/* Action buttons row */}
      <div className="dc-card-actions">

        {/* Preview button — only shows when the file has a local URL (just-uploaded PDF) */}
        {doc.fileUrl && doc.fileType === 'pdf' && (
          <button
            className="dc-btn dc-btn-preview"
            onClick={() => onPreview(doc)}
          >
            Preview
          </button>
        )}

        {/* Status dropdown — lets the user change the document status */}
        <select
          className="dc-status-select"
          value={doc.status}
          onChange={(e) => onStatusChange(doc.id, e.target.value)}
        >
          <option value="Draft">Draft</option>
          <option value="In Review">In Review</option>
          <option value="Signed">Signed</option>
        </select>

        {/* Sign button — opens the signature modal (only for unsigned docs) */}
        {!doc.signed && (
          <button
            className="dc-btn dc-btn-sign"
            onClick={() => onSign(doc)}
          >
            Sign
          </button>
        )}

        {/* Delete button */}
        <button
          className="dc-btn dc-btn-delete"
          onClick={() => onDelete(doc.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;

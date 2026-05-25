import React, { useState } from 'react';
import DocumentCard from './DocumentCard';
import UploadDocument from './UploadDocument';
import SignatureModal from './SignatureModal';
import dummyDocuments from './dummyDocuments';
import './documentChamber.css';

// DocumentPage is the main Document Processing Chamber page (Milestone 4).
// Users can upload, preview, sign, and manage investment contracts/agreements.
// All data lives in local React state — no backend needed for this demo.
function DocumentPage() {
  // Initialize with dummy data to show a realistic-looking dashboard
  const [documents, setDocuments] = useState(dummyDocuments);

  // Controls visibility of the upload form
  const [showUpload, setShowUpload] = useState(false);

  // Holds the document currently being signed (opens SignatureModal)
  const [signDoc, setSignDoc] = useState(null);

  // Holds the document currently being previewed (opens PDF iframe modal)
  const [previewDoc, setPreviewDoc] = useState(null);

  // Active filter tab: 'All' | 'Draft' | 'In Review' | 'Signed'
  const [filterStatus, setFilterStatus] = useState('All');

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Add the newly uploaded file to the top of the documents list
  const handleUpload = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
    setShowUpload(false);
  };

  // Remove a document after asking for confirmation
  const handleDelete = (docId) => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (confirmed) {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  // Save the drawn signature and mark the document as Signed
  const handleSignSave = (docId, signatureImage) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, signed: true, status: 'Signed', signatureImage }
          : doc
      )
    );
    setSignDoc(null);
  };

  // Change the status of a document via the dropdown on the card
  const handleStatusChange = (docId, newStatus) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    );
  };

  // ── Derived values ──────────────────────────────────────────────────────────

  // Filtered list shown below the filter tabs
  const filteredDocuments = documents.filter(doc =>
    filterStatus === 'All' ? true : doc.status === filterStatus
  );

  // Counts for the summary stat cards
  const totalDocs   = documents.length;
  const draftCount  = documents.filter(d => d.status === 'Draft').length;
  const reviewCount = documents.filter(d => d.status === 'In Review').length;
  const signedCount = documents.filter(d => d.status === 'Signed').length;

  return (
    <div className="dc-page">

      {/* ── Page header ── */}
      <div className="dc-page-header">
        <div>
          <h1 className="dc-page-title">Document Chamber</h1>
          <p className="dc-page-subtitle">
            Manage your investment contracts and agreements
          </p>
        </div>
        <button
          className="dc-btn-upload-new"
          onClick={() => setShowUpload(true)}
        >
          + Upload Document
        </button>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="dc-stats-row">
        <div className="dc-stat-card">
          <span className="dc-stat-number">{totalDocs}</span>
          <span className="dc-stat-label">Total Documents</span>
        </div>
        <div className="dc-stat-card dc-stat-draft">
          <span className="dc-stat-number">{draftCount}</span>
          <span className="dc-stat-label">Draft</span>
        </div>
        <div className="dc-stat-card dc-stat-review">
          <span className="dc-stat-number">{reviewCount}</span>
          <span className="dc-stat-label">In Review</span>
        </div>
        <div className="dc-stat-card dc-stat-signed">
          <span className="dc-stat-number">{signedCount}</span>
          <span className="dc-stat-label">Signed</span>
        </div>
      </div>

      {/* ── Upload form (shown when the header button is clicked) ── */}
      {showUpload && (
        <UploadDocument
          onUpload={handleUpload}
          onCancel={() => setShowUpload(false)}
        />
      )}

      {/* ── Filter tabs ── */}
      <div className="dc-filter-tabs">
        {['All', 'Draft', 'In Review', 'Signed'].map(status => (
          <button
            key={status}
            className={`dc-filter-tab ${filterStatus === status ? 'dc-filter-active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ── Documents list ── */}
      <div className="dc-documents-list">
        {filteredDocuments.length === 0 ? (
          <div className="dc-empty-state">
            <p className="dc-empty-icon">📂</p>
            <p className="dc-empty-text">No documents found</p>
            <p className="dc-empty-hint">
              {filterStatus === 'All'
                ? 'Upload your first document to get started.'
                : `No documents with status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              onSign={(d) => setSignDoc(d)}
              onPreview={(d) => setPreviewDoc(d)}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* ── PDF Preview Modal (shown when Preview button is clicked) ── */}
      {previewDoc && (
        <div
          className="dc-preview-overlay"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="dc-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dc-preview-header">
              <h3>{previewDoc.title}</h3>
              <button onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            <iframe
              src={previewDoc.fileUrl}
              title={previewDoc.title}
              className="dc-preview-iframe"
            />
          </div>
        </div>
      )}

      {/* ── Signature Modal (shown when Sign button is clicked) ── */}
      {signDoc && (
        <SignatureModal
          document={signDoc}
          onSave={handleSignSave}
          onClose={() => setSignDoc(null)}
        />
      )}

    </div>
  );
}

export default DocumentPage;

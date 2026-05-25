import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// SignatureModal shows a drawing canvas so the user can sign a document.
// Uses react-signature-canvas for the actual drawing functionality.
// The signature is saved as a base64 PNG image string and stored in React state.
function SignatureModal({ document, onSave, onClose }) {
  // Ref to the SignatureCanvas instance so we can call .clear() and .toDataURL()
  const sigCanvasRef = useRef(null);

  // Clear everything the user has drawn
  const handleClear = () => {
    sigCanvasRef.current.clear();
  };

  // Save the drawn signature and mark the document as signed
  const handleSave = () => {
    if (sigCanvasRef.current.isEmpty()) {
      alert('Please draw your signature before saving.');
      return;
    }

    // Export the signature as a base64-encoded PNG
    const signatureImage = sigCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL('image/png');

    onSave(document.id, signatureImage);
  };

  return (
    <div className="sig-overlay">
      <div className="sig-modal">

        {/* Modal header */}
        <div className="sig-modal-header">
          <h3>Sign Document</h3>
          <button className="sig-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Document name and agreement notice */}
        <div className="sig-doc-info">
          <p className="sig-doc-name">📄 {document.title}</p>
          <p className="sig-doc-note">
            By signing, you confirm your agreement with the terms of this document.
          </p>
        </div>

        {/* Signature drawing area */}
        <div className="sig-canvas-area">
          <p className="sig-canvas-label">Draw your signature below:</p>

          <div className="sig-canvas-wrapper">
            {/* The canvas width/height here gives a good default;
                the CSS makes it stretch to fill the wrapper on small screens */}
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="#1e3a8a"
              canvasProps={{
                className: 'sig-canvas',
                width: 460,
                height: 148
              }}
            />
          </div>

          <p className="sig-canvas-hint">
            Use your mouse or finger to draw your signature
          </p>
        </div>

        {/* Footer buttons */}
        <div className="sig-modal-footer">
          <button className="dc-btn dc-btn-cancel" onClick={handleClear}>
            Clear
          </button>
          <button className="dc-btn dc-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="dc-btn dc-btn-sign" onClick={handleSave}>
            Save Signature
          </button>
        </div>

      </div>
    </div>
  );
}

export default SignatureModal;

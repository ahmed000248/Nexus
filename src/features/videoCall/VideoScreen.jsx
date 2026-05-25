import React from 'react';
import './videoCall.css';

// VideoScreen shows the main video area during a call.
// It renders the "remote" user section (big area) and the local camera preview
// (small box in the corner). Since there is no real backend, the remote section
// shows a friendly placeholder based on the current call status.
function VideoScreen({ localVideoRef, callStatus, isVideoOff, remoteUser }) {
  return (
    <div className="vc-screen">

      {/* ---------- Remote video (large center area) ---------- */}
      <div className="vc-remote">

        {/* Idle — before the call starts */}
        {callStatus === 'idle' && (
          <div className="vc-idle-state">
            <span className="vc-idle-icon">📹</span>
            <p className="vc-idle-title">Ready to Connect</p>
            <p className="vc-idle-subtitle">Click "Start Call" to join the meeting</p>
          </div>
        )}

        {/* Connecting — camera/mic access granted, waiting to connect */}
        {callStatus === 'connecting' && (
          <div className="vc-connecting-state">
            <div className="vc-spinner"></div>
            <p className="vc-connecting-text">
              Connecting to {remoteUser || 'participant'}...
            </p>
          </div>
        )}

        {/* In Call — show the remote user avatar (no real peer stream needed for this demo) */}
        {callStatus === 'in-call' && (
          <div className="vc-remote-connected">
            <div className="vc-remote-avatar">
              {remoteUser ? remoteUser.charAt(0).toUpperCase() : 'U'}
            </div>
            <p className="vc-remote-name">{remoteUser || 'Participant'}</p>
            <p className="vc-remote-status">● Connected</p>
          </div>
        )}

        {/* Ended — after the user clicks End Call */}
        {callStatus === 'ended' && (
          <div className="vc-ended-state">
            <span className="vc-ended-icon">📵</span>
            <p className="vc-ended-title">Call Ended</p>
            <p className="vc-ended-subtitle">Click "Start Call" to begin a new call</p>
          </div>
        )}
      </div>

      {/* ---------- Local video preview (small box in bottom-right) ---------- */}
      {/* Only visible while connecting or in a call */}
      {(callStatus === 'in-call' || callStatus === 'connecting') && (
        <div className="vc-local-preview">
          {isVideoOff ? (
            <div className="vc-camera-off">Camera Off</div>
          ) : (
            /* The ref is attached here — VideoCallPage sets srcObject on this element */
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="vc-local-video"
            />
          )}
          <p className="vc-local-label">You</p>
        </div>
      )}

    </div>
  );
}

export default VideoScreen;

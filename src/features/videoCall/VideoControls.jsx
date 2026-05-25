import React from 'react';

// VideoControls renders the action buttons at the bottom of the call area.
// The visible buttons change depending on whether a call is active or not.
function VideoControls({
  callStatus,
  isMuted,
  isVideoOff,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onScreenShare
}) {
  return (
    <div className="vc-controls">

      {/* Show "Start Call" when idle or after a call has ended */}
      {(callStatus === 'idle' || callStatus === 'ended') && (
        <button className="vc-btn-start" onClick={onStartCall}>
          <span>📹</span> Start Call
        </button>
      )}

      {/* Show the in-call controls while connecting or in a call */}
      {(callStatus === 'connecting' || callStatus === 'in-call') && (
        <>
          {/* Mute / Unmute microphone */}
          <button
            className={`vc-btn-control ${isMuted ? 'vc-btn-active' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            <span>{isMuted ? '🔇' : '🎙️'}</span>
            <span className="vc-btn-label">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Turn camera on / off */}
          <button
            className={`vc-btn-control ${isVideoOff ? 'vc-btn-active' : ''}`}
            onClick={onToggleVideo}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            <span>{isVideoOff ? '📷' : '📸'}</span>
            <span className="vc-btn-label">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
          </button>

          {/* Share screen using getDisplayMedia */}
          <button
            className="vc-btn-control"
            onClick={onScreenShare}
            title="Share your screen"
          >
            <span>🖥️</span>
            <span className="vc-btn-label">Share Screen</span>
          </button>

          {/* End the call */}
          <button
            className="vc-btn-end"
            onClick={onEndCall}
            title="End call"
          >
            <span>📵</span>
            <span className="vc-btn-label">End Call</span>
          </button>
        </>
      )}

    </div>
  );
}

export default VideoControls;

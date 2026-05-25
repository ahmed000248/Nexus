import React, { useState, useRef, useEffect } from 'react';
import VideoScreen from './VideoScreen';
import VideoControls from './VideoControls';
import { recentCalls, scheduledCalls } from './dummyCallData';
import './videoCall.css';

// VideoCallPage is the main page for the Video Calling feature (Milestone 3).
// It manages call state, asks the browser for camera + mic access via WebRTC APIs,
// and displays a sidebar with scheduled and recent calls.
function VideoCallPage() {
  // callStatus drives what the UI shows:
  //   idle      → before any call starts
  //   connecting → getUserMedia succeeded, simulating connection
  //   in-call   → connected, controls are visible
  //   ended     → user clicked End Call
  const [callStatus, setCallStatus] = useState('idle');

  // Track mute and video-off separately so each button can toggle independently
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Which contact is being called (name shown in the remote avatar)
  const [selectedContact, setSelectedContact] = useState(null);

  // Ref for the <video> element so we can attach the media stream
  const localVideoRef = useRef(null);

  // Ref for the MediaStream so we can stop all tracks when the call ends
  const streamRef = useRef(null);

  // Stop any active stream when the component is removed (navigation away)
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ── Start Call ─────────────────────────────────────────────────────────────
  // Requests camera and microphone access from the browser.
  // On success: attaches the stream to the local video element.
  // On failure: shows an alert asking the user to check browser permissions.
  const startCall = async () => {
    setCallStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;

      // Attach the webcam stream to the <video> element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate a short connection delay (no real signaling server needed)
      setTimeout(() => {
        setCallStatus('in-call');
      }, 1800);

    } catch (error) {
      console.error('Could not access camera/mic:', error);
      alert(
        'Could not access your camera or microphone.\n\n' +
        'Please check that you have allowed camera and microphone permissions in your browser.'
      );
      setCallStatus('idle');
    }
  };

  // ── End Call ───────────────────────────────────────────────────────────────
  // Stops all media tracks and resets state.
  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCallStatus('ended');
    setIsMuted(false);
    setIsVideoOff(false);
  };

  // ── Toggle Mute ────────────────────────────────────────────────────────────
  // Enables or disables the audio track on the current stream.
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(prev => !prev);
      }
    }
  };

  // ── Toggle Video ───────────────────────────────────────────────────────────
  // Enables or disables the video track on the current stream.
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(prev => !prev);
      }
    }
  };

  // ── Screen Share ───────────────────────────────────────────────────────────
  // Uses getDisplayMedia to capture the screen and show it in the local preview.
  // When the user stops sharing, the preview switches back to the webcam.
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // When the user stops screen sharing, switch back to the webcam
      screenStream.getVideoTracks()[0].onended = () => {
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
      };
    } catch (error) {
      // User cancelled the screen share picker — that's fine
      console.log('Screen share cancelled.');
    }
  };

  // ── Call a specific contact ────────────────────────────────────────────────
  const callContact = (contact) => {
    setSelectedContact(contact.name);
    startCall();
  };

  return (
    <div className="vc-page">

      {/* Page heading */}
      <div className="vc-page-header">
        <h1 className="vc-page-title">Video Calls</h1>
        <p className="vc-page-subtitle">
          Connect face-to-face with investors and entrepreneurs
        </p>
      </div>

      <div className="vc-main-layout">

        {/* ── Left column: the actual video call interface ── */}
        <div className="vc-call-section">

          {/* Status bar */}
          <div className="vc-status-bar">
            <span className={`vc-status-badge vc-status-${callStatus}`}>
              {callStatus === 'idle'       && '⚪ Ready'}
              {callStatus === 'connecting' && '🟡 Connecting...'}
              {callStatus === 'in-call'    && '🟢 In Call'}
              {callStatus === 'ended'      && '🔴 Call Ended'}
            </span>
            {callStatus === 'in-call' && selectedContact && (
              <span className="vc-current-call-with">with {selectedContact}</span>
            )}
          </div>

          {/* Video screen (remote + local preview) */}
          <VideoScreen
            localVideoRef={localVideoRef}
            callStatus={callStatus}
            isVideoOff={isVideoOff}
            remoteUser={selectedContact || 'Investor'}
          />

          {/* Control buttons */}
          <VideoControls
            callStatus={callStatus}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            onStartCall={startCall}
            onEndCall={endCall}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onScreenShare={shareScreen}
          />
        </div>

        {/* ── Right column: scheduled calls + recent history ── */}
        <div className="vc-sidebar">

          {/* Scheduled upcoming calls */}
          <div className="vc-panel">
            <h3 className="vc-panel-title">Scheduled Calls</h3>
            <div className="vc-contact-list">
              {scheduledCalls.map(call => (
                <div key={call.id} className="vc-contact-item">
                  <div className="vc-contact-avatar">{call.avatar}</div>

                  <div className="vc-contact-info">
                    <p className="vc-contact-name">{call.name}</p>
                    <p className="vc-contact-detail">{call.topic}</p>
                    <p className="vc-contact-time">
                      {call.date} at {call.time}
                    </p>
                  </div>

                  <button
                    className="vc-call-btn"
                    onClick={() => callContact(call)}
                    disabled={callStatus === 'connecting' || callStatus === 'in-call'}
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent call history */}
          <div className="vc-panel">
            <h3 className="vc-panel-title">Recent Calls</h3>
            <div className="vc-contact-list">
              {recentCalls.map(call => (
                <div key={call.id} className="vc-recent-item">
                  <div className="vc-contact-avatar">{call.avatar}</div>

                  <div className="vc-contact-info">
                    <p className="vc-contact-name">{call.name}</p>
                    <p className="vc-contact-detail">{call.role}</p>
                  </div>

                  <div className="vc-recent-meta">
                    <span className={`vc-call-status vc-status-${call.status}`}>
                      {call.status === 'completed' ? '✓ Done' : '✗ Missed'}
                    </span>
                    <span className="vc-call-duration">{call.duration}</span>
                    <span className="vc-call-date">{call.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VideoCallPage;

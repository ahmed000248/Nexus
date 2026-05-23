import React from 'react';
import './meetings.css';

// Converts "2026-06-05" to "Thu, Jun 5, 2026"
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Converts 24h "14:00" to "2:00 PM"
function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// MeetingRequest shows the list of PENDING meeting requests.
// Entrepreneurs use this section to accept or decline invites from investors.
//
// Props:
//   meetings  - full list of meetings (this component filters for pending ones)
//   onAccept  - called with meeting.id when Accept is clicked
//   onDecline - called with meeting.id when Decline is clicked

function MeetingRequest({ meetings, onAccept, onDecline }) {
  // Show only meetings that haven't been responded to yet
  const pendingMeetings = meetings.filter((m) => m.status === 'pending');

  if (pendingMeetings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          {/* Calendar check icon */}
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <polyline points="9 16 11 18 15 14" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No pending meeting requests.</p>
        <p className="text-gray-400 text-xs mt-1">
          Incoming requests from investors will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingMeetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          {/* Meeting details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Pending dot indicator */}
              <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></span>
              <p className="font-semibold text-gray-800 text-sm truncate">{meeting.title}</p>
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(meeting.date)} &bull; {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}
            </p>
            {meeting.participant && (
              <p className="text-xs text-blue-600 mt-1 font-medium">
                Requested by: {meeting.participant}
              </p>
            )}
            {meeting.notes && (
              <p className="text-xs text-gray-400 mt-1 italic line-clamp-1">
                "{meeting.notes}"
              </p>
            )}
          </div>

          {/* Accept and Decline buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onAccept(meeting.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
            >
              {/* Checkmark icon */}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Accept
            </button>
            <button
              onClick={() => onDecline(meeting.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              {/* X icon */}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingRequest;

import React from 'react';
import './meetings.css';

// Color/label config for each status
const statusConfig = {
  pending: {
    label: 'Pending',
    badgeClass: 'badge-pending',
  },
  accepted: {
    label: 'Accepted',
    badgeClass: 'badge-accepted',
  },
  declined: {
    label: 'Declined',
    badgeClass: 'badge-declined',
  },
};

// Converts 24h time like "14:00" to "2:00 PM"
function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Converts "2026-06-05" to "June 5, 2026"
function formatDate(dateStr) {
  if (!dateStr) return '';
  // Add T00:00:00 to avoid timezone offset issues
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calendar SVG icon — used in the card
function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="#2563eb"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// MeetingCard shows a single meeting in a compact card format.
// Used on the calendar page and on the dashboard's "Upcoming Meetings" section.
//
// Props:
//   meeting       - the meeting object
//   onViewCalendar - optional callback when user clicks "View" link
function MeetingCard({ meeting, onViewCalendar }) {
  // Fall back to 'pending' if status is unrecognized
  const status = statusConfig[meeting.status] || statusConfig.pending;

  return (
    <div className="meeting-card-hover bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">

      {/* Calendar icon on the left */}
      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <CalendarIcon />
      </div>

      {/* Meeting details in the middle */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
          {meeting.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{formatDate(meeting.date)}</p>
        <p className="text-xs text-gray-400">
          {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}
        </p>
        {meeting.participant && (
          <p className="text-xs text-blue-600 mt-1 font-medium">
            with {meeting.participant}
          </p>
        )}
        {meeting.notes && (
          <p className="text-xs text-gray-400 mt-1 italic truncate">
            {meeting.notes}
          </p>
        )}
      </div>

      {/* Status badge and optional "View" link on the right */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.badgeClass}`}
        >
          {status.label}
        </span>

        {/* Show "View" button only when a callback is provided */}
        {onViewCalendar && (
          <button
            onClick={onViewCalendar}
            className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            View Calendar
          </button>
        )}
      </div>

    </div>
  );
}

export default MeetingCard;

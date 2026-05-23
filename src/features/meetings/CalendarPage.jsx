import React, { useState, useEffect } from 'react';

// FullCalendar and its plugins
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';     // month view
import timeGridPlugin from '@fullcalendar/timegrid';   // week/day view
import interactionPlugin from '@fullcalendar/interaction'; // dateClick, eventClick

// Our custom components
import MeetingModal from './MeetingModal';
import MeetingRequest from './MeetingRequest';
import MeetingCard from './MeetingCard';

// Meeting data helpers
import {
  meetings as allMeetings,
  addMeeting,
  updateMeeting,
  deleteMeeting,
  updateMeetingStatus,
} from './dummyMeetings';

// Auth context to get the logged-in user
import { useAuth } from '../../context/AuthContext';

import './meetings.css';

// Returns background color for a calendar event based on meeting status
function getEventColor(status) {
  if (status === 'accepted') return '#22c55e'; // green
  if (status === 'declined') return '#ef4444'; // red
  return '#f59e0b';                            // amber for pending
}

// CalendarPage is the main feature page for meeting scheduling.
// It shows a full FullCalendar grid, allows adding/editing/deleting meetings,
// and shows a pending requests list below for accept/decline actions.
function CalendarPage() {
  const { user } = useAuth();

  // Keep a local copy of meetings in state so the calendar re-renders
  // when meetings change (add, edit, delete, status change).
  const [meetings, setMeetings] = useState([...allMeetings]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');  // date clicked on calendar
  const [selectedMeeting, setSelectedMeeting] = useState(null); // null = add mode

  // Refresh meetings from the module-level array
  const refreshMeetings = () => {
    setMeetings([...allMeetings]);
  };

  // Load meetings on first render
  useEffect(() => {
    refreshMeetings();
  }, []);

  // --- Convert meetings to FullCalendar event format ---
  const calendarEvents = meetings.map((m) => ({
    id: String(m.id),
    title: m.title,
    start: `${m.date}T${m.startTime}:00`,
    end: `${m.date}T${m.endTime}:00`,
    backgroundColor: getEventColor(m.status),
    borderColor: getEventColor(m.status),
    textColor: '#ffffff',
    // We store the full meeting object in extendedProps so we can access it on click
    extendedProps: { meeting: m },
  }));

  // --- Calendar Event Handlers ---

  // User clicks an empty date → open modal in "add" mode
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedMeeting(null);
    setShowModal(true);
  };

  // User clicks an existing event → open modal in "edit" mode
  const handleEventClick = (info) => {
    const meetingData = info.event.extendedProps.meeting;
    setSelectedMeeting(meetingData);
    setSelectedDate(meetingData.date);
    setShowModal(true);
  };

  // --- Modal Handlers ---

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMeeting(null);
    setSelectedDate('');
  };

  // Called when user submits the form (add or edit)
  const handleSave = (formData) => {
    if (selectedMeeting) {
      // Edit mode: update the existing meeting
      updateMeeting(selectedMeeting.id, {
        ...formData,
        status: selectedMeeting.status,      // keep existing status
        sentBy: selectedMeeting.sentBy,
        sentTo: selectedMeeting.sentTo,
        participantId: selectedMeeting.participantId,
      });
    } else {
      // Add mode: create a new meeting request
      addMeeting({
        ...formData,
        status: 'pending',
        sentBy: user?.id || 'i1', // current user is the one sending the request
        sentTo: '',                // simplified: no specific recipient for demo
        participantId: '',
      });
    }
    refreshMeetings();
    handleCloseModal();
  };

  // Called when user confirms deletion in the modal
  const handleDelete = (id) => {
    deleteMeeting(id);
    refreshMeetings();
    handleCloseModal();
  };

  // --- Meeting Request Handlers ---

  // Entrepreneur accepts a meeting request
  const handleAccept = (id) => {
    updateMeetingStatus(id, 'accepted');
    refreshMeetings();
  };

  // Entrepreneur declines a meeting request
  const handleDecline = (id) => {
    updateMeetingStatus(id, 'declined');
    refreshMeetings();
  };

  // How many meetings are still pending
  const pendingCount = meetings.filter((m) => m.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Schedule and manage your investor meetings
          </p>
        </div>
        {/* Quick "Schedule Meeting" button — opens modal with today's date */}
        <button
          onClick={() => {
            setSelectedMeeting(null);
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          {/* Plus icon */}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Schedule Meeting
        </button>
      </div>

      {/* ── Color Legend ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
        <span className="font-semibold text-gray-700">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
          Pending
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          Accepted
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          Declined
        </div>
        <span className="text-gray-400 text-xs">
          · Click any date to add a meeting · Click an event to edit
        </span>
      </div>

      {/* ── FullCalendar ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
          }}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          selectable={true}
          dayMaxEvents={3}
        />
      </div>

      {/* ── Pending Meeting Requests ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Pending Meeting Requests
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Accept or decline incoming meeting invites
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="p-5">
          <MeetingRequest
            meetings={meetings}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </div>
      </div>

      {/* ── All Meetings List ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">All Meetings</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Full list of scheduled, accepted, and declined meetings
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {meetings.length} total
          </span>
        </div>
        <div className="p-5">
          {meetings.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">
              No meetings yet. Click any date on the calendar to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {/* Sort by date, newest first */}
              {[...meetings]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Meeting Modal ────────────────────────────────────────── */}
      <MeetingModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
        selectedDate={selectedDate}
        meeting={selectedMeeting}
      />

    </div>
  );
}

export default CalendarPage;

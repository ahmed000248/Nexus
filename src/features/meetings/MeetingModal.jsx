import React, { useState, useEffect } from 'react';
import './meetings.css';

// MeetingModal handles two modes:
//   - "Add" mode: when user clicks an empty date on the calendar
//   - "Edit" mode: when user clicks an existing event on the calendar
//
// Props:
//   isOpen       - controls if the modal is visible
//   onClose      - called when user closes the modal
//   onSave       - called with the form data when user clicks Save
//   onDelete     - called with meeting.id when user confirms deletion
//   selectedDate - date string pre-filled from calendar click (e.g. "2026-06-10")
//   meeting      - existing meeting object (only in edit mode, null in add mode)

function MeetingModal({ isOpen, onClose, onSave, onDelete, selectedDate, meeting }) {
  // Local form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [participant, setParticipant] = useState('');
  const [notes, setNotes] = useState('');

  // True when editing, false when adding
  const isEditMode = !!meeting;

  // Populate form when modal opens or when a different meeting is selected
  useEffect(() => {
    if (meeting) {
      // Edit mode — fill in existing values
      setTitle(meeting.title || '');
      setDate(meeting.date || '');
      setStartTime(meeting.startTime || '09:00');
      setEndTime(meeting.endTime || '10:00');
      setParticipant(meeting.participant || '');
      setNotes(meeting.notes || '');
    } else {
      // Add mode — reset all fields, pre-fill date from calendar click
      setTitle('');
      setDate(selectedDate || '');
      setStartTime('09:00');
      setEndTime('10:00');
      setParticipant('');
      setNotes('');
    }
  }, [meeting, selectedDate, isOpen]);

  // Don't render anything when modal is closed
  if (!isOpen) return null;

  // Validate and call onSave
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a meeting title.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!startTime || !endTime) {
      alert('Please set both start and end times.');
      return;
    }
    if (startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    onSave({
      title: title.trim(),
      date,
      startTime,
      endTime,
      participant: participant.trim(),
      notes: notes.trim(),
    });
  };

  // Ask for confirmation before deleting
  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this meeting? This cannot be undone.'
    );
    if (confirmed) {
      onDelete(meeting.id);
    }
  };

  return (
    <div className="meeting-modal-overlay" onClick={onClose}>
      {/* Clicking inside the modal should not close it */}
      <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="meeting-modal-header">
          <h3>{isEditMode ? 'Edit Meeting' : 'Schedule a Meeting'}</h3>
          <button className="meeting-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="meeting-modal-body">

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Meeting Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Investor Call – TechWave AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Start Time and End Time — displayed side by side */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                className="form-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="time"
                className="form-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Participant Name */}
          <div className="form-group">
            <label className="form-label">Participant Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Michael Chen"
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Add agenda or notes for this meeting..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

        </div>

        {/* Footer with action buttons */}
        <div className="meeting-modal-footer">

          {/* Delete button — only shown in edit mode */}
          {isEditMode && (
            <button
              onClick={handleDelete}
              style={{ marginRight: 'auto' }}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {/* Save / Schedule */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {isEditMode ? 'Save Changes' : 'Schedule Meeting'}
          </button>

        </div>
      </div>
    </div>
  );
}

export default MeetingModal;

// This file acts as a fake database for meetings.
// In a real app, this data would come from an API.
// We follow the same pattern used in src/data/collaborationRequests.ts

export const meetings = [
  {
    id: 1,
    title: "Investor Meeting - TechWave AI",
    date: "2026-06-05",
    startTime: "10:00",
    endTime: "11:00",
    participant: "Michael Chen",
    participantId: "i1",
    sentBy: "i1",       // investor who sent the meeting request
    sentTo: "e1",       // entrepreneur who received it
    notes: "Discussing Series A funding round details",
    status: "accepted", // pending | accepted | declined
  },
  {
    id: 2,
    title: "Pitch Review - GreenLife",
    date: "2026-06-10",
    startTime: "14:00",
    endTime: "15:00",
    participant: "Emma Wilson",
    participantId: "i2",
    sentBy: "i2",
    sentTo: "e2",
    notes: "Review business model and financials",
    status: "pending",
  },
  {
    id: 3,
    title: "Due Diligence Call - HealthPulse",
    date: "2026-06-15",
    startTime: "11:00",
    endTime: "12:00",
    participant: "David Kim",
    participantId: "i3",
    sentBy: "i3",
    sentTo: "e3",
    notes: "Technical deep dive into the product",
    status: "pending",
  },
  {
    id: 4,
    title: "Partnership Discussion",
    date: "2026-06-20",
    startTime: "09:00",
    endTime: "10:00",
    participant: "Michael Chen",
    participantId: "i1",
    sentBy: "i1",
    sentTo: "e1",
    notes: "Exploring strategic partnership opportunities",
    status: "declined",
  },
  {
    id: 5,
    title: "Demo Day Preparation",
    date: "2026-06-25",
    startTime: "13:00",
    endTime: "14:30",
    participant: "Emma Wilson",
    participantId: "i2",
    sentBy: "i2",
    sentTo: "e4",
    notes: "Preparing presentation for demo day",
    status: "accepted",
  },
];

// Get all meetings where the user is either the sender or the receiver
export const getMeetingsForUser = (userId) => {
  return meetings.filter((m) => m.sentBy === userId || m.sentTo === userId);
};

// Get only accepted meetings for a user (used on the dashboard)
export const getConfirmedMeetings = (userId) => {
  return getMeetingsForUser(userId).filter((m) => m.status === "accepted");
};

// Get pending requests received by an entrepreneur
export const getPendingRequestsForEntrepreneur = (userId) => {
  return meetings.filter((m) => m.sentTo === userId && m.status === "pending");
};

// Add a new meeting to the list
export const addMeeting = (meetingData) => {
  const newMeeting = {
    ...meetingData,
    id: Date.now(), // use timestamp as a simple unique ID
  };
  meetings.push(newMeeting);
  return newMeeting;
};

// Update an existing meeting by ID
export const updateMeeting = (id, updates) => {
  const index = meetings.findIndex((m) => m.id === id);
  if (index === -1) return null;
  meetings[index] = { ...meetings[index], ...updates };
  return meetings[index];
};

// Remove a meeting from the list
export const deleteMeeting = (id) => {
  const index = meetings.findIndex((m) => m.id === id);
  if (index !== -1) {
    meetings.splice(index, 1);
    return true;
  }
  return false;
};

// Change the status of a meeting (pending → accepted or declined)
export const updateMeetingStatus = (id, status) => {
  return updateMeeting(id, { status });
};

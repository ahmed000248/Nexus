import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Calendar, Video, FileCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MeetingCard from '../../features/meetings/MeetingCard';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { meetings } from '../../features/meetings/dummyMeetings';

// Week 2 dummy data for the dashboard quick-access cards
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { recentCalls, scheduledCalls } from '../../features/videoCall/dummyCallData';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dummyDocuments from '../../features/documentChamber/dummyDocuments';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Store upcoming meetings in state so the list is always fresh on mount
  const [upcomingMeetings, setUpcomingMeetings] = useState<Array<{
    id: number; title: string; date: string; startTime: string; endTime: string;
    participant: string; sentBy: string; status: string; notes: string;
  }>>([]);

  useEffect(() => {
    if (user) {
      // Re-read meetings from the module array every time this component mounts.
      // This ensures we always show the latest data after navigating back from CalendarPage.
      const filtered = (meetings as Array<{
        id: number; title: string; date: string; startTime: string; endTime: string;
        participant: string; sentBy: string; status: string; notes: string;
      }>)
        .filter(m => m.sentBy === user.id && m.status === 'accepted')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setUpcomingMeetings(filtered);
    }
  }, [user]);

  if (!user) return null;
  
  // Get collaboration requests sent by this investor
  const sentRequests = getRequestsFromInvestor(user.id);
  const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);
  
  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });
  
  // Get unique industries for filter
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  
  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected => 
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        
        <Link to="/entrepreneurs">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            View All Startups
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* ── Upcoming Meetings (Week 1 Feature) ─────────────────────── */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
          <button
            onClick={() => navigate('/calendar')}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View Calendar →
          </button>
        </CardHeader>
        <CardBody>
          {upcomingMeetings.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting: {
                id: number; title: string; date: string; startTime: string;
                endTime: string; participant: string; status: string; notes: string;
              }) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onViewCalendar={() => navigate('/calendar')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <Calendar size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No confirmed meetings yet.</p>
              <button
                onClick={() => navigate('/calendar')}
                className="mt-2 text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Schedule a Meeting →
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Week 2 Quick Access Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Video Calls quick-access card */}
        <Card>
          <CardBody>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Video size={20} className="text-blue-700" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Video Calls</h3>
                <p className="text-sm text-gray-500">Connect with entrepreneurs face-to-face</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{recentCalls.length}</p>
                <p className="text-xs text-gray-500 mt-1">Recent Calls</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{scheduledCalls.length}</p>
                <p className="text-xs text-gray-500 mt-1">Scheduled</p>
              </div>
            </div>
            <Link to="/video-calls">
              <Button variant="outline" fullWidth>Open Video Calls →</Button>
            </Link>
          </CardBody>
        </Card>

        {/* Document Chamber quick-access card */}
        <Card>
          <CardBody>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <FileCheck size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Document Chamber</h3>
                <p className="text-sm text-gray-500">Investment contracts &amp; agreements</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-yellow-600">
                  {dummyDocuments.filter((d: { status: string }) => d.status === 'In Review').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">In Review</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-600">
                  {dummyDocuments.filter((d: { status: string }) => d.status === 'Signed').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Signed</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-gray-400">
                  {dummyDocuments.filter((d: { status: string }) => d.status === 'Draft').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Drafts</p>
              </div>
            </div>
            <Link to="/document-chamber">
              <Button variant="outline" fullWidth>Open Documents →</Button>
            </Link>
          </CardBody>
        </Card>

      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>
          
          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
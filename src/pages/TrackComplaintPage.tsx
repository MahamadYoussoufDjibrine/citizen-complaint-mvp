import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { useComplaintStore } from '../store/complaintStore';
import { formatDate, getDepartmentName, formatPhoneNumber } from '../utils/helpers';
import { Search } from 'lucide-react';

const TrackComplaintPage: React.FC = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(complaintId || '');
  const [error, setError] = useState('');
  
  const { getComplaintById } = useComplaintStore();
  const complaint = complaintId ? getComplaintById(complaintId) : null;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }
    
    navigate(`/track/${searchId}`);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
    setError('');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Complaint</h1>
        <p className="text-gray-600">
          Enter your complaint ID to check the current status and updates
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <Input
              id="complaintId"
              placeholder="Enter Complaint ID (e.g., CMP-123456-789)"
              value={searchId}
              onChange={handleInputChange}
              error={error}
              fullWidth
              className="flex-1"
            />
            <Button 
              type="submit" 
              leftIcon={<Search className="h-4 w-4" />}
            >
              Track Complaint
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {complaintId && !complaint && (
        <Alert variant="error" title="Complaint Not Found">
          No complaint found with ID: {complaintId}. Please check the ID and try again.
        </Alert>
      )}
      
      {complaint && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Complaint Details</CardTitle>
              <p className="text-sm text-gray-500 mt-1">ID: {complaint.id}</p>
            </div>
            <StatusBadge status={complaint.status} className="mt-2 md:mt-0" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{complaint.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{getDepartmentName(complaint.department)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium">{formatDate(complaint.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(complaint.updatedAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
              <p className="whitespace-pre-line">{complaint.description}</p>
              
              {complaint.location && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{complaint.location}</p>
                </div>
              )}
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{complaint.citizenName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{complaint.email}</p>
                </div>
                {complaint.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{formatPhoneNumber(complaint.phone)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {complaint.responseMessage && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Response</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700 whitespace-pre-line">{complaint.responseMessage}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Need to submit a new complaint?</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/submit')}
        >
          Submit New Complaint
        </Button>
      </div>
    </div>
  );
};

export default TrackComplaintPage;
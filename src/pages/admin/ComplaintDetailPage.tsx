import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import StatusBadge from '../../components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { useComplaintStore } from '../../store/complaintStore';
import { useAuthStore } from '../../store/authStore';
import { ComplaintStatus } from '../../types';
import { formatDate, getDepartmentName, formatPhoneNumber } from '../../utils/helpers';
import { ArrowLeft, Send, Clock, CheckCircle, AlertOctagon, XCircle } from 'lucide-react';

const ComplaintDetailPage: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();
  const { getComplaintById, updateComplaintStatus, addResponseToComplaint, isLoading } = useComplaintStore();
  const { user } = useAuthStore();
  
  const complaint = complaintId ? getComplaintById(complaintId) : null;
  
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus | ''>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  if (!complaint) {
    return (
      <div className="py-8">
        <Alert variant="error" title="Complaint Not Found">
          <p>No complaint found with ID: {complaintId}</p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/complaints')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Complaints
            </Button>
          </div>
        </Alert>
      </div>
    );
  }
  
  const handleResponseSubmit = async () => {
    if (!response.trim()) {
      setError('Response message cannot be empty');
      return;
    }
    
    try {
      await addResponseToComplaint(complaint.id, response);
      setSuccessMessage('Response added successfully');
      setResponse('');
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to add response. Please try again.');
    }
  };
  
  const handleStatusChange = async () => {
    if (!newStatus) {
      setError('Please select a status');
      return;
    }
    
    try {
      await updateComplaintStatus(complaint.id, newStatus, response);
      setSuccessMessage(`Status updated to ${newStatus}`);
      setNewStatus('');
      setResponse('');
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };
  
  const statusOptions = [
    { value: '', label: 'Select new status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];
  
  // Filter out current status from options
  const filteredStatusOptions = statusOptions.filter(
    option => option.value === '' || option.value !== complaint.status
  );
  
  const getStatusIcon = (size = 6) => {
    switch (complaint.status) {
      case 'pending':
        return <Clock className={`h-${size} w-${size} text-amber-500`} />;
      case 'in-progress':
        return <AlertOctagon className={`h-${size} w-${size} text-blue-500`} />;
      case 'resolved':
        return <CheckCircle className={`h-${size} w-${size} text-green-500`} />;
      case 'rejected':
        return <XCircle className={`h-${size} w-${size} text-red-500`} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Complaint Details</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/complaints')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to List
        </Button>
      </div>
      
      {successMessage && (
        <Alert variant="success" dismissible onDismiss={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>{complaint.subject}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">ID: {complaint.id}</p>
              </div>
              <StatusBadge status={complaint.status} className="mt-2 sm:mt-0" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{complaint.description}</p>
              </div>
              
              {complaint.location && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{complaint.location}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Response History</h3>
                {complaint.responseMessage ? (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-blue-700 whitespace-pre-line">{complaint.responseMessage}</p>
                    <p className="text-sm text-blue-500 mt-2 italic">
                      Last updated: {formatDate(complaint.updatedAt)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No responses yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Update Complaint</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="error" className="mb-4" dismissible onDismiss={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              <div className="space-y-4">
                <TextArea
                  label="Response Message"
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  placeholder="Enter your response to the citizen..."
                  fullWidth
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Button
                      variant="primary"
                      onClick={handleResponseSubmit}
                      isLoading={isLoading}
                      disabled={!response.trim()}
                      fullWidth
                      leftIcon={<Send className="h-4 w-4" />}
                    >
                      Send Response
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Select
                      options={filteredStatusOptions}
                      value={newStatus}
                      onChange={(value) => setNewStatus(value as ComplaintStatus)}
                      className="flex-1"
                    />
                    <Button
                      variant="success"
                      onClick={handleStatusChange}
                      isLoading={isLoading}
                      disabled={!newStatus}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-full">
                {getStatusIcon()}
              </div>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Current Status</dt>
                  <dd className="font-medium">{complaint.status.replace('-', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Submitted On</dt>
                  <dd>{formatDate(complaint.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Updated</dt>
                  <dd>{formatDate(complaint.updatedAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Department</dt>
                  <dd>{getDepartmentName(complaint.department)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Citizen Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium">{complaint.citizenName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="break-all">{complaint.email}</dd>
                </div>
                {complaint.phone && (
                  <div>
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd>{formatPhoneNumber(complaint.phone)}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Send className="h-4 w-4" />}
                onClick={() => window.open(`mailto:${complaint.email}`)}
              >
                Email Citizen
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
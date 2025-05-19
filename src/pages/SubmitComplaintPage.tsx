import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useComplaintStore } from '../store/complaintStore';
import { Department } from '../types';
import { getDepartmentName } from '../utils/helpers';

const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const { addComplaint, isLoading } = useComplaintStore();
  
  const [formData, setFormData] = useState({
    citizenName: '',
    email: '',
    phone: '',
    department: 'other' as Department,
    subject: '',
    description: '',
    location: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [complainId, setComplainId] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.citizenName.trim()) {
      newErrors.citizenName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 30) {
      newErrors.description = 'Description should be at least 30 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const id = await addComplaint(formData);
      setComplainId(id);
      setSuccessMessage('Complaint submitted successfully!');
      
      // Reset form
      setFormData({
        citizenName: '',
        email: '',
        phone: '',
        department: 'other',
        subject: '',
        description: '',
        location: '',
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors({
        submit: 'Failed to submit complaint. Please try again.',
      });
    }
  };
  
  const handleViewStatus = () => {
    if (complainId) {
      navigate(`/track/${complainId}`);
    }
  };
  
  const departmentOptions = [
    { value: 'roads', label: 'Roads & Infrastructure' },
    { value: 'water', label: 'Water Supply' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'sanitation', label: 'Sanitation & Waste' },
    { value: 'public-safety', label: 'Public Safety' },
    { value: 'other', label: 'General Enquiries' },
  ];
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600">
          Fill out this form with details about your issue. All fields marked with * are required.
        </p>
      </div>
      
      {successMessage && (
        <div className="mb-6">
          <Alert 
            variant="success" 
            title="Success!" 
            dismissible 
            onDismiss={() => setSuccessMessage(null)}
          >
            <div className="flex flex-col">
              <p>{successMessage}</p>
              <p className="font-semibold mt-2">Your complaint ID: {complainId}</p>
              <p className="text-sm mt-1">Please save this ID to track your complaint status.</p>
              <Button 
                variant="success" 
                className="mt-3" 
                size="sm"
                onClick={handleViewStatus}
              >
                Track Your Complaint
              </Button>
            </div>
          </Alert>
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-6">
          <Alert 
            variant="error" 
            dismissible 
            onDismiss={() => setErrors((prev) => ({ ...prev, submit: '' }))}
          >
            {errors.submit}
          </Alert>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                id="citizenName"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.citizenName}
                fullWidth
              />
              
              <Input
                label="Email Address *"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                error={errors.email}
                fullWidth
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number (optional)"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
                error={errors.phone}
                fullWidth
              />
              
              <Select
                label="Department *"
                id="department"
                name="department"
                value={formData.department}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    department: value as Department,
                  }));
                }}
                options={departmentOptions}
                fullWidth
              />
            </div>
            
            <Input
              label="Subject *"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your complaint"
              error={errors.subject}
              fullWidth
            />
            
            <TextArea
              label="Detailed Description *"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Please provide specific details about your complaint..."
              error={errors.description}
              helperText="Minimum 30 characters. Include relevant details such as when and where the issue occurred."
              fullWidth
            />
            
            <Input
              label="Location (optional)"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Street address or area where the issue is located"
              fullWidth
            />
            
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                fullWidth
              >
                Submit Complaint
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">What happens next?</h3>
        <p className="text-blue-700 mb-2">
          After you submit your complaint:
        </p>
        <ol className="list-decimal list-inside text-blue-700 space-y-1">
          <li>Your complaint will be routed to the {getDepartmentName(formData.department)} department</li>
          <li>You'll receive a confirmation email with your complaint ID</li>
          <li>A staff member will review your complaint within 48 hours</li>
          <li>You can track your complaint status using the provided ID</li>
        </ol>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;
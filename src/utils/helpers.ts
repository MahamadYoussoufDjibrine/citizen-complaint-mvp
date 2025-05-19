import { Department } from '../types';

/**
 * Generate a unique ticket ID with a prefix
 */
export const generateTicketId = (): string => {
  const prefix = 'CMP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Get a readable department name from the department code
 */
export const getDepartmentName = (department: Department): string => {
  const departmentNames: Record<Department, string> = {
    'roads': 'Roads & Infrastructure',
    'water': 'Water Supply',
    'electricity': 'Electricity',
    'sanitation': 'Sanitation & Waste',
    'public-safety': 'Public Safety',
    'other': 'General Enquiries'
  };
  
  return departmentNames[department] || department;
};

/**
 * Get a readable status name from status code
 */
export const getStatusName = (status: string): string => {
  const statusNames: Record<string, string> = {
    'pending': 'Pending Review',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'rejected': 'Rejected'
  };
  
  return statusNames[status] || status;
};

/**
 * Format date to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

/**
 * Simulate sending an email (for demo purposes)
 */
export const sendEmailNotification = (
  to: string, 
  subject: string, 
  message: string
): Promise<boolean> => {
  // In a real app, this would integrate with an email API
  console.log(`Email notification sent to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};
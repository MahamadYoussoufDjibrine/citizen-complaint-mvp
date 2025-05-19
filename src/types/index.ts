export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

export type Department = 'roads' | 'water' | 'electricity' | 'sanitation' | 'public-safety' | 'other';

export interface Complaint {
  id: string;
  citizenName: string;
  email: string;
  phone?: string;
  department: Department;
  subject: string;
  description: string;
  location?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  responseMessage?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would not be stored directly
  department: Department;
  role: 'admin' | 'staff';
  name: string;
}
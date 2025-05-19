import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Complaint, ComplaintStatus, Department } from '../types';
import { generateTicketId, sendEmailNotification } from '../utils/helpers';

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;

  // Actions
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getComplaintById: (id: string) => Complaint | undefined;
  updateComplaintStatus: (id: string, status: ComplaintStatus, responseMessage?: string) => Promise<boolean>;
  assignComplaint: (id: string, staffId: string) => Promise<boolean>;
  addResponseToComplaint: (id: string, responseMessage: string) => Promise<boolean>;
  getComplaintsByDepartment: (department: Department) => Complaint[];
  getComplaintsByStatus: (status: ComplaintStatus) => Complaint[];
}

export const useComplaintStore = create<ComplaintState>()(
  persist(
    (set, get) => ({
      complaints: [],
      isLoading: false,

      addComplaint: async (complaintData) => {
        set({ isLoading: true });
        
        const newComplaint: Complaint = {
          id: generateTicketId(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...complaintData,
        };

        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({ 
          complaints: [...state.complaints, newComplaint],
          isLoading: false
        }));

        // Send confirmation email
        await sendEmailNotification(
          complaintData.email,
          `Your complaint has been registered [${newComplaint.id}]`,
          `Dear ${complaintData.citizenName},\n\nYour complaint regarding "${complaintData.subject}" has been successfully registered with ID: ${newComplaint.id}.\n\nYou can check the status of your complaint using this ID.\n\nThank you for your feedback.`
        );

        return newComplaint.id;
      },

      getComplaintById: (id) => {
        return get().complaints.find(complaint => complaint.id === id);
      },

      updateComplaintStatus: async (id, status, responseMessage) => {
        set({ isLoading: true });
        
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let success = false;
        
        set(state => {
          const complaint = state.complaints.find(c => c.id === id);
          
          if (!complaint) {
            return { isLoading: false, complaints: state.complaints };
          }
          
          const updatedComplaints = state.complaints.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  status, 
                  updatedAt: new Date().toISOString(),
                  responseMessage: responseMessage || c.responseMessage
                } 
              : c
          );
          
          success = true;
          return { complaints: updatedComplaints, isLoading: false };
        });

        if (success) {
          const complaint = get().getComplaintById(id);
          if (complaint) {
            // Send status update email
            await sendEmailNotification(
              complaint.email,
              `Status update for your complaint [${complaint.id}]`,
              `Dear ${complaint.citizenName},\n\nThe status of your complaint regarding "${complaint.subject}" (ID: ${complaint.id}) has been updated to: ${status.toUpperCase()}.\n\n${responseMessage ? `Staff response: ${responseMessage}\n\n` : ''}Thank you for your patience.`
            );
          }
        }

        return success;
      },

      assignComplaint: async (id, staffId) => {
        set({ isLoading: true });
        
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let success = false;
        
        set(state => {
          const complaint = state.complaints.find(c => c.id === id);
          
          if (!complaint) {
            return { isLoading: false, complaints: state.complaints };
          }
          
          const updatedComplaints = state.complaints.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  assignedTo: staffId,
                  updatedAt: new Date().toISOString()
                } 
              : c
          );
          
          success = true;
          return { complaints: updatedComplaints, isLoading: false };
        });

        return success;
      },

      addResponseToComplaint: async (id, responseMessage) => {
        set({ isLoading: true });
        
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let success = false;
        
        set(state => {
          const complaint = state.complaints.find(c => c.id === id);
          
          if (!complaint) {
            return { isLoading: false, complaints: state.complaints };
          }
          
          const updatedComplaints = state.complaints.map(c => 
            c.id === id 
              ? { 
                  ...c, 
                  responseMessage,
                  updatedAt: new Date().toISOString()
                } 
              : c
          );
          
          success = true;
          return { complaints: updatedComplaints, isLoading: false };
        });

        if (success) {
          const complaint = get().getComplaintById(id);
          if (complaint) {
            // Send response notification email
            await sendEmailNotification(
              complaint.email,
              `New response to your complaint [${complaint.id}]`,
              `Dear ${complaint.citizenName},\n\nA new response has been added to your complaint regarding "${complaint.subject}" (ID: ${complaint.id}):\n\n"${responseMessage}"\n\nThank you for your patience.`
            );
          }
        }

        return success;
      },

      getComplaintsByDepartment: (department) => {
        return get().complaints.filter(complaint => complaint.department === department);
      },

      getComplaintsByStatus: (status) => {
        return get().complaints.filter(complaint => complaint.status === status);
      }
    }),
    {
      name: 'complaint-storage'
    }
  )
);
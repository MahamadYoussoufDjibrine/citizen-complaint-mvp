import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

// Sample users - in a real app, this would come from a database
const SAMPLE_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    department: 'other',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'roads',
    password: 'roads123',
    department: 'roads',
    role: 'staff',
    name: 'Roads Department'
  },
  {
    id: '3',
    username: 'water',
    password: 'water123',
    department: 'water',
    role: 'staff',
    name: 'Water Department'
  }
];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (username, password) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = SAMPLE_USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (user) {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return true;
        } else {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: 'Invalid username or password'
          });
          return false;
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
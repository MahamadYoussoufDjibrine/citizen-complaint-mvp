import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MailQuestion, 
  CheckSquare, 
  AlertOctagon, 
  Clock, 
  Settings,
  FileText,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All Complaints', href: '/admin/complaints', icon: MailQuestion },
    { name: 'Pending', href: '/admin/complaints/pending', icon: Clock },
    { name: 'In Progress', href: '/admin/complaints/in-progress', icon: AlertOctagon },
    { name: 'Resolved', href: '/admin/complaints/resolved', icon: CheckSquare },
  ];
  
  const adminLinks = [
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside className="bg-white w-64 shadow-md hidden md:block">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="px-3 py-2 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-500">{user?.department} Department</p>
        </div>
        <ul className="space-y-2 font-medium">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center p-3 rounded-lg ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
          
          {isAdmin && (
            <>
              <li className="pt-4">
                <div className="px-3 py-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Administration</h3>
                </div>
              </li>
              {adminLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-3 rounded-lg ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors duration-200`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
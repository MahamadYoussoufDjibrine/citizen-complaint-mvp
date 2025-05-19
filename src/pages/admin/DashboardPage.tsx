import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ArrowRightCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useComplaintStore } from '../../store/complaintStore';
import { useAuthStore } from '../../store/authStore';
import { ComplaintStatus, Department } from '../../types';
import { getDepartmentName } from '../../utils/helpers';

const DashboardPage: React.FC = () => {
  const { complaints } = useComplaintStore();
  const { user } = useAuthStore();
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    departmentCounts: {} as Record<Department, number>,
  });
  
  const [recentComplaints, setRecentComplaints] = useState<typeof complaints>([]);
  
  useEffect(() => {
    // Filter complaints based on department if user is not admin
    const relevantComplaints = user?.role === 'admin' 
      ? complaints 
      : complaints.filter(c => c.department === user?.department);
    
    // Calculate stats
    const pending = relevantComplaints.filter(c => c.status === 'pending').length;
    const inProgress = relevantComplaints.filter(c => c.status === 'in-progress').length;
    const resolved = relevantComplaints.filter(c => c.status === 'resolved').length;
    const rejected = relevantComplaints.filter(c => c.status === 'rejected').length;
    
    // Department counts
    const departmentCounts = relevantComplaints.reduce((acc, complaint) => {
      acc[complaint.department] = (acc[complaint.department] || 0) + 1;
      return acc;
    }, {} as Record<Department, number>);
    
    setStats({
      total: relevantComplaints.length,
      pending,
      inProgress,
      resolved,
      rejected,
      departmentCounts,
    });
    
    // Get recent complaints (last 5)
    const sorted = [...relevantComplaints].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setRecentComplaints(sorted.slice(0, 5));
  }, [complaints, user]);
  
  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'in-progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of complaints and their statuses.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin' ? 'All departments' : `In ${getDepartmentName(user?.department || 'other')}`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 
                ? `${Math.round((stats.pending / stats.total) * 100)}% of total` 
                : 'No complaints yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 
                ? `${Math.round((stats.inProgress / stats.total) * 100)}% of total` 
                : 'No complaints yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 
                ? `${Math.round((stats.resolved / stats.total) * 100)}% of total` 
                : 'No complaints yet'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div 
                    key={complaint.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(complaint.status)}
                      <div>
                        <div className="font-medium">{complaint.subject}</div>
                        <div className="text-sm text-gray-500">
                          {complaint.citizenName} • {formatDate(complaint.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Link to={`/admin/complaints/${complaint.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] border border-dashed rounded-lg">
                <div className="text-center">
                  <Users className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No complaints</h3>
                  <p className="mt-1 text-sm text-gray-500">No complaints have been submitted yet.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/admin/complaints" className="w-full">
              <Button variant="outline" fullWidth leftIcon={<ArrowRightCircle className="h-4 w-4" />}>
                View All Complaints
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Complaints by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Pending</span>
                    <span>{stats.pending} ({Math.round((stats.pending / stats.total) * 100)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${(stats.pending / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">In Progress</span>
                    <span>{stats.inProgress} ({Math.round((stats.inProgress / stats.total) * 100)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full" 
                      style={{ width: `${(stats.inProgress / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Resolved</span>
                    <span>{stats.resolved} ({Math.round((stats.resolved / stats.total) * 100)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400 rounded-full" 
                      style={{ width: `${(stats.resolved / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Rejected</span>
                    <span>{stats.rejected} ({Math.round((stats.rejected / stats.total) * 100)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-400 rounded-full" 
                      style={{ width: `${(stats.rejected / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] border border-dashed rounded-lg">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No data</h3>
                  <p className="mt-1 text-sm text-gray-500">No complaints data available.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
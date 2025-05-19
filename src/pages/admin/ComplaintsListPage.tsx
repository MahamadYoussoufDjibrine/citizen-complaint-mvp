import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import StatusBadge from '../../components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useComplaintStore } from '../../store/complaintStore';
import { useAuthStore } from '../../store/authStore';
import { Complaint, ComplaintStatus, Department } from '../../types';
import { getDepartmentName, formatDate } from '../../utils/helpers';
import { Search, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react';

const ComplaintsListPage: React.FC = () => {
  const { status } = useParams<{ status?: ComplaintStatus }>();
  const navigate = useNavigate();
  const { complaints } = useComplaintStore();
  const { user } = useAuthStore();
  
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter complaints based on status param, department, and search query
  useEffect(() => {
    let filtered = [...complaints];
    
    // Filter by department if user is not admin
    if (user?.role !== 'admin') {
      filtered = filtered.filter(c => c.department === user?.department);
    } 
    // Filter by selected department if admin
    else if (departmentFilter !== 'all') {
      filtered = filtered.filter(c => c.department === departmentFilter);
    }
    
    // Filter by status if provided
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c => 
          c.id.toLowerCase().includes(query) ||
          c.citizenName.toLowerCase().includes(query) ||
          c.subject.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }
    
    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredComplaints(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [complaints, user, status, searchQuery, departmentFilter]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'roads', label: 'Roads & Infrastructure' },
    { value: 'water', label: 'Water Supply' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'sanitation', label: 'Sanitation & Waste' },
    { value: 'public-safety', label: 'Public Safety' },
    { value: 'other', label: 'General Enquiries' },
  ];
  
  const renderTitle = () => {
    let title = 'All Complaints';
    
    if (status) {
      switch (status) {
        case 'pending':
          title = 'Pending Complaints';
          break;
        case 'in-progress':
          title = 'In Progress Complaints';
          break;
        case 'resolved':
          title = 'Resolved Complaints';
          break;
        case 'rejected':
          title = 'Rejected Complaints';
          break;
      }
    }
    
    return title;
  };
  
  // Remove department filter for non-admin users
  const showDepartmentFilter = user?.role === 'admin';
  
  const handleRefresh = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{renderTitle()}</h1>
        <p className="text-muted-foreground">
          {status 
            ? `Manage ${status.replace('-', ' ')} complaints`
            : 'Manage and respond to all citizen complaints'
          }
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Complaints List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {showDepartmentFilter && (
                <div className="flex items-center">
                  <Select
                    options={departmentOptions}
                    value={departmentFilter}
                    onChange={(value) => setDepartmentFilter(value as Department | 'all')}
                    className="min-w-[200px]"
                  />
                </div>
              )}
              
              <Button 
                variant="ghost"
                onClick={handleRefresh}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredComplaints.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      {showDepartmentFilter && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                      )}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="truncate max-w-[200px]" title={complaint.subject}>
                            {complaint.subject}
                          </div>
                          <div className="text-xs text-gray-500">
                            {complaint.citizenName}
                          </div>
                        </td>
                        {showDepartmentFilter && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getDepartmentName(complaint.department)}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(complaint.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <Link to={`/admin/complaints/${complaint.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredComplaints.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredComplaints.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <Filter className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search query.' 
                  : status 
                    ? `No ${status.replace('-', ' ')} complaints at this time.` 
                    : 'No complaints have been submitted yet.'
                }
              </p>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintsListPage;
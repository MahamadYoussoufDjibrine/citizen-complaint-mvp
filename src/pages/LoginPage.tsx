import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  // If already authenticated, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, password } = credentials;
    
    if (!username || !password) {
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/admin/dashboard');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Login</h1>
          <p className="text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                fullWidth
                required
              />
              
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                fullWidth
                required
              />
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                  leftIcon={<LogIn className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6 bg-blue-50 rounded-md p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <p className="text-sm text-blue-700 mb-2">For demonstration purposes, use:</p>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Username: <span className="font-mono bg-blue-100 px-1">admin</span> / Password: <span className="font-mono bg-blue-100 px-1">admin123</span> (Admin)</li>
            <li>Username: <span className="font-mono bg-blue-100 px-1">roads</span> / Password: <span className="font-mono bg-blue-100 px-1">roads123</span> (Roads Dept.)</li>
            <li>Username: <span className="font-mono bg-blue-100 px-1">water</span> / Password: <span className="font-mono bg-blue-100 px-1">water123</span> (Water Dept.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
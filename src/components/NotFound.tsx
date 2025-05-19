import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="mb-6 text-amber-500">
        <AlertTriangle className="h-20 w-20" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
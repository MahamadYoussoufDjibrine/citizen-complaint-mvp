import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const baseStyles = 'rounded-md p-4';
  
  const variants: Record<AlertVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400" />,
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    },
  };
  
  const currentVariant = variants[variant];
  
  return (
    <div className={`${baseStyles} ${currentVariant.bg} ${currentVariant.border ? 'border ' + currentVariant.border : ''} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {currentVariant.icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${currentVariant.text}`}>{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''} ${currentVariant.text}`}>{children}</div>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentVariant.bg} ${currentVariant.text}`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
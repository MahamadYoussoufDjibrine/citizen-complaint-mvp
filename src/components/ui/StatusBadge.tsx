import React from 'react';
import Badge from './Badge';
import { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getVariantAndLabel = () => {
    switch (status) {
      case 'pending':
        return { variant: 'warning' as const, label: 'Pending Review' };
      case 'in-progress':
        return { variant: 'primary' as const, label: 'In Progress' };
      case 'resolved':
        return { variant: 'success' as const, label: 'Resolved' };
      case 'rejected':
        return { variant: 'danger' as const, label: 'Rejected' };
      default:
        return { variant: 'secondary' as const, label: status };
    }
  };

  const { variant, label } = getVariantAndLabel();

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
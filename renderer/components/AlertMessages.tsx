import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AlertMessagesProps {
  error: string | null;
  isLoading: boolean;
}

export const AlertMessages: React.FC<AlertMessagesProps> = ({ error, isLoading }) => {
  if (isLoading) {
    return (
      <Alert>
        <AlertTitle>Loading...</AlertTitle>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

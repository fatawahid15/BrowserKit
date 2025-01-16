import React from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface NavigationControlsProps {
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({ onGoBack, onGoForward, onReload }) => {
  return (
    <div className="flex items-center space-x-2">
      <ArrowLeft onClick={onGoBack} />
      <ArrowRight onClick={onGoForward} />
      <RefreshCw onClick={onReload} />
    </div>
  );
};

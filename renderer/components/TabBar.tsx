import React from 'react';
import { Plus, X } from 'lucide-react';

interface TabBarProps {
  tabs: { id: number; url: string }[];
  activeTabId: number;
  onTabSwitch: (tabId: number) => void;
  onTabClose: (tabId: number) => void;
  onAddTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onTabSwitch, onTabClose, onAddTab }) => {
  return (
    <div className="flex items-center">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`px-4 py-2 cursor-pointer ${tab.id === activeTabId ? 'bg-gray-200' : ''}`}
          onClick={() => onTabSwitch(tab.id)}
        >
          <span>{tab.url}</span>
          <X onClick={() => onTabClose(tab.id)} className="inline ml-2" />
        </div>
      ))}
      <button onClick={onAddTab}>
        <Plus />
      </button>
    </div>
  );
};

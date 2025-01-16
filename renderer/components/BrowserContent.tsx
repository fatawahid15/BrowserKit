import React, { useRef, useEffect } from 'react';

interface BrowserContentProps {
  tabs: { id: number; currentUrl: string }[];
  activeTabId: number;
  isLoading: boolean;
  onTabUpdate: (tabId: number, newUrl: string) => void;
}

export const BrowserContent: React.FC<BrowserContentProps> = ({ tabs, activeTabId, isLoading, onTabUpdate }) => {
  const webviewRefs = useRef<{ [key: number]: HTMLWebViewElement | null }>({});

  useEffect(() => {
    tabs.forEach((tab) => {
      const webview = webviewRefs.current[tab.id];
      if (webview) {
        const handleDidNavigate = () => {
          onTabUpdate(tab.id, webview.src);
        };
        webview.addEventListener('did-navigate', handleDidNavigate);
        return () => {
          webview.removeEventListener('did-navigate', handleDidNavigate);
        };
      }
    });
  }, [tabs, onTabUpdate]);

  return (
    <div className="flex-grow relative">
      {tabs.map((tab) => (
        <webview
          key={tab.id}
          ref={(el) => {webviewRefs.current[tab.id] = el}}
          src={tab.currentUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: tab.id === activeTabId ? '' : 'none',
          }}
          allowpopups="true"
        />
      ))}
    </div>
  );
};

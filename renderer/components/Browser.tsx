'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Search, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';

export default function Browser() {
  const [tabs, setTabs] = useState([
    { id: 1, url: 'https://www.google.com', currentUrl: 'https://www.google.com' },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const webviewRef = useRef<HTMLWebViewElement>(null);

  const isValidUrl = (input: string) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  const getSearchUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/search?q=${encodedQuery}`;
  };

  const navigate = useCallback(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (!activeTab) return;

    const finalUrl = isValidUrl(activeTab.url) ? activeTab.url : getSearchUrl(activeTab.url);
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, currentUrl: finalUrl } : tab
      )
    );

    if (webviewRef.current) {
      webviewRef.current.src = finalUrl;
    }

    setError(null);
  }, [tabs, activeTabId]);

  const addTab = () => {
    const newTabId = tabs.length ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    setTabs((prevTabs) => [
      ...prevTabs,
      { id: newTabId, url: 'https://www.google.com', currentUrl: 'https://www.google.com' },
    ]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: number) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);
      if (updatedTabs.length === 0) {
        addTab();
        return updatedTabs;
      }
      if (activeTabId === tabId) {
        const index = prevTabs.findIndex((tab) => tab.id === tabId);
        const newActiveId = updatedTabs[index] ? updatedTabs[index].id : updatedTabs[updatedTabs.length - 1].id;
        setActiveTabId(newActiveId);
      }
      return updatedTabs;
    });
  };

  const handleTabSwitch = (tabId: number) => {
    setActiveTabId(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate();
    }
  };

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (!activeTab) return;

    const webview = webviewRef.current;

    const handleDidNavigate = () => {
      if (webview) {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === activeTabId ? { ...tab, url: webview.src, currentUrl: webview.src } : tab
          )
        );
      }
    };

    const handleDidFailLoad = (event: Event) => {
      const errorEvent = event as ErrorEvent;
      setError(`Failed to load the page: ${errorEvent.message}`);
    };

    if (webview) {
      webview.addEventListener('did-stop-loading', handleDidNavigate);
      webview.addEventListener('did-fail-load', handleDidFailLoad);
    }

    return () => {
      if (webview) {
        webview.removeEventListener('did-stop-loading', handleDidNavigate);
        webview.removeEventListener('did-fail-load', handleDidFailLoad);
      }
    };
  }, [activeTabId, tabs]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-card p-4 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 rounded-md cursor-pointer ${
              tab.id === activeTabId ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
            onClick={() => handleTabSwitch(tab.id)}
          >
            <span className="truncate max-w-xs">{new URL(tab.currentUrl).hostname}</span>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="icon" onClick={addTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2 p-4 bg-card">
        <Button
          variant="outline"
          size="icon"
          onClick={() => webviewRef.current?.goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => webviewRef.current?.goForward()}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => webviewRef.current?.reload()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <div className="flex-grow flex items-center space-x-2">
          <Input
            type="text"
            value={activeTab?.url || ''}
            onChange={(e) =>
              setTabs((prevTabs) =>
                prevTabs.map((tab) =>
                  tab.id === activeTabId ? { ...tab, url: e.target.value } : tab
                )
              )
            }
            onKeyDown={handleKeyDown}
            className="flex-grow"
            placeholder="Enter URL or search query"
          />
          <Button onClick={navigate}>
            <Search className="h-4 w-4 mr-2" />
            Go
          </Button>
        </div>
      </div>

      <div className="flex-grow relative">
        {tabs.map((tab) => (
          <webview
            key={tab.id}
            ref={tab.id === activeTabId ? webviewRef : undefined}
            src={tab.currentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: tab.id === activeTabId ? '' : 'none',
            }}
            allowpopups="true"
            allowFullScreen={true}
          ></webview>
        ))}
      </div>
    </div>
  );
}

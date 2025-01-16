export {};

declare global {
  interface Window {
    electronAPI: {
      newTab: (url?: string) => void;
      closeTab: (index: number) => void;
      onUpdateTabs: (callback: (tabs: string[]) => void) => () => void;
      sendMessage: (message: string) => void;
      onReply: (callback: (reply: unknown) => void) => () => void;
    };
  }
  declare interface HTMLWebViewElement {
    src: string;
    getURL(): string;
    goBack(): void;
    goForward(): void;
    reload(): void;
    getTitle(): string;
  }
  
}


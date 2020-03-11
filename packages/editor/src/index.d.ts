interface Window {
  sendIDEMessage?: (IDEMessageParams) => void;
  goldlog?: {
    record: (logKey: string, gmKey: string, goKey: string, method: 'GET' | 'POST') => void;
  };
  is_theia?: boolean;
  vscode?: boolean;
}

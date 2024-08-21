export interface IContentEditor {
  load(content: string): Promise<void>;

  export(): Promise<string>;

  close(): void;

  send(channel: string, ...args: any[]): void;
}

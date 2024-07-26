export interface UriComponents {
  path: string;
}

export class URI implements UriComponents {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }
}

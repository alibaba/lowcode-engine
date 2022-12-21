import { IPublicModelScrollTarget } from './';

export interface IPublicModelScrollable {
  scrollTarget?: IPublicModelScrollTarget | Element;
  bounds?: DOMRect | null;
  scale?: number;
}
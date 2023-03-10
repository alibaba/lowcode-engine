import { IPublicModelScrollTarget } from '../model';

export interface IPublicTypeScrollable {
  scrollTarget?: IPublicModelScrollTarget | Element;
  bounds?: DOMRect | null;
  scale?: number;
}

export interface IPublicModelScroller {

  scrollTo(options: { left?: number; top?: number }): void;

  cancel(): void;

  scrolling(point: { globalX: number; globalY: number }): void;
}

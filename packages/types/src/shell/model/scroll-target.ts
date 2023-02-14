
export interface IPublicModelScrollTarget {
  get left(): number;
  get top(): number;
  scrollTo(options: { left?: number; top?: number }): void;
  scrollToXY(x: number, y: number): void;
  get scrollHeight(): number;
  get scrollWidth(): number;
}

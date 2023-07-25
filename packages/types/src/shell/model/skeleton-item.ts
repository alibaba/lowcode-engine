/**
 * @since 1.1.7
 */
export interface IPublicModelSkeletonItem {
  name: string;

  visible: boolean;

  disable(): void;

  enable(): void;

  hide(): void;

  show(): void;
}
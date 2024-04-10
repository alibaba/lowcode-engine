import { IPublicModelNode, IPublicModelLocateEvent } from '../model';

// eslint-disable-next-line no-shadow
export enum IPublicTypeLocationDetailType {
  Children = 'Children',
  Prop = 'Prop',
}

/**
 * @deprecated please use IPublicTypeLocationDetailType
 */
export enum LocationDetailType {
  Children = 'Children',
  Prop = 'Prop',
}

export type IPublicTypeRect = DOMRect & {
  elements?: Array<Element | Text>;
  computed?: boolean;
};

export interface IPublicTypeLocationChildrenDetail {
  type: IPublicTypeLocationDetailType.Children;
  index?: number | null;

  /**
   * 是否有效位置
   */
  valid?: boolean;
  edge?: DOMRect;
  near?: {
    node: IPublicModelNode;
    pos: 'before' | 'after' | 'replace';
    rect?: IPublicTypeRect;
    align?: 'V' | 'H';
  };
  focus?: { type: 'slots' } | { type: 'node'; node: IPublicModelNode };
}

export interface IPublicTypeLocationPropDetail {
  // cover 形态，高亮 domNode，如果 domNode 为空，取 container 的值
  type: IPublicTypeLocationDetailType.Prop;
  name: string;
  domNode?: HTMLElement;
}

export type IPublicTypeLocationDetail = IPublicTypeLocationChildrenDetail | IPublicTypeLocationPropDetail | { [key: string]: any; type: string };

export interface IPublicTypeLocationData<
  Node = IPublicModelNode
> {
  target: Node; // shadowNode | ConditionFlow | ElementNode | RootNode
  detail: IPublicTypeLocationDetail;
  source: string;
  event: IPublicModelLocateEvent;
}

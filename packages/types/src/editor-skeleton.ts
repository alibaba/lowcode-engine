/**
 * 所有可能的停靠位置
 */
 export type IWidgetConfigArea =
 | 'leftArea' | 'left' | 'rightArea'
 | 'right' | 'topArea' | 'top'
 | 'toolbar' | 'mainArea' | 'main'
 | 'center' | 'centerArea' | 'bottomArea'
 | 'bottom' | 'leftFixedArea'
 | 'leftFloatArea' | 'stages';

export interface IWidgetBaseConfig {
 type: string;
 name: string;
 /**
  * 停靠位置：
  * - 当 type 为 'Panel' 时自动为 'leftFloatArea'；
  * - 当 type 为 'Widget' 时自动为 'mainArea'；
  * - 其他时候自动为 'leftArea'；
  */
 area?: IWidgetConfigArea;
 props?: Record<string, any>;
 content?: any;
 contentProps?: Record<string, any>;
 // index?: number;
 [extra: string]: any;
}

/**
 * 用于描述组件面板中的 tab 和 category
 */

export interface IPublicTypeComponentSort {
  /**
   * 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
   */
  groupList?: string[];
  /**
   * 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
   */
  categoryList?: string[];
}

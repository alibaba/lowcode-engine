import * as React from 'react';

/**
 * 财鲸Layout属性配置
 */
export interface WhaleLayoutProps {
  /**
   * 是否是财鲸主站，该字段由后端 vm 中吐出在 window.appConfig 中
   * @defaultValue false
   */
  isMainSite?: boolean;
  /**
   * 财鲸主站的 app 名称，该字段由后端 vm 中吐出在 window.appConfig 中
   * @defaultValue 'caijing'
   */
  mainSiteAppName?: string;
  /**
   * 主站中文名，该字段由后端 vm 中吐出在 window.appConfig 中
   * @defaultValue '财鲸'
   */
  mainSiteName?: string;
  /**
   * 主站英文名，该字段由后端 vm 中吐出在 window.appConfig 中
   * @defaultValue 'Caijing'
   */
  mainSiteNameEn?: string;
  /**
   * 主站链接，该字段由后端 vm 中吐出在 window.appConfig 中
   * @defaultValue '//caijing.alibaba-inc.com'
   */
  mainSiteLink?: string;
  /**
   * 子站点的应用名，该字段由后端 vm 中吐出在 window.appConfig 中
   */
  subSiteAppName: string;
  /**
   * 子站点的名称，该字段由后端 vm 中吐出在 window.appConfig 中
   */
  subSiteName: string;
  /**
   * 子站点的英文名称，该字段由后端 vm 中吐出在 window.appConfig 中
   */
  subSiteNameEn: string;
  /**
   * 子站点的链接，该字段由后端 vm 中吐出在 window.appConfig 中
   */
  subSiteLink: string;
  /**
   * 子站访问相关接口时，属于buc 跨域请求，需要把 ssoTicket 带上，该字段由后端 vm 中吐出在 window.appConfig 中
   */
  ssoTicket: string;
  /**
   * 是否使用 ak/sk 方案（用于登录）
   * @defaultValue false
   */
  aksk?: boolean;
  /**
   * 是否显示左侧导航
   * @defaultValue true
   */
  sidebarVisible?: boolean;
  /**
   * 是否显示顶部菜单栏
   * @defaultValue true
   */
  topbarVisible?: boolean;
  /**
   * 是否开启全屏
   * @defaultValue false
   */
  isFullScreen?: boolean;
  /**
   * 当前选中的导航 key
   * @defaultValue 'home'
   */
  navSelectedKeys?: string | string[];
  /**
   * history 对象
   * @defaultValue {}
   */
  history?: string | {};
  /**
   * 左侧子导航数组
   * 参考：https://whale.fusion.alibaba-inc.com/73015/component/basic/nav#demo-api
   * @defaultValue []
   */
  nav?: Array<{}>;
  /**
   * Next Nav 组件本身的配置
   * @defaultValue {}
   */
  nextNavConfig?: {};
  /**
   * 切换语言的 Url
   * @defaultValue null
   */
  setLanguageUrl?: string;
  /**
   * 顶部控件的扩展区渲染内容
   * @defaultValue null
   */
  extra?: React.ReactNode;
  /**
   * 顶部导航站点名称后面的快速入口区域自定义渲染
   * @defaultValue null
   */
  quickEntry?: React.ReactNode;
  /**
   * 水印配置项
   * 配置文档参考：{@link https://npm.alibaba-inc.com/package/@alife/waterMark}
   * @defaultValue null
   */
  waterMarkOptions?: {};
  /**
   * 是否需要默认的登出行为
   * @defaultValue true
   */
  needDefaultLogout?: boolean;
  /**
   * 点击登出按钮后的回调函数
   * @defaultValue null
   */
  onLogoutClick?: () => void;
  /**
   * 侧边栏收起展开回调函数
   * @defaultValue null
   */
  onToggleMenu?: () => void;
  /**
   * logo 的 style 覆盖
   * @defaultValue null
   */
  logoStyle?: React.CSSProperties;
  /**
   * logo 点击事件，传入覆盖
   * @defaultValue null
   */
  onLogoClick?: () => void;
  /**
   * 切换语言自定义事件
   *
  */
  onToggleLang?: (nextConfig: Record<string, any>, appName: any) => void;
  /**
   * 语言切换器显示切换
   * @defaultValueValue true
  */
  langVisible?: boolean;
  /**
   * 打开启用浏览器缩放警告
   * @defaultValue `true`
  */
  scaleWarning?: boolean;
  /**
    * This event is fired whenever the application navigates to a new page.
    * @eventProperty
  */
  test: string;
}

/**
 * 财鲸Layout owner: 昔夜
 *
 * 查看组件文档: https://whale.fusion.alibaba-inc.com/73015/component/bizcomps/692
 */
declare class WhaleLayout extends React.Component<WhaleLayoutProps, any> { }

export default WhaleLayout;

/**
 * 基础节点
 *
 * [Node Properties]
 *  componentName: Page/Block/Component
 *  props
 *  children
 *
 * [Directives]
 *  loop
 *  loopArgs
 *  condition
 *
 *  ------- addition support -----
 *  conditionGroup use for condition, for exclusive
 *  title          display on outline
 *  ignored        ignore this node will not publish to render, but will store
 *  isLocked       can not select/hover/ item on canvas and outline
 *  hidden         not visible on canvas
 *  slotArgs       like loopArgs, for slot node
 */
export interface NormalNode {}

/**
 * 根容器节点
 *
 * [Root Container Extra Properties]
 *  fileName
 *  meta
 *  state
 *  defaultProps
 *  dataSource
 *  lifeCycles
 *  methods
 *  css
 */
export interface RootNode extends NormalNode {}

export interface IPublicModelSimulatorRender {

  /**
   * 画布组件列表
   */
  components: {
    [key: string]: any;
  };

  /**
   * 触发画布重新渲染
   */
  rerender: () => void;
}

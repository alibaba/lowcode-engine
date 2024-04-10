
export interface IPublicModelClipboard {

  /**
   * 给剪贴板赋值
   * set data to clipboard
   *
   * @param {*} data
   * @since v1.1.0
   */
  setData(data: any): void;

  /**
   * 设置剪贴板数据设置的回调
   * set callback for clipboard provide paste data
   *
   * @param {KeyboardEvent} keyboardEvent
   * @param {(data: any, clipboardEvent: ClipboardEvent) => void} cb
   * @since v1.1.0
   */
  waitPasteData(
    keyboardEvent: KeyboardEvent,
    cb: (data: any, clipboardEvent: ClipboardEvent) => void,
  ): void;
}

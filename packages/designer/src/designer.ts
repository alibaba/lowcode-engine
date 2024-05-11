export interface DesignerOptions {}

export class Designer {
  constructor(options?: DesignerOptions) {}

  #setupHistory() {}

  onMounted() {}

  purge() {}
}

export function createDesigner(options?: DesignerOptions) {
  return new Designer(options);
}

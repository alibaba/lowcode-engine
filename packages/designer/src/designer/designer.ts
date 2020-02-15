class Designer {
  id: string = guid();
  hotkey: Hotkey;

  constructor(options: BuilderOptions): Builder;

  getValue(): ProjectSchema;
  setValue(schema: ProjectSchema): void;
  project: Project;
  dragboost(locateEvent: LocateEvent): void;
  addDropSensor(dropSensor: DropSensor): void;


  private _suspensed: boolean = false;

  get suspensed(): boolean {
    return this._suspensed;
  }

  set suspensed(flag: boolean) {
    this._suspensed = flag;
    // Todo afterwards...
    if (flag) {
      // this.project.suspensed = true?
    }
  }

  // 事件 & 消息
  onActiveChange(): () => void;
  onDragstart(): void;
  onDragend(): void;
  //....
}

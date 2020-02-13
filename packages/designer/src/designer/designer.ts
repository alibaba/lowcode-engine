class Designer {
  id: string = guid();
  hotkey: Hotkey;

  constructor(options: BuilderOptions): Builder;

  getValue(): ProjectSchema;
  setValue(schema: ProjectSchema): void;
  project: Project;
  dragboost(locateEvent: LocateEvent): void;
  addDropSensor(dropSensor: DropSensor): void;

  // 事件 & 消息
  onActiveChange(): () => void;
  onDragstart(): void;
  onDragend(): void;
  //....
}

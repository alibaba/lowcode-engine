export class Project {
  private schema: any;

  constructor() {
    this.schema = {};
  }

  getSchema() {
    return this.schema;
  }

  setSchema(schema: any) {
    this.schema = schema;
  }
}

export default new Project();

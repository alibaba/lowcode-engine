import { designer } from './editor';

const { project } = designer;

Object.assign(project, {
  getSchema(): any {
    return this.schema || {};
  },

  setSchema(schema: any) {
    this.schema = schema;
  },
});

export default project;

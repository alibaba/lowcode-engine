import { designer } from './editor';

const { project } = designer;

const visionProject = {};
Object.assign(visionProject, project, {
  getSchema(): any {
    return this.schema || {};
  },

  setSchema(schema: any) {
    this.schema = schema;
  },

  setConfig(config: any) {
    this.set('config', config);
  },
});

export default visionProject;

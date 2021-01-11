import { EventEmitter } from 'events';
import { ALI_SCHEMA_VERSION } from './base/const';
import { editorHelper } from '@ali/lowcode-engine';

const { obx } = editorHelper;

interface ILiteralObject {
  [key: string]: any;
}

export class Env {
  @obx.val envs: ILiteralObject = {};

  private emitter: EventEmitter;

  private featureMap: ILiteralObject;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.featureMap = {};
  }

  get(name: string): any {
    return this.getEnv(name);
  }

  getEnv(name: string): any {
    return this.envs[name];
  }

  set(name: string, value: any) {
    return this.setEnv(name, value);
  }

  setEnv(name: string, value: any) {
    const orig = this.envs[name];
    if (JSON.stringify(orig) === JSON.stringify(value)) {
      return;
    }
    this.envs[name] = value;
    this.emitter.emit('envchange', this.envs, name, value);
  }

  setEnvMap(envs: ILiteralObject): void {
    this.envs = Object.assign(this.envs, envs);
    this.emitter.emit('envchange', this.envs);
  }

  getLocale(): string {
    return this.getEnv('locale') || 'zh_CN';
  }

  setLocale(locale: string) {
    this.setEnv('locale', locale);
  }

  setExpertMode(flag: string) {
    this.setEnv('expertMode', !!flag);
  }

  isExpertMode() {
    return !!this.getEnv('expertMode');
  }

  getSupportFeatures() {
    return Object.assign({}, this.featureMap);
  }

  setSupportFeatures(features: ILiteralObject) {
    this.featureMap = Object.assign({}, this.featureMap, features);
  }

  supports(name = 'supports') {
    return !!this.featureMap[name];
  }

  onEnvChange(func: (envs: ILiteralObject, name: string, value: any) => any) {
    this.emitter.on('envchange', func);
    return () => {
      this.emitter.removeListener('envchange', func);
    };
  }

  clear() {
    this.envs = {};
    this.featureMap = {};
  }

  getAliSchemaVersion() {
    return ALI_SCHEMA_VERSION;
  }
}

export default new Env();

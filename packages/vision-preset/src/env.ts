import { EventEmitter } from 'events';
import { ALI_SCHEMA_VERSION } from './base/const';

interface ILiteralObject {
  [key: string]: any;
}

export class Env {

  public envs: ILiteralObject;

  private emitter: EventEmitter;
  private featureMap: ILiteralObject;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.envs = {};
    this.featureMap = {};
  }

  public get(name: string): any {
    return this.getEnv(name);
  }

  public getEnv(name: string): any {
    return this.envs[name];
  }

  public set(name: string, value: any) {
    return this.setEnv(name, value);
  }

  public setEnv(name: string, value: any) {
    const orig = this.envs[name];
    if (JSON.stringify(orig) === JSON.stringify(value)) {
      return;
    }
    this.envs[name] = value;
    this.emitter.emit('envchange', this.envs, name, value);
  }

  public setEnvMap(envs: ILiteralObject): void {
    this.envs = Object.assign(this.envs, envs);
    this.emitter.emit('envchange', this.envs);
  }

  public getLocale(): string {
    return this.getEnv('locale') || 'zh_CN';
  }

  public setLocale(locale: string) {
    this.setEnv('locale', locale);
  }

  public setExpertMode(flag: string) {
    this.setEnv('expertMode', !!flag);
  }

  public isExpertMode() {
    return !!this.getEnv('expertMode');
  }

  public getSupportFeatures() {
    return Object.assign({}, this.featureMap);
  }

  public setSupportFeatures(features: ILiteralObject) {
    this.featureMap = Object.assign({}, this.featureMap, features);
  }

  public supports(name = 'supports') {
    return !!this.featureMap[name];
  }

  public onEnvChange(func: (envs: ILiteralObject, name: string, value: any) => any) {
    this.emitter.on('envchange', func);
    return () => {
      this.emitter.removeListener('envchange', func);
    };
  }

  public getAliSchemaVersion() {
    return ALI_SCHEMA_VERSION;
  }
}

export default new Env();

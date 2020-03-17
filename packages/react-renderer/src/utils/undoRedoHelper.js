import Debug from 'debug';
import { fastClone } from './index';
const DEFAULT_CONFIG = {
  limit: 20
};
const debug = Debug('utils:undoRedoHelper');
export default class UndoRedoHelper {
  constructor(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.data = {};
  }

  create(key, value, forceCreate) {
    if (!this.data[key] || forceCreate) {
      this.data[key] = {
        list: [fastClone(value)],
        idx: 0
      };
    }
    return this.data[key];
  }

  delete(key) {
    delete this.data[key];
  }

  resetRecord(key, value) {
    const data = this.data[key];
    if (!data || !data.list) return;
    data.list = data.list.slice(0, data.idx + 1);
    data.list[data.idx] = fastClone(value);
  }

  record(key, value) {
    const data = this.data[key];
    const limit = this.config.limit;
    if (!data || !data.list) return;
    data.list = data.list.slice(0, data.idx + 1);
    if (data.list.length >= limit) {
      data.list.shift();
    }
    data.list.push(fastClone(value));
    ++data.idx;
  }

  undo(key) {
    const data = this.data[key];
    if (!data || !data.list) return null;
    //若没有前置操作，返回当前数据
    if (data.idx <= 0) return data.list[data.idx];
    --data.idx;
    return data.list[data.idx];
  }
  redo(key) {
    const data = this.data[key];
    if (!data || !data.list) return null;
    //若没有后续操作，返回当前数据
    if (data.idx >= data.list.length - 1) return data.list[data.idx];
    ++data.idx;
    return data.list[data.idx];
  }

  past(key) {
    const data = this.data[key];
    if (!data || !data.list || data.idx <= 0) return null;
    return data.list[data.idx - 1];
  }

  present(key) {
    const data = this.data[key];
    if (!data || !data.list) return null;
    return data.list[data.idx];
  }

  future(key) {
    const data = this.data[key];
    if (!data || !data.list || data.idx >= data.list.length - 1) return null;
    return data.list[data.idx + 1];
  }

  get(key) {
    return {
      past: this.past(key),
      present: this.present(key),
      future: this.future(key)
    };
  }
}

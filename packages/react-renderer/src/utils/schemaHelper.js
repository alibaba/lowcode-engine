import { forEach } from '@ali/b3-one/lib/obj';
import {
  clone,
  fastClone,
  jsonuri,
  isSchema,
  isFileSchema,
  isJSFunction,
  isJSExpression,
  parseObj,
  transformSchemaToPure,
  transformSchemaToStandard,
  isEmpty,
  moveArrayItem,
  serialize,
  deepEqual
} from './index';
import Debug from 'debug';
import compFactory from '../hoc/compFactory';
const debug = Debug('utils:schemaHelper');
let keyIndex = 0;
export default class SchemaHelper {
  constructor(schema, appHelper) {
    this.appHelper = appHelper;
    this.reset(schema, true);
  }

  reset(schema, isInit) {
    debug('start reset');
    this.emit('schemaHelper.schema.beforeReset');
    this.schemaMap = {};
    this.blockSchemaMap = {};
    this.compThisMap = {};
    this.blockTree = {};
    this.compTreeMap = {};
    this.compCtxMap = {};
    this.rebuild(schema, isInit);
    this.emit('schemaHelper.schema.afterReset');
  }

  add(schema, targetKey, direction) {
    this.emit('schemaHelper.material.beforeAdd');
    const targetSchema = this.schemaMap[targetKey];
    if (isEmpty(schema) || !targetSchema) return;
    let targetPath = targetSchema.__ctx.lunaPath;
    if (targetPath === '' && direction !== 'in') {
      console.warn('add error');
      return;
    }
    let newSchema = [];
    if (Array.isArray(schema)) {
      newSchema = schema.filter(item => isSchema(item, true));
    } else if (isSchema(schema)) {
      newSchema = [schema];
    } else {
      console.error('模型结构异常');
      return;
    }
    if (direction === 'in') {
      const targetNode = jsonuri.get(this.schema, targetPath);
      targetNode.children = (targetNode.children || []).concat(newSchema);
      //jsonuri.set(this.schema, targetPath, targetNode);
    } else {
      direction = ['left', 'top'].includes(direction) ? 'before' : 'after';
      newSchema.reverse().forEach(item => {
        jsonuri.insert(this.schema, targetPath, item, direction);
      });
    }
    const addKey = `luna_${keyIndex + 1}`;
    this.rebuild(this.schema);
    this.emit('schemaHelper.material.afterAdd', addKey);
    return addKey;
  }

  remove(lunaKey) {
    this.emit('schemaHelper.material.beforeRemove');
    const schema = this.schemaMap[lunaKey];
    if (!schema) return;
    const lunaPath = schema.__ctx.lunaPath;
    if (lunaPath === '') {
      console.warn('root node can not be removed');
      return;
    }

    jsonuri.rm(this.schema, lunaPath);
    delete this.schemaMap[lunaKey];
    delete this.blockSchemaMap[lunaKey];
    this.rebuild(this.schema);
    this.emit('schemaHelper.material.afterRemove');
  }

  move(lunaKey, targetKey, direction) {
    this.emit('schemaHelper.material.beforeMove');
    debug('start move');
    const schema = this.schemaMap[lunaKey];
    const targetSchema = this.schemaMap[targetKey];
    if (!schema || !targetSchema) return;
    let lunaPath = schema.__ctx.lunaPath;
    let targetPath = targetSchema.__ctx.lunaPath;
    if (lunaPath === '' || (targetPath === '' && direction !== 'in')) {
      console.warn('move error');
      return;
    }
    const res = /(.*)\/(\d+)$/.exec(lunaPath);
    const prefix = res && res[1];
    const attr = res && res[2];
    if (!prefix || !attr) {
      console.warn('异常结构');
      return;
    }
    const sourceIdx = parseInt(attr);
    const reg = new RegExp(`^${prefix}/(\\d+)$`);
    const regRes = reg.exec(targetPath);
    const sourceParent = jsonuri.get(this.schema, prefix);
    direction = direction === 'in' ? 'in' : ['left', 'top'].includes(direction) ? 'before' : 'after';
    if (regRes && regRes[1] && direction !== 'in') {
      const distIdx = parseInt(regRes[1]);
      moveArrayItem(sourceParent, sourceIdx, distIdx, direction);
    } else {
      if (direction === 'in') {
        const targetNode = jsonuri.get(this.schema, targetPath);
        targetNode.children = targetNode.children || [];
        if (Array.isArray(targetNode.children)) {
          targetNode.children.push(schema);
        }
        jsonuri.set(this.schema, targetPath, targetNode);
      } else {
        jsonuri.insert(this.schema, targetPath, schema, direction);
      }
      sourceParent.splice(sourceIdx, 1);
    }
    this.rebuild(this.schema);
    this.emit('schemaHelper.material.afterMove');
  }

  //组件上移 下移
  // direction 取值 down/up
  slide(lunaKey, direction) {
    const schema = this.schemaMap[lunaKey];
    if (!schema || !direction) return;
    const lunaPath = schema.__ctx && schema.__ctx.lunaPath;
    if (!lunaPath) return;
    if (direction === 'up' && lunaPath.endsWith('/0')) return;
    const targetPath = lunaPath.replace(/\/(\d+)$/, (res, idx) => {
      return `/${direction === 'down' ? parseInt(idx) + 1 : parseInt(idx) - 1}`;
    });
    const targetSchema = this.getSchemaByPath(targetPath);
    const targetKey = targetSchema && targetSchema.__ctx && targetSchema.__ctx.lunaKey;
    if (!targetKey) return;
    this.move(lunaKey, targetKey, direction === 'down' ? 'bottom' : 'top');
  }

  // 快速复制
  copy(lunaKey) {
    this.emit('schemaHelper.material.beforeCopy');
    const schema = this.schemaMap[lunaKey];
    if (!schema) return;
    const newSchema = transformSchemaToPure(fastClone(schema));
    delete newSchema.__ctx;
    const addKey = this.add(newSchema, schema.__ctx.lunaKey, 'bottom');
    this.emit('schemaHelper.material.afterCopy', addKey);
    return addKey;
  }

  update(lunaKey, props) {
    this.emit('schemaHelper.material.beforeUpdate');
    const schema = this.schemaMap[lunaKey];
    if (!schema) return;
    const {
      __state,
      __defaultProps,
      __fileName,
      __scss,
      __loop,
      __loopArgs,
      __condition,
      __lifeCycles,
      __methods,
      __dataSource,
      children,
      ...otherProps
    } = props;
    debug('update props', props);

    //自定义组件才处理defaultProps
    if (schema.componentName === 'Component' && '__defaultProps' in props) {
      if (!__defaultProps || typeof __defaultProps !== 'object' || isEmpty(__defaultProps)) {
        delete schema.defaultProps;
      } else {
        schema.defaultProps = __defaultProps;
      }
      this.appHelper.components[schema.fileName.replace(/^\w/, a => a.toUpperCase())] = compFactory(schema);
    }

    // 如果loop值没有设置有效值，则删除schema中这个的字段
    if ('__loop' in props) {
      if (!__loop || isEmpty(__loop)) {
        delete schema.loop;
      } else {
        schema.loop = __loop;
      }
    }

    // 指定循环上下文变量名
    if ('__loopArgs' in props) {
      if (
        __loopArgs === undefined ||
        (typeof __loopArgs === 'object' && isEmpty(__loopArgs)) ||
        !Array.isArray(__loopArgs) ||
        __loopArgs.every(item => !item)
      ) {
        delete schema.loopArgs;
      } else {
        schema.loopArgs = __loopArgs;
      }
    }

    // 判断条件
    if ('__condition' in props) {
      if (__condition === undefined) {
        delete schema.condition;
      } else {
        schema.condition = __condition;
      }
    }

    // 处理容器类组件需要考虑的字段
    if (isFileSchema(schema)) {
      // filename
      if ('__fileName' in props) {
        schema.fileName = __fileName;
      }
      // state
      if ('__state' in props) {
        // 重走生命周期
        schema.__ctx && ++schema.__ctx.idx;
        if (!__state || typeof __state !== 'object' || isEmpty(__state)) {
          delete schema.state;
        } else {
          schema.state = __state;
        }
      }
      // 生命周期
      if ('__lifeCycles' in props) {
        if (!__lifeCycles || typeof __lifeCycles !== 'object' || isEmpty(__lifeCycles)) {
          delete schema.lifeCycles;
        } else {
          schema.lifeCycles = __lifeCycles;
        }
      }
      // 自定义方法
      if ('__methods' in props) {
        if (!__methods || typeof __methods !== 'object' || isEmpty(__methods)) {
          delete schema.methods;
        } else {
          schema.methods = __methods;
        }
      }

      // 数据源设置
      if ('__dataSource' in props) {
        if (this.needContainerReload(schema.dataSource, __dataSource)) {
          schema.__ctx && ++schema.__ctx.idx;
        }
        if (__dataSource === undefined || (typeof __dataSource === 'object' && isEmpty(__dataSource))) {
          delete schema.dataSource;
        } else {
          schema.dataSource = __dataSource;
        }
      }

      // 如果scss值没有设置有效值，则删除schema中这个的字段
      if ('__scss' in props) {
        if (!__scss) {
          delete schema.scss;
        } else {
          schema.scss = __scss;
        }
      }
    }

    // 子组件
    if ('children' in props) {
      if (children === undefined || (typeof children === 'object' && isEmpty(children))) {
        delete schema.children;
      } else {
        schema.children = children;
      }
    }

    schema.props = {
      ...schema.props,
      ...otherProps
    };

    //过滤undefined属性
    Object.keys(schema.props).map(key => {
      if (schema.props[key] === undefined) {
        delete schema.props[key];
      }
    });

    this.rebuild(this.schema);
    this.emit('schemaHelper.material.afterUpdate');
  }

  createSchema(componentName, props, isContainer) {
    const schema = {
      componentName,
      props: props || {},
      __ctx: {
        lunaKey: ++this.lunaKey
      }
    };
    if (isContainer) {
      schema.children = [];
    }
    return schema;
  }

  rebuild(schema, isInit) {
    if (!isFileSchema(schema)) {
      debug('top schema should be a file type');
      //对于null的schema特殊处理一下
      if (schema === null) {
        this.schema = schema;
        this.emit(`schemaHelper.schema.${isInit ? 'afterInit' : 'afterUpdate'}`);
      }
      return;
    }
    this.blockTree = null;
    this.compTreeMap = {};
    this.compTree = null;
    this.schemaMap = {};
    this.blockSchemaMap = {};
    this.compCtxMap = {};
    const buildSchema = (schema, parentBlockNode, parentCompNode, path = '') => {
      if (Array.isArray(schema)) {
        return schema.map((item, idx) => buildSchema(item, parentBlockNode, parentCompNode, `${path}/${idx}`));
      } else if (typeof schema === 'object') {
        // 对于undefined及null直接返回
        if (!schema) return schema;
        //JSFunction转函数
        if (isJSFunction(schema)) {
          if (typeof schema.value === 'string') {
            let tarFun = parseObj(schema.value);
            if (typeof tarFun === 'function') {
              return tarFun;
            }
          } else if (typeof schema.value === 'function') {
            return schema.value;
          }
          return schema;
        }
        //如果是对象且是JSExpression
        if (isJSExpression(schema)) {
          return '{{' + schema.value + '}}';
        }
        const res = {};
        if (isSchema(schema)) {
          res.__ctx = schema.__ctx;
          if (!res.__ctx) {
            const lunaKey = `luna_${++keyIndex}`;
            res.__ctx = {
              idx: 0,
              lunaKey,
              lunaPath: path,
              parentKey: parentCompNode && parentCompNode.lunaKey,
              blockKey: parentBlockNode && parentBlockNode.lunaKey
            };
          } else {
            res.__ctx.lunaPath = path;
          }
          const label = schema.componentName + (schema.fileName ? '-' + schema.fileName : '');
          const lunaKey = res.__ctx && res.__ctx.lunaKey;
          this.schemaMap[lunaKey] = res;
          if (isFileSchema(schema)) {
            this.blockSchemaMap[lunaKey] = res;

            const blockNode = {
              label,
              lunaKey,
              isFile: true,
              children: []
            };
            this.compTreeMap[lunaKey] = blockNode;
            const compNode = clone(blockNode);
            if (parentBlockNode) {
              parentBlockNode.children.push(blockNode);
            } else {
              this.blockTree = blockNode;
            }
            parentBlockNode = blockNode;
            if (parentCompNode) {
              parentCompNode.children.push(compNode);
            } else {
              this.compTree = compNode;
            }
            parentCompNode = compNode;
          } else {
            const compNode = {
              label,
              lunaKey,
              children: []
            };
            parentCompNode.children.push(compNode);
            parentCompNode = compNode;
          }
        }
        forEach(schema, (val, key) => {
          if (key.startsWith('__')) {
            res[key] = val;
          } else {
            res[key] = buildSchema(val, parentBlockNode, parentCompNode, `${path}/${key}`);
          }
        });
        return res;
      }
      return schema;
    };
    this.emit(`schemaHelper.schema.${isInit ? 'beforeInit' : 'beforeUpdate'}`);
    this.schema = buildSchema(schema);
    this.emit(`schemaHelper.schema.${isInit ? 'afterInit' : 'afterUpdate'}`);
  }

  needContainerReload(preData = {}, nextData = {}) {
    if (
      typeof preData.dataHandler === 'function' &&
      typeof nextData.dataHandler === 'function' &&
      preData.dataHandler.toString() !== nextData.dataHandler.toString()
    ) {
      return true;
    } else if (preData.dataHandler !== nextData.dataHandler) {
      return true;
    }
    return !deepEqual(
      (preData.list || []).filter(item => item.isInit),
      (nextData.list || []).filter(item => item.isInit),
      (pre, next) => {
        if (typeof pre === 'function' && next === 'function') {
          return pre.toString() === next.toString();
        }
      }
    );
  }

  emit(msg, ...args) {
    this.appHelper && this.appHelper.emit(msg, ...args);
  }

  get(key) {
    return this[key];
  }

  getSchemaByPath(path) {
    return jsonuri.get(this.schema, path);
  }

  getSchema() {
    return this.schema;
  }

  getPureSchema() {
    return transformSchemaToPure(this.schema);
  }

  getPureSchemaStr() {
    return serialize(this.getPureSchema(), {
      unsafe: true
    });
  }

  getStandardSchema() {
    return transformSchemaToStandard(this.schema);
  }

  getStandardSchemaStr() {
    return serialize(this.getStandardSchema(), {
      unsafe: true
    });
  }
}

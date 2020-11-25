import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import env from '../../src/env';
import bus from 'editor-preset-vision/src/bus';
import { autorun } from '@ali/lowcode-editor-core';

describe('env 测试', () => {
  describe('常规 API 测试', () => {
    it('setEnv / getEnv / setEnvMap / set / get', () => {
      expect(env.getEnv('xxx')).toBeUndefined;

      const mockFn1 = jest.fn();
      const off1 = env.onEnvChange(mockFn1);

      const envData = { a: 1 };
      env.setEnv('xxx', envData);
      expect(env.getEnv('xxx')).toEqual(envData);
      expect(env.get('xxx')).toEqual(envData);
      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn1).toHaveBeenCalledWith(env.envs, 'xxx', envData);
      mockFn1.mockClear();

      // 设置相同的值
      env.setEnv('xxx', envData);
      expect(env.getEnv('xxx')).toEqual(envData);
      expect(env.get('xxx')).toEqual(envData);
      expect(mockFn1).not.toHaveBeenCalled();
      mockFn1.mockClear();

      // 设置另一个 envName
      const envData2 = { b: 1 };
      env.set('yyy', envData2);
      expect(env.getEnv('yyy')).toEqual(envData2);
      expect(env.get('yyy')).toEqual(envData2);
      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn1).toHaveBeenCalledWith(env.envs, 'yyy', envData2);
      mockFn1.mockClear();

      env.setEnvMap({
        zzz: { a: 1, b: 1 },
      });
      expect(env.getEnv('xxx')).toBeUndefined;
      expect(env.getEnv('yyy')).toBeUndefined;
      expect(env.getEnv('zzz')).toEqual({ a: 1, b: 1 });
      expect(mockFn1).toHaveBeenCalled();
      expect(mockFn1).toHaveBeenCalledWith(env.envs);
      mockFn1.mockClear();

      // 解绑事件
      off1();
      env.setEnvMap({
        zzz: { a: 1, b: 1 },
      });
      expect(mockFn1).not.toHaveBeenCalled();
      mockFn1.mockClear();
    });

    it('setLocale / getLocale', () => {
      expect(env.getLocale()).toBe('zh_CN');
      env.setLocale('en_US');
      expect(env.getLocale()).toBe('en_US');
    });

    it('setExpertMode / isExpertMode', () => {
      expect(env.isExpertMode()).toBeFalsy;
      env.setExpertMode('truthy value');
      expect(env.isExpertMode()).toBeTruthy;
    });

    it('getSupportFeatures / setSupportFeatures / supports', () => {
      expect(env.getSupportFeatures()).toEqual({});
      env.setSupportFeatures({
        mobile: true,
        pc: true,
      });
      expect(env.getSupportFeatures()).toEqual({
        mobile: true,
        pc: true,
      });
      expect(env.supports('mobile')).toBeTruthy;
      expect(env.supports('pc')).toBeTruthy;
      expect(env.supports('iot')).toBeFalsy;
    });

    it('getAliSchemaVersion', () => {
      expect(env.getAliSchemaVersion()).toBe('1.0.0');
    });

    it('envs obx 测试', async () => {
      const mockFn = jest.fn();
      env.clear();

      autorun(() => {
        mockFn(env.envs);
        env.envs;
      });

      await new Promise(resolve => setTimeout(resolve, 16));

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith({});

      env.setEnv('abc', { a: 1 });

      await new Promise(resolve => setTimeout(resolve, 16));
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith({ abc: { a: 1 } });
    });
  });
});

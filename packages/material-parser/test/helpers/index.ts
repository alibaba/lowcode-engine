import { join } from 'path';

const baseDir = join(__dirname, '../fixtures');

/**
 * 从 fixtures 下获取文件完整路径
 */
export const getFromFixtures = (...args: string[]) => {
  return join(baseDir, ...args);
};

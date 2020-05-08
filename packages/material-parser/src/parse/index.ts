const reactDocs = require('react-docgen');
import { transformItem } from './transform';
import { debug } from '../otter-core';
import { IMaterialParsedModel, IMaterialScanModel } from '../types';
import resolver from './resolver';
import handlers from './handlers';

export default function parse(params: { fileContent: string; filePath: string }): Promise<IMaterialParsedModel[]> {
  const { fileContent, filePath } = params;
  const result = reactDocs.parse(
    fileContent,
    (ast: any) => {
      ast.__path = filePath;
      return resolver(ast);
    },
    handlers,
    {
      filename: filePath,
    },
  );
  const coms = result.reduce((res: any[], info: any) => {
    if (!info || !info.props) return res;
    const props = Object.keys(info.props).reduce((acc: any[], name) => {
      try {
        const item: any = transformItem(name, info.props[name]);
        acc.push(item);
      } catch (e) {
      } finally {
        return acc;
      }
    }, []);
    res.push({
      componentName: info.displayName,
      props,
      meta: info.meta || {},
    });
    return res;
  }, []);
  return coms;
}

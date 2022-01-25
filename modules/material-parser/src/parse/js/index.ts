import { transformItem } from '../transform';
import { IMaterialParsedModel } from '../../types';
import { loadFile } from '../../utils';
import resolver from './resolver';
import handlers from './handlers';

const reactDocs = require('react-docgen');

export default function parse(filePath: string): IMaterialParsedModel[] {
  if (!filePath) return [];
  const fileContent = loadFile(filePath);
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
        // TODO
      }
      return acc;
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
